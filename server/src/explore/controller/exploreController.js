 
import { ExploreService } from '../services/exploreService.js';

 
export const startExplore = async (req, res) => {
  try {
    // Agar body mein userId nahi hai toh null pass hoga (Guest Mode)
    const { userId = null } = req.body; 

    console.log("🚀 Starting Session for User:", userId || "Guest");

    // Service ab handle karegi userId valid hai ya nahi
    const session = await ExploreService.createSession(userId);

    return res.status(201).json({
      success: true,
      data: {
        sessionId: session.sessionId,
        currentStep: session.currentStep,
      },
    });
  } catch (err) {
    console.error("❌ startExplore error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to start explore session",
    });
  }
};

 
export const handleExploreStep = async (req, res) => {
  try {
    const { sessionId, currentStep, payload } = req.body;

    if (!sessionId || !currentStep) {
      return res.status(400).json({ success: false, message: "sessionId and currentStep required" });
    }

    const result = await ExploreService.processStep(sessionId, currentStep, payload);

    return res.status(200).json({
      success: true,
      message: `Step ${currentStep} processed`,
      data: result, // Isme nextStep aur payload dono aayenge
    });
  } catch (err) {
    console.error("❌ handleExploreStep error:", err);
    return res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

 
export const completeExplore = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ success: false, message: "sessionId is required" });
    }

    const result = await ExploreService.completeSession(sessionId);

    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (err) {
    console.error("❌ completeExplore error:", err);
    return res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};