 import api from "../axios";


 // 1️⃣ Start Explore Session
 export const startExplore = async (userId) => { 
  const response = await api.post("/start", { userId });
  return response.data; 
};

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