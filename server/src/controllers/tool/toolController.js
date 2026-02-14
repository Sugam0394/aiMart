
import Tool from "../../models/toolModel.js";
import Review from "../../models/reviewModel.js";
import { getTrendingToolsService , searchToolsService , getToolsByUseCase } from "../../services/toolServices.js";
import useCaseMeta from "../../moment/useCaseMeta.js";
import User from "../../models/userModel.js";

// Frontend ko AI-ART page ke liye clean, trusted tool data dena —
// sirf 1 tool, 1 curated review, slug ke basis pe.
// Controller
 export const getToolById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId; // Auth middleware se user ID uthayenge (optional chaining)

    const tool = await Tool.findOne({ _id: id, status: "live" })
      .populate({
        path: "review",
        match: { status: "approved" },
        // Purana: select: "comment rating"
        // Naya: rating breakdown bhi chahiye
        select: "comment rating approvedAt", 
      });

    if (!tool) {
      return res.status(404).json({ success: false, message: "Tool not found" });
    }

    // 🔹 Logic: Check if user has saved this tool
    let isSaved = false;
    if (userId) {
      const user = await User.findById(userId);

     if (user && user.savedTools) {
  isSaved = user.savedTools.some(
    toolId => toolId.toString() === id
  );
}
    }
  const toolData = tool.toObject();


    // Response ko merge kar rahe hain extra info ke saath
    res.status(200).json({
      success: true,
      data: {
        ...toolData, // Tool ka sara data
        isSaved // Frontend isse dekh kar heart icon fill karega
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


 

// Section-1: Trending Tools Controller
export const getTrendingTools = async (req, res, next) => {
  try {
    const { intent, category } = req.query;

    // ✅ Input validation
    if (intent && typeof intent !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid intent parameter'
      });
    }

    const tools = await getTrendingToolsService({ intent, category });

    res.status(200).json({
      success: true,
      count: tools.length,
      data: tools,
    });
  } catch (error) {
    console.error('❌ Trending Tools Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trending tools'
    });
  }
};



 
 // Section-2: Search Tools Controller
export const searchToolsController = async (req, res) => {

  try {

    const term = req.query.term?.trim() || '';

    const category = req.query.category?.trim() || '';



    if (!term && !category) {

      return res.status(200).json({

        success: true,

        count: 0,

        tools: [],

      });

    }



    const tools = await searchToolsService(term, category);



    res.status(200).json({

      success: true,

      count: tools.length, // ✅ Add count

      tools,

    });

  } catch (error) {

    console.error('❌ Search Error:', error);

    res.status(500).json({

      success: false,

      message: 'Search failed',

    });

  }

};





// Section-3: Use-Case Controller  
 export const getToolsByUseCaseController = async (req, res) => {
  try {
    const { useCaseKey } = req.params;

    // 🔍 Normalize (safety)
    const normalizedKey = useCaseKey?.toLowerCase().trim();

    // ✅ Validation
    if (!normalizedKey || !useCaseMeta[normalizedKey]) {
      return res.status(400).json({
        success: false,
        message: "Invalid use-case key",
      });
    }

    // 🔥 Service call
    const tools = await getToolsByUseCase(normalizedKey);

    return res.status(200).json({
      success: true,
      meta: useCaseMeta[normalizedKey],
      count: tools.length,
      tools,
    });

  } catch (error) {
    console.error(`❌ Use-case Error [${req.params.useCaseKey}]:`, error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch tools by use-case",
    });
  }
};




// Section - 4  Rising Tools
export const getRisingTools = async (req, res) => {
  try {
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

    // Primary search: Featured, Popular, or New
    let tools = await Tool.find({
      status: "live",
      $or: [
        { isFeatured: true },
        { isPopular: true },
        { createdAt: { $gte: fifteenDaysAgo } }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(10);

    // Fallback: Agar tools kam hain toh latest tools se fill karo
    if (tools.length < 4) {
      const fallback = await Tool.find({ 
        status: "live", 
        _id: { $nin: tools.map(t => t._id) } 
      })
      .sort({ createdAt: -1 })
      .limit(8 - tools.length);
      
      tools = [...tools, ...fallback];
    }

    res.status(200).json({ success: true, data: tools });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// Section - 5 recommend Tools
export const getRecommendedTools = async (req, res) => {
  try {
    // Frontend se tags aayenge query params mein: ?tags=study,writing
    const { tags } = req.query;
    let query = { status: "live" };
    let sortOption = { isFeatured: -1, avgRating: -1 };

    // Case 1: Agar User ke paas Interests (tags) hain
    if (tags && tags.length > 0) {
      const tagsArray = tags.split(",");
      
      query.$or = [
        { intentTags: { $in: tagsArray } },
        { primaryCategory: { $in: tagsArray } },
        { useCases: { $in: tagsArray } }
      ];
    } 

    // Execute Query
    let recommended = await Tool.find(query)
      .sort(sortOption)
      .limit(10)
      .select("name tagline logo avgRating pricingType slug useCases");

    // Case 2: Smart Fallback (Agar results 4 se kam hain)
    // Hum global popular tools add kar denge taaki UI bhara rahe
    if (recommended.length < 4) {
      const idsToSkip = recommended.map(t => t._id);
      const fallbackTools = await Tool.find({ 
        status: "live", 
        _id: { $nin: idsToSkip } 
      })
      .sort({ avgRating: -1 })
      .limit(8 - recommended.length);

      recommended = [...recommended, ...fallbackTools];
    }

    res.status(200).json({
      success: true,
      count: recommended.length,
      data: recommended,
      basedOnInterests: !!tags // Frontend ko batane ke liye ki ye personalized hai
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Section 6 getQuick solution

export const getQuickSolution = async (req, res) => {
  try {
    const { action } = req.query;  

    if (!action) {
      return res.status(400).json({ success: false, message: "Action slug is required" });
    }

    // Hum un tools ko dhund rahe hain jinke 'useCases' array mein ye action slug ho
    const tools = await Tool.find({
      status: "live",
      useCases: { $in: [action] } 
    })
    .sort({ isPopular: -1, avgRating: -1 }) // Top tools pehle
    .limit(3) // Sirf top 3, comparison ke liye best hai
    .select("name tagline logo avgRating pricingType slug useCases");

    res.status(200).json({
      success: true,
      data: tools
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

 