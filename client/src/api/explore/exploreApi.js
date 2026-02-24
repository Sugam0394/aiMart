 import api from "../axios";

// 1️⃣ Start Explore Session (userId optional hai)
export const startExplore = async (userId = null) => { 
  const response = await api.post("/start", { userId });
  return response.data; 
};

// 2️⃣ Submit Explore Step (Same rahega)
export const submitExploreStep = async ({ sessionId, currentStep, stepData }) => {
  const response = await api.post("/step", { 
    sessionId, 
    currentStep, 
    payload: stepData 
  });
  return response.data;
};

// 3️⃣ Complete Explore Flow
export const completeExplore = async (sessionId) => {
  const response = await api.post("/complete", {
    sessionId,
  });
  return response.data;
};