 
import Review from "../models/reviewModel.js";
import Tool from "../models/toolModel.js";

// review.controller.js
 export const createReview = async (req, res) => {
  try {
    const { toolId, utility, easeOfUse, valueForMoney, comment } = req.body;

    // 1. Pehle Tool find karo taaki uska owner mil sake
    const tool = await Tool.findById(toolId);
    if (!tool) {
      return res.status(404).json({ success: false, message: "Tool not found" });
    }
    // Calculate Average on the fly
         const avg = ((utility + easeOfUse + valueForMoney) / 3).toFixed(1);

         
    // 2. Review create karo
    const newReview = await Review.create({
      tool: toolId,
      toolOwner: tool.createdBy, // Tool schema se owner ki ID uthayi
      rating: { 
        utility, 
        easeOfUse, 
        valueForMoney,
        average: avg 
      },
      comment,
      status: "approved" 
    });

    // 3. Tool model mein review link karo
    tool.review = newReview._id;
    await tool.save();

    res.status(201).json({ 
      success: true, 
      message: "Review submitted for moderation",
      data: newReview 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


