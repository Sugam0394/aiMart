import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import ToolOwnerRequest from "../models/toolFormModel.js";
import User from "../models/userModel.js";
import Tool from "../models/toolModel.js";
 
 


// user request to become toolOwner
 const requestToolOwner = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { toolName, website, description, proofLinks } = req.body;

  if (!toolName || !description) {
    throw new ApiError(400, "Tool name and description are required");
  }

  const existingRequest = await ToolOwnerRequest.findOne({
    applicant: userId,
  });

  // ❌ pending or approved → block
  if (existingRequest && existingRequest.status !== "rejected") {
    throw new ApiError(
      400,
      `Request already ${existingRequest.status}`
    );
  }

  // ⏳ rejected → cooldown check
  if (existingRequest && existingRequest.status === "rejected") {
    const daysPassed =
      (Date.now() - existingRequest.rejectedAt) / (1000 * 60 * 60 * 24);

    if (daysPassed < 7) {
      throw new ApiError(400, "You can reapply after 7 days");
    }

    // 🔁 reapply
    existingRequest.toolName = toolName;
    existingRequest.website = website;
    existingRequest.description = description;
    existingRequest.proofLinks = proofLinks;
    existingRequest.status = "pending";
    existingRequest.rejectedAt = null;
    existingRequest.reviewNote = null;
    existingRequest.reviewedBy = null;
    existingRequest.reapplyCount += 1;

    await existingRequest.save();

    return res.json(
      new ApiResponse(200, existingRequest, "Reapplied successfully")
    );
  }

  // 🆕 first-time apply
  const request = await ToolOwnerRequest.create({
    applicant: userId,
    toolName,
    website,
    description,
    proofLinks,
  });

  return res.status(201).json(
    new ApiResponse(201, request, "ToolOwner request submitted successfully")
  );
});



const getMyToolOwnerRequest = asyncHandler(async (req, res) => {
  const request = await ToolOwnerRequest.findOne({
    applicant: req.user._id,
  }).select("status reviewNote reapplyCount createdAt");

  if (!request) {
    return res.json(
      new ApiResponse(200, null, "No request found")
    );
  }

  res.json(
    new ApiResponse(200, request, "Request status fetched")
  );
});

// 1. Save Prompt to DB
const savePrompt = asyncHandler(async (req, res) => {
    const { role, task, content } = req.body;

    if (!content) {
        throw new ApiError(400, "Prompt content is required");
    }

    const user = await User.findById(req.user._id);
    
    // Check if already saved (optional)
    const isDuplicate = user.savedPrompts.find(p => p.content === content);
    if (isDuplicate) {
        return res.status(200).json(new ApiResponse(200, user.savedPrompts, "Prompt already in workspace"));
    }

    user.savedPrompts.push({ role, task, content });
    await user.save();

    res.status(200).json(new ApiResponse(200, user.savedPrompts, "Prompt saved successfully"));
});

 
// 3. Get Saved Prompts from DB
const getSavedPrompts = asyncHandler(async (req, res) => {
    // User ko find karo login ID se
    const user = await User.findById(req.user._id);
    
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Saved prompts return karo
    res.status(200).json(
        new ApiResponse(200, user.savedPrompts, "Fetched saved prompts successfully")
    );
});

 
 

// 2. Remove Prompt from DB
 const removePrompt = asyncHandler(async (req, res) => {
    const { promptId } = req.params;
    
    const user = await User.findById(req.user._id);
    user.savedPrompts = user.savedPrompts.filter(p => p._id.toString() !== promptId);
    await user.save();

    res.status(200).json(new ApiResponse(200, user.savedPrompts, "Prompt removed from workspace"));
});


export {

 requestToolOwner, getMyToolOwnerRequest , savePrompt , removePrompt , getSavedPrompts

}