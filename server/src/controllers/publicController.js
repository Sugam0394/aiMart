import Tool from '../models/toolModel.js'
import User from '../models/userModel.js'

// Public tools (live status)
 export const getPublicTools = async (req, res) => {
  try {
    const tools = await Tool.find({ status: "live" })
      .select(
        `
        name
        slug
        tagline
        logo
        pricingType
        outputType
        primaryCategory
        `
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: tools,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load public tools",
    });
  }
};



// Save/Unsave tool for logged-in users
 export const toggleSaveTool = async (req, res) => {
  try {
    const { toolId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId); // Fresh fetch from DB

    const index = user.savedTools.indexOf(toolId);
    if (index > -1) {
      user.savedTools.splice(index, 1); // Remove
    } else {
      user.savedTools.push(toolId); // Add
    }

    await user.save();
    res.status(200).json({
      success: true,
      isSaved: index === -1 // Agar pehle nahi tha, toh ab saved hai
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



 // Saved tools for logged-in users (populate karke details laenge)
export const getSavedTools = async (req, res) => {
  try {
    // req.user middleware (verifyJWT) se mil raha hai
    const user = await User.findById(req.user._id).populate({
      path: "savedTools",
      select: "name logo tagline primaryCategory pricingType status", // Zaruri fields
      match: { status: "live" } // Sirf wo tools jo active hain
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      count: user.savedTools.length,
      data: user.savedTools
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


