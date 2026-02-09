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
      
      // ✅ Axios already unwraps to response.data
      const { data } = response; // Backend ka main object
      
      if (!data?.sessionId || !data?.currentStep) {
        throw new Error("Invalid response structure");
      }

      dispatch(exploreSuccess({
        sessionId: data.sessionId,
        step: data.currentStep,
        payload: {}, // Intent step has no payload initially
      }));
      
      return data;
    } catch (error) {
      const message = error?.response?.data?.message || error.message || "Session failed";
      dispatch(exploreFailure(message));
      return rejectWithValue(message);
    }
  }
);


 // exploreThunks.js
export const submitExploreStepThunk = createAsyncThunk(
  "explore/submitStep",
  async ({ sessionId, currentStep, stepData }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(exploreStart());

      const response = await submitExploreStep({ sessionId, currentStep, stepData });
      const { data } = response; // { nextStep, payload }

      // 🔥 Track what user selected
      let lastSelection = null;
      
      if (currentStep === "INTENT") {
        lastSelection = { type: "intent", value: stepData.intent };
      } else if (currentStep === "USE_CASE") {
        lastSelection = { type: "useCase", value: stepData.useCase };
      } else if (currentStep === "TOOLS") {
        lastSelection = { type: "tools", value: stepData.toolIds };
      }

      dispatch(
        exploreSuccess({
          sessionId,
          step: data.nextStep,
          payload: data.payload,
          lastSelection, // ✅ Now properly tracked
        })
      );
      
      return data;
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
