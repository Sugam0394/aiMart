
import Tool from "../../models/toolModel.js";
import { getTrendingToolsService , searchToolsService , getToolsByUseCase  , getStackByRole} from "../../services/toolServices.js";
import User from "../../models/userModel.js";
import ApiError from "../../utils/ApiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { WORKFLOW_CONFIG } from "../../moment/workFlowConfig.js";
 


// ✅ New Unified Home Data Controller (Fix 2)
export const getHomeData = asyncHandler(async (req, res) => {
  const { tags } = req.query;

  // ⚡ Parallel execution: Ek sath 4 queries hit hongi
  const [useCases, trending, rising, recommended] = await Promise.all([
    // 1. Use Cases logic (existing aggregation)
    Tool.aggregate([
      { $match: { status: "live" } },
      { $unwind: "$useCases" },
      { $group: { _id: "$useCases", count: { $sum: 1 } } },
      { $project: { _id: 0, key: "$_id", toolCount: "$count" } },
      { $sort: { toolCount: -1 } },
      { $limit: 20 }
    ]),

    // 2. Trending (Optimized service call jo humne theek ki thi)
    getTrendingToolsService({}), 

    // 3. Rising Tools logic
    Tool.find({ status: "live" })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("name tagline logo slug primaryCategory pricingType avgRating")
      .lean(),

    // 4. Recommended logic
    Tool.find({ status: "live" })
      .sort({ avgRating: -1 })
      .limit(10)
      .select("name tagline logo avgRating pricingType slug")
      .lean()
  ]);

  // Response format consistent rakhein
  return res.status(200).json(
    new ApiResponse(200, {
      useCases,
      trending,
      rising,
      recommended
    }, "Home data fetched successfully")
  );
});

 

 // Helper: Convert "blog-writing" → "Blog Writing"
 const humanizeUseCase = (key) => {
  // 1. Check agar key exist karti hai
  if (!key || typeof key !== 'string') return "";

  return key
    .split('-')
    .filter(word => word.length > 0) // Extra dashes handle karne ke liye
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

 // get Tool By Id
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



 

//  Section - 3: Get All Available Use Cases
export const getAvailableUseCases = asyncHandler(async (req, res) => {
  try {
    const useCases = await Tool.aggregate([
      // Step 1: Only live tools
      { $match: { status: "live" } },
      
      // Step 2: Unwind useCases array (expand each use case into separate doc)
      { $unwind: "$useCases" },
      
      // Step 3: Group by use case key and count tools
      {
        $group: {
          _id: "$useCases",
          count: { $sum: 1 },
          sampleTools: { 
            $push: { 
              name: "$name", 
              logo: "$logo",
              slug: "$slug"
            } 
          }
        }
      },
      
      // Step 4: Filter - only use cases with at least 3 tools
      { $match: { count: { $gte: 1 } } },
      
      // Step 5: Format output
      {
        $project: {
          _id: 0,
          key: "$_id",
          label: "$_id",
          toolCount: "$count",
          preview: { $slice: ["$sampleTools", 10] } // First 3 tools as preview
        }
      },
      
      // Step 6: Sort by tool count (most popular first)
      { $sort: { toolCount: -1 } },
      
      // Step 7: Limit to top 20 use cases
      { $limit: 25 }
    ]);

  
    // Humanize logic ko inline handle kar lo agar function issue de raha hai
    const formattedUseCases = useCases.map(uc => ({
      ...uc,
      label: uc.key.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    }));

    return res.status(200).json(
      new ApiResponse(
        200, 
        { useCases: formattedUseCases }, 
        "Use cases fetched successfully"
      )
    );

  } catch (error) {
    console.error("❌ Get Use Cases Error:", error);
   throw new ApiError(500, error.message || "Failed to fetch use cases");
  }
});


// =======================================
// Section 3: Get TOOLS by Specific Use Case
// ========================================
export const getToolsByUseCaseController = asyncHandler(async (req, res) => {
  try {
    const { useCaseKey } = req.params;

    // Normalize
    const normalizedKey = useCaseKey?.toLowerCase().trim();

    // Validation
    if (!normalizedKey) {
      throw new ApiError(400, "Invalid use-case key");
    }

    // Service call
    const tools = await getToolsByUseCase(normalizedKey);

    // Response with metadata
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          useCase: {
            key: normalizedKey,
            label: humanizeUseCase(normalizedKey)
          },
          count: tools.length,
          tools
        },
        "Tools fetched successfully"
      )
    );

  } catch (error) {
    console.error(`❌ Use-case Error [${req.params.useCaseKey}]:`, error);
    throw new ApiError(500, "Failed to fetch tools by use-case");
  }
});

 

 // Section - 4: Rising Tools (FIXED VERSION)
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
    .select("name tagline logo slug primaryCategory pricingType avgRating")
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

    // Fallback: Agar tools kam hain toh latest tools se fill karo
    if (tools.length < 4) {
      const fallback = await Tool.find({ 
        status: "live", 
        _id: { $nin: tools.map(t => t._id) } 
      })
      .select("name tagline logo slug primaryCategory pricingType avgRating")
      .sort({ createdAt: -1 })
      .limit(8 - tools.length)
      .lean();
      
      tools = [...tools, ...fallback];
    }

    res.status(200).json({ success: true, count: tools.length, data: tools });
  } catch (error) {
    console.error("❌ getRisingTools Error:", error);
    res.status(200).json({ success: true, count: 0, data: [] });
  }
};


