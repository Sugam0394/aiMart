 import { createSlice } from "@reduxjs/toolkit";
import { startExploreThunk,  } from "./exploreThunks";

const initialState = {
  exploreSessionId: null,
  currentStep: "ROLE", 
  selections: {
    role: "",      // NEW
    task: "",      // NEW (Replaces Intent/UseCase)
    tools: []
  },
  stepPayload: null, // Backend options
  prompts: [],       // NEW: Final step prompts
  loading: false,
  error: null,
};

const exploreSlice = createSlice({
  name: "explore",
  initialState,
  reducers: {
    exploreStart(state) {
      state.loading = true;
      state.error = null;
    },

    exploreSuccess(state, action) {
      const { sessionId, step, payload, lastSelection } = action.payload;

      state.exploreSessionId = sessionId;
      state.currentStep = step;
      state.stepPayload = payload;
      
      // Agar ye RESULTS step hai, toh prompts save karo
      if (step === "COMPLETED" && payload?.prompts) {
        state.prompts = payload.prompts;
      }

      state.loading = false;

      if (lastSelection) {
        const { type, value } = lastSelection;
        state.selections[type] = value;
      }
    },

    jumpToStep(state, action) {
      const targetStep = action.payload; // "ROLE" or "TASK"
      state.currentStep = targetStep;
      
      if (targetStep === "ROLE") {
        state.selections.task = "";
        state.selections.tools = [];
      }
      if (targetStep === "TASK") {
        state.selections.tools = [];
      }
    },

    exploreFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    resetExplore() {
      return initialState;
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(startExploreThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(startExploreThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.exploreSessionId = action.payload.sessionId;
        state.currentStep = action.payload.currentStep || "ROLE";
      })
      .addCase(startExploreThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { exploreStart, exploreSuccess, exploreFailure, resetExplore, jumpToStep } = exploreSlice.actions;

// Selectors
export const selectExploreState = (state) => state.explore;
export const selectExploreSessionId = (state) => state.explore.exploreSessionId;
export const selectCurrentStep = (state) => state.explore.currentStep;
export const selectStepPayload = (state) => state.explore.stepPayload;
export const selectExplorePrompts = (state) => state.explore.prompts;
export const selectExploreLoading = (state) => state.explore.loading;

export default exploreSlice.reducer;
