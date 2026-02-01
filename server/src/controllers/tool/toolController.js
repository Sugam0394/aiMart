
import Tool from "../../models/toolModel.js";
import Review from "../../models/reviewModel.js";
import { getTrendingToolsService , searchToolsService , getToolsByUseCase } from "../../services/toolServices.js";
 
 

// Frontend ko AI-ART page ke liye clean, trusted tool data dena —
// sirf 1 tool, 1 curated review, slug ke basis pe.
// Controller
export const getToolById = async (req, res) => {
  try {
    const { id } = req.params; // _id from URL

    // Find tool by _id and status live, populate reviews
    const tool = await Tool.findOne({ _id: id, status: "live" })
      .populate({
          path: "review", // ye Tool schema me defined hai
        model: "Review", // ✅ explicitly tell mongoose which model to use
        match: { status: "approved" },
        select: "comment rating",
        options: { strictPopulate: false },
      })
      .select(
        "name logo tagline pricing outputTypes description externalUrl review"
      );

    if (!tool) {
      return res.status(404).json({
        success: false,
        message: "Tool not found",
      });
    }

    res.status(200).json({
      success: true,
      data: tool,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tool",
      error: error.message,
    });
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

    // 🚨 Validation
    if (!useCaseKey) {
      return res.status(400).json({
        success: false,
        message: "Use-case key is required",
      });
    }

    // 🔹 Service call
    const tools = await getToolsByUseCase(useCaseKey);

    // 🔹 Response
    return res.status(200).json({
      success: true,
      useCase: useCaseKey,
      count: tools.length,
      tools,
    });

  } catch (error) {
    // 🔥 Log for dev
    console.error("Use-case tools error:", error);

    // 🔹 Response for client
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tools for use-case",
    });
  }
};

