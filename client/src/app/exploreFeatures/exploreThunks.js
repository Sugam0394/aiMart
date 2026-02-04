import { createAsyncThunk } from "@reduxjs/toolkit";
import { exploreFailure , exploreStart , exploreSuccess } from "./exploreSlice";

// NOTE: actual API functions baad me inject honge
// Abhi hum sirf Redux async flow lock kar rahe hain

 import { startExplore , submitExploreStep , completeExplore } from "../../api/explore/exploreApi";

// 1️⃣ Start Explore Session
 export const startExploreThunk = createAsyncThunk(
  "explore/start",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(exploreStart());
      const response = await startExplore();
      
      console.log("API RAW RESPONSE:", response); // Isse check karo structure

      // Safely unpack
      const data = response?.data?.data || response?.data; 
      
      if(!data) throw new Error("No data received from server");

      dispatch(exploreSuccess({
          sessionId: data.sessionId,
          step: data.currentStep || "INTENT",
          payload: {},
      }));
    } catch (error) {
      console.error("THUNK ERROR:", error);
      const message = error.response?.data?.message || error.message;
      dispatch(exploreFailure(message));
      return rejectWithValue(message);
    }
  }
);


 export const submitExploreStepThunk = createAsyncThunk(
  "explore/submitStep",
  async ({ sessionId, stepData, currentStep }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(exploreStart());

      const response = await submitExploreStep({ sessionId, currentStep, stepData });

      // ✅ Axios response structure handle karna (response.data backend ka JSON hai)
      // Tumhara backend { success: true, data: { nextStep, payload } } bhej raha hai
      const result = response.data; 

      dispatch(
        exploreSuccess({
          sessionId: sessionId, // sessionId change nahi hoti
          step: result.nextStep, // "USE_CASE"
          payload: result.payload, // Use cases list
        })
      );
    } catch (error) {
      // ✅ Serialized error message bhejo, pura object nahi
      const message = error?.response?.data?.message || "Failed to submit step";
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