// Section - 5: Recommended Tools (FIXED VERSION)
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
      .select("name tagline logo avgRating pricingType slug useCases")
      .sort(sortOption)
      .limit(10)
      .lean();

    // Case 2: Smart Fallback (Agar results 4 se kam hain)
    // Hum global popular tools add kar denge taaki UI bhara rahe
    if (recommended.length < 4) {
      const idsToSkip = recommended.map(t => t._id);
      const fallbackTools = await Tool.find({ 
        status: "live", 
        _id: { $nin: idsToSkip } 
      })
      .select("name tagline logo avgRating pricingType slug")
      .sort({ avgRating: -1 })
      .limit(8 - recommended.length)
      .lean();

      recommended = [...recommended, ...fallbackTools];
    }

    res.status(200).json({
      success: true,
      count: recommended.length,
      data: recommended,
      basedOnInterests: !!tags // Frontend ko batane ke liye ki ye personalized hai
    });
  } catch (error) {
    console.error("❌ getRecommendedTools Error:", error);
    res.status(200).json({ 
      success: true, 
      count: 0, 
      data: [], 
      basedOnInterests: false 
    });
  }
};


 
 
// Section - 6: Get Workflow by Role (Optimized with Config and DB)
export const getWorkflowByRole = async (req, res) => {
  try {
    const { role } = req.params;
    
    // 1. Role match (Case insensitive)
    const roleKey = role?.toLowerCase();
    const config = WORKFLOW_CONFIG[roleKey];

    if (!config) {
      // 404 bhej rahe hain par format wahi rakh rahe hain taaki frontend crash na ho
      return res.status(404).json(
        new ApiResponse(404, null, `Workflow for role '${role}' not found`)
      );
    }

    // 2. Database se tools fetch karna (Optimized)
    const slugs = config.steps.map(s => s.toolSlug);
    const tools = await Tool.find({ 
      slug: { $in: slugs }, 
      status: "live" 
    })
    .select("_id name logo slug pricingType tagline")
    .lean();

    // 3. Mapping tools for quick O(1) lookup
    const toolMap = {};
    tools.forEach(t => { 
      toolMap[t.slug] = t; 
    });

    // 4. Populate steps (Safe Fallback ke saath)
    const steps = config.steps.map(step => ({
      ...step,
      tool: toolMap[step.toolSlug] || { 
        name: step.toolSlug.charAt(0).toUpperCase() + step.toolSlug.slice(1), 
        slug: step.toolSlug, 
        logo: null, 
        pricingType: "freemium",
        tagline: "AI Tool"
      }
    }));

    // 5. Success Response
    return res.status(200).json(
      new ApiResponse(200, {
        role: roleKey, // Yeh Redux ke liye bahut important hai
        headline: config.headline,
        subline: config.subline,
        timeSaved: config.timeSaved,
        steps: steps
      }, "Workflow fetched successfully")
    );

  } catch (err) {
    console.error("Workflow Controller Error:", err);
    return res.status(500).json(
      new ApiResponse(500, null, "Internal server error while fetching workflow")
    );
  }
};


// Section - 7: Get Tools By Use-Case Service (Optimized with Intent Expansion) 
export const getStack = asyncHandler(async (req, res) => {
 
  const { role } = req.params;

 
  const validRoles = ['founder', 'marketer', 'creator', 'designer', 'developer', 'freelancer', 'student'];

  if (!validRoles.includes(role)) {
    throw new ApiError(400, 'Invalid role');
  }

  // 3. Service call karke stack data mangwao
  const stack = await getStackByRole(role);

  // 4. Agar stack nahi milta toh 404
  if (!stack) {
    throw new ApiError(404, 'Stack not found for this role');
  }

  // 5. Success response bhejo
  return res.status(200).json(
    new ApiResponse(200, stack, 'Stack fetched successfully')
  );
});

  

 