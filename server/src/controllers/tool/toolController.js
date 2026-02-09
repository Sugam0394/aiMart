
import Tool from "../../models/toolModel.js";
import Review from "../../models/reviewModel.js";
import { getTrendingToolsService , searchToolsService , getToolsByUseCase } from "../../services/toolServices.js";
import useCaseMeta from "../../moment/useCaseMeta.js";
 

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
      isSaved = user.savedTools.includes(id);
    }

    // Response ko merge kar rahe hain extra info ke saath
    res.status(200).json({
      success: true,
      data: {
        ...tool._doc, // Tool ka sara data
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

   

    const tools = await getTrendingToolsService({
      intent,
      category,
    });

    res.status(200).json({
      success: true,
      data: tools,
    });
  } catch (error) {
    next(error);
  }
};

 

// section - 2: Search Tools Controller
export const searchToolsController = async (req, res) => {
  try {
    const term = req.query.term?.trim() || '';
    const category = req.query.category?.trim() || '';

    if (!term && !category) {
      return res.status(200).json({
        success: true,
        tools: [],
      });
    }

    const tools = await searchToolsService(term, category);

    res.status(200).json({
      success: true,
      tools,
    });
  } catch (error) {
    console.error('Search Controller Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search tools',
    });
  }
};
 


// section - 3: Get Tools by Use-Case Controller
 export const getToolsByUseCaseController = async (req, res) => {
  try {
    const { useCaseKey } = req.params;
  console.log("DEBUG 5: Backend Received Key ->", useCaseKey);
    if (!useCaseKey || !useCaseMeta[useCaseKey]) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing Use-case key",
      });
    }

    const tools = await getToolsByUseCase(useCaseKey);

    console.log(`DEBUG 6: Tools Found in DB for ${useCaseKey} ->`, tools.length);

    // AI Powered Response: Frontend ko title/subtitle bhi yahi se bhej rahe hain
    return res.status(200).json({
      success: true,
      meta: useCaseMeta[useCaseKey], // Title aur Subtitle backend se jayega
      count: tools.length,
      tools,
    });

  } catch (error) {
    console.error(`❌ Error in use-case [${req.params.useCaseKey}]:`, error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching tools",
    });
  }
};

