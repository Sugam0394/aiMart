 import { createAsyncThunk } from "@reduxjs/toolkit";
import { exploreFailure, exploreStart, exploreSuccess } from "./exploreSlice";
import { startExplore, submitExploreStep, } from "../../api/explore/exploreApi";
 

// 1️⃣ Start Explore Session (Guest Support Added)
 // exploreThunks.js
export const startExploreThunk = createAsyncThunk(
  "explore/start",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const userId = state.auth?.user?._id || state.auth?.user?.id || null;

      const response = await startExplore(userId);
      
      // Check: Agar tumhara backend response { success: true, data: { sessionId... } } hai
      // toh humein response.data return karna chahiye (jo api file se aa raha hai)
      return response.data; 
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Failed to start");
    }
  }
);

// 2️⃣ Submit Explore Step (Mapping updated to ROLE/TASK)
export const submitExploreStepThunk = createAsyncThunk(
  "explore/submitStep",
  async ({ sessionId, currentStep, stepData }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(exploreStart());

      const rawResponse = await submitExploreStep({ sessionId, currentStep, stepData });
      const response = rawResponse?.data; 

      // New Selections Mapping
      let lastSelection = null;
      if (currentStep === "ROLE") {
        lastSelection = { type: "role", value: stepData.role };
      } else if (currentStep === "TASK") {
        lastSelection = { type: "task", value: stepData.task };
      } else if (currentStep === "TOOLS") {
        lastSelection = { type: "tools", value: stepData.toolIds };
      }

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

 
 
