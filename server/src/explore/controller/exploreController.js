import ExploreSession from "../exploreModel/exploreModel.js";
import { ExploreService} from '../services/exploreService.js'
import { momentMapper } from "../utils/momentMapper.js";

 
 
 


// Start a new explore session
 export const startExplore = async (req, res) => {
  try {
    const { userId } = req.body;

    console.log("REQ BODY:", req.body);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const session = await ExploreService.createSession(userId);

    return res.status(201).json({
      success: true,
      data: {
        sessionId: session.sessionId,
        currentStep: session.currentStep || "INTENT",
      },
    });
  } catch (err) {
    console.error("startExplore error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to start explore session",
    });
  }
};


// Handle each step in the explore flow
export const handleExploreStep = async (req, res) => {
  try {
    const { sessionId, currentStep, payload } = req.body;


    // Check if everything is coming through
    console.log("Processing Step:", currentStep, "for session:", sessionId);

    
    if (!sessionId || !currentStep) {
      return res.status(400).json({ success: false, message: "sessionId and currentStep required" });
    }

    const updatedSession = await ExploreService.processStep(sessionId, currentStep, payload);

    return res.status(200).json({
      success: true,
      message: "Step processed successfully",
      data: updatedSession,
    });
  } catch (err) {
    console.error("handleExploreStep error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


// Complete the explore session
 // controller/exploreController.js

 export const completeExplore = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: "sessionId is required" });
    }

    // Khud logic likhne ke bajaye Service ka method call karein
    const result = await ExploreService.completeSession(sessionId);

    return res.status(200).json({
      success: true,
      ...result
    });

  } catch (err) {
    console.error("❌ completeExplore error:", err);
    return res.status(500).json({ 
      success: false, 
      message: err.message || "Server error" 
    });
  }
};