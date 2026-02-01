import asyncHandler from "../utils/asyncHandler.js";
 import ApiResponse from '../utils/ApiResponse.js'
 import User from '../models/userModel.js'
 import ApiError from "../utils/ApiError.js";
 import ToolOwnerRequest from "../models/toolFormModel.js";
 import Tool from '../models/toolModel.js'




 // Get all pending Tool sumit request by toolOwner
 export const getPendingToolOwnerRequests = asyncHandler(async (req, res) => {
   const requests = await ToolOwnerRequest.find({ status: "pending" })
    .populate("applicant", "email role")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, requests, "Pending ToolOwner requests fetched")
  );

  
});


// Approve or reject a ToolOwner request (SAFE)
export const handleToolOwnerRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const { action, reviewNote } = req.body; // action = "approve" | "reject"


 if (!["approve", "reject"].includes(action)) {
    throw new ApiError(400, "Invalid action");
  }





  // 1️⃣ Find request
  const request = await ToolOwnerRequest.findById(requestId).populate("applicant", "email role");
  if (!request) throw new ApiError(404, "Request not found");

  // 2️⃣ Check pending status
  if (request.status !== "pending")
     throw new ApiError(400, "Request already reviewed");

  

  // 3️⃣ Approve
  if (action === "approve") {
    request.status = "approved";
    request.reviewedBy = req.user._id;
    request.reviewNote = reviewNote || "";
    await request.save();

    // ✅ Update user role safely
    const applicantId = request.applicant._id ? request.applicant._id : request.applicant;
    const updatedUser = await User.findByIdAndUpdate(
      applicantId,
      { role: "toolOwner" },
      { new: true } // return updated document
    );

  
  }

  // 4️⃣ Reject
  if (action === "reject") {
    request.status = "rejected";
    request.reviewedBy = req.user._id;
    request.reviewNote = reviewNote || "";
    request.rejectedAt = new Date(); // 🔥 future cooldown
    await request.save();
  }

  // 5️⃣ Response
  return res.status(200).json(
    new ApiResponse(200, { status: request.status }, `Request ${action}d successfully`)
  );
});

export const getApprovedToolOwnerRequests = asyncHandler(async (req, res) => {
  const approvedRequests = await ToolOwnerRequest.find({
    status: "approved",
  })
    .populate("applicant", "email")
    .populate("reviewedBy", "email")
    .sort({ updatedAt: -1 });

    if (!approvedRequests.length) {
  return res.status(200).json(
    new ApiResponse(200, [], "No approved ToolOwners yet")
  );
}


  return res.status(200).json(
    new ApiResponse(200, approvedRequests, "Approved ToolOwners fetched")
  );
});





// ===============================
// 1️⃣ Get all pending tools
// ===============================
export const getPendingTools = async (req, res) => {
  try {
    const tools = await Tool.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .populate("createdBy", "email role");

    res.status(200).json({
      success: true,
      count: tools.length,
      data: tools,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending tools",
    });
  }
};



// ===============================
// 2️⃣ Approve tool
// ===============================
export const approveTool = async (req, res) => {
  try {
    const { toolId } = req.params;

    const tool = await Tool.findById(toolId);
    if (!tool) {
      return res.status(404).json({
        success: false,
        message: "Tool not found",
      });
    }

    tool.status = "live";
    await tool.save();

    res.status(200).json({
      success: true,
      message: "Tool approved and is now live",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Tool approval failed",
    });
  }
};


 
// 3️⃣ Reject tool
// ===============================
export const rejectTool = async (req, res) => {
  try {
    const { toolId } = req.params;

    const tool = await Tool.findById(toolId);
    if (!tool) {
      return res.status(404).json({
        success: false,
        message: "Tool not found",
      });
    }

    tool.status = "rejected";
    await tool.save();

    res.status(200).json({
      success: true,
      message: "Tool rejected",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Tool rejection failed",
    });
  }
};

export const getApprovedTools = async (req, res) => {
  try {
    const tools = await Tool.find({ status: "live" })
      .sort({ updatedAt: -1 })
      .populate("createdBy", "email role");

    res.status(200).json({
      success: true,
      count: tools.length,
      data: tools,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch approved tools",
    });
  }
};


 

 








