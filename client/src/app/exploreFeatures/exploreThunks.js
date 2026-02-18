import { createAsyncThunk } from "@reduxjs/toolkit";
import { exploreFailure , exploreStart , exploreSuccess } from "./exploreSlice";
import { startExplore , submitExploreStep , completeExplore } from "../../api/explore/exploreApi";

 
 

 

// 1️⃣ Start Explore Session
 
 export const startExploreThunk = createAsyncThunk(
  "explore/start",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();

    

      // 1️⃣ Safely extract user
      const user = state.auth?.user;

      if (!user) {
      
        return rejectWithValue("User login required");
      }

      // 2️⃣ Handle all possible ID formats (Mongo + normalized + custom)
      const userId =
        user._id ||
        user.id ||
        user.userId;

      

      if (!userId) {
       
        return rejectWithValue("User login required");
      }

      // 3️⃣ Call backend
      const response = await startExplore(userId);

     

      // 4️⃣ Backend structure: { success: true, data: {...} }
      const data = response?.data;

       

      if (!data || !data.sessionId) {
       
        return rejectWithValue("Backend did not return sessionId");
      }

  

      return data; // { sessionId, currentStep }

    } catch (error) {
      console.error("💥 START EXPLORE ERROR:", error);
      return rejectWithValue(
        error?.response?.data?.message || "Failed to start session"
      );
    }
  }
);



// 2️⃣ Submit Explore Step
export const submitExploreStepThunk = createAsyncThunk(
  "explore/submitStep",
  async ({ sessionId, currentStep, stepData }, { dispatch, rejectWithValue }) => {
    try {
      // Step submission ke liye hum manually exploreStart call kar sakte hain loading ke liye
      dispatch(exploreStart());

    const rawResponse = await submitExploreStep({ sessionId, currentStep, stepData });

    const response = rawResponse?.data; // 👈 IMPORTANT

      
      // Tracking selection logic
      let lastSelection = null;
      if (currentStep === "INTENT") {
        lastSelection = { type: "intent", value: stepData.intent };
      } else if (currentStep === "USE_CASE") {
        lastSelection = { type: "useCase", value: stepData.useCase };
      } else if (currentStep === "TOOLS") {
        lastSelection = { type: "tools", value: stepData.toolIds };
      }

      // Manual dispatch for success to handle the complex selections logic in your slice
      dispatch(
        exploreSuccess({
          sessionId,
          step: response.nextStep,
          payload: response.payload,
          lastSelection,
        })
      );
      
      return response;
    } catch (error) {
      const message = error?.response?.data?.message || "Step failed";
      dispatch(exploreFailure(message));
      return rejectWithValue(message);
    }
  }
);

// 3️⃣ Complete Explore (future use)
export const completeExploreThunk = createAsyncThunk(
  "explore/complete",
  async (sessionId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(exploreStart());

      const response = await completeExplore(sessionId);

      dispatch(
        exploreSuccess({
          sessionId: response.sessionId,
          step: response.nextStep || null,
          payload: response.payload || null,
        })
      );
    } catch (error) {
      dispatch(
        exploreFailure(
          error?.response?.data?.message || "Failed to complete explore"
        )
      );
      return rejectWithValue(error);
    }
  }
);
