import ExploreSession from "../exploreModel/exploreModel.js";

 import { ExploreService} from '../services/exploreService.js'

 
 
 


// Start a new explore session
export const startExplore = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    // Service handles session creation
    const session = await ExploreService.createSession(userId);

    return res.status(201).json({
      success: true,
      message: "Explore session started",
      data: session,
    });
  } catch (err) {
    console.error("startExplore error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


// Handle each step in the explore flow
export const handleExploreStep = async (req, res) => {
  try {
    const { sessionId, currentStep, payload } = req.body;

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
export const completeExplore = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: "sessionId is required" });
    }

    const completedSession = await ExploreService.completeSession(sessionId);

    return res.status(200).json({
      success: true,
      message: "Explore session completed",
      data: completedSession,
    });
  } catch (err) {
    console.error("completeExplore error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};