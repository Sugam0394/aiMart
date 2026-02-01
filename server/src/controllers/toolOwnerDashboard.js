import Tool from "../models/toolModel.js";
import  uploadToCloudinary from "../middlewares/cloudinaryUpload.js";

 

export const createTool = async (req, res) => {
  try {
    const {
      name,
      tagline,
      description,
      url,
      primaryCategory,
      categories,
      intentTags,
      outputType,
      toolType,
      usageMode,
      pricingType,
     

    } = req.body;

  
    // 🔒 CHECK: Already pending tool exists?
    const existingPendingTool = await Tool.findOne({
      createdBy: req.user._id,
      status: "pending",
    });

    if (existingPendingTool) {
      return res.status(403).json({
        success: false,
        message:
          "You already have a tool pending for approval. Please wait for founder review.",
      });
    }

    // 🔒 Minimal validation (core fields)
    if (
      !name ||
      !description ||
      !url ||
      !primaryCategory ||
      !toolType ||
      !intentTags ||
      intentTags.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // 🔴 LOGO REQUIRED CHECK
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Tool logo is required for listing",
      });
    }

    // 🖼️ Upload logo
    const logoUrl = await uploadToCloudinary(req.file.path);



    const tool = await Tool.create({
      name,
      tagline,
      description,
      url,
      logo: logoUrl,
      primaryCategory,
      categories,
      intentTags,
      outputType,
      toolType,
      usageMode,
      pricingType,


      // 🔐 Backend controlled
      status: "pending",
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Tool submitted for review",
      toolId: tool._id,
    });

  } catch (error) {
     console.error("❌ CREATE TOOL ERROR:", error);

  res.status(500).json({
    success: false,
    message: error.message,
    stack: error.stack, // sirf dev ke liye
    });
  }
};



export const getMyTools = async (req, res) => {
  try {
    const tools = await Tool.find({
      createdBy: req.user._id,
    })
      .select("name primaryCategory status createdAt")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      tools,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tools",
    });
  }
};


export const updateTool = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.toolId);

    if (!tool) {
      return res.status(404).json({ message: "Tool not found" });
    }

    // ownership check
    if (tool.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // status check
    if (tool.status !== "live") {
      return res.status(403).json({
        message: "Only live tools can be edited",
      });
    }

    // allowed updates (control me rakho)
    const allowedFields = [
      "name",
      "tagline",
      "description",
      "url",
      "primaryCategory",
      "categories",
      "intentTags",
      "outputType",
      "usageMode",
      "pricingType",
      "logo",
    ];

     // 🔹 File handle
    if (req.file) {
      tool.logo = req.file.path; // ya path jaha save ho raha
    }

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== "") {
        // agar array fields JSON string me aaye → parse
        if (["categories", "intentTags", "outputType"].includes(field)) {
          try {
            tool[field] = JSON.parse(req.body[field]);
          } catch {
            tool[field] = req.body[field]; // fallback
          }
        } else {
          tool[field] = req.body[field];
        }
      }
    });

    await tool.save();

    

    res.json({
      success: true,
      message: "Tool updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const deleteTool = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.toolId);

    if (!tool) {
      return res.status(404).json({ message: "Tool not found" });
    }

    if (tool.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (tool.status !== "live") {
      return res.status(403).json({
        message: "Only live tools can be deleted",
      });
    }

    await tool.deleteOne();

    res.json({
      success: true,
      message: "Tool deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
