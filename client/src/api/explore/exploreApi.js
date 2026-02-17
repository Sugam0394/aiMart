 import api from "../axios";


 // 1️⃣ Start Explore Session
 // exploreApi.js mein
export const startExplore = async () => {
  const response = await api.post("/start", {
   // userId: "697f937de449c3744dc355d6", // Valid ObjectId string
  });
  return response.data;
};



 export const submitExploreStep = async ({ sessionId, currentStep, stepData }) => {
  const response = await api.post("/step", { 
    sessionId, 
    currentStep, // Backend ko batao abhi kaunsa step chal raha hai
    payload: stepData // backend payload expect kar raha hai
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