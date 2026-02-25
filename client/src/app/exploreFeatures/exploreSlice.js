 import { createSlice } from "@reduxjs/toolkit";
import { startExploreThunk } from "./exploreThunks";

const baseInitialState = {
  exploreSessionId: null,
  currentStep: "ROLE",
  selections: { role: "", task: "", tools: [] },
  stepPayload: null,
  prompts: [],
  loading: false,
  error: null,
};

const getInitialState = () => {
  try {
    const saved = localStorage.getItem("active_explore_session");
  
    return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(baseInitialState));
  } catch (err) {
    console.error("Error retrieving explore session from localStorage:", err);
    return JSON.parse(JSON.stringify(baseInitialState));
  }
};

const exploreSlice = createSlice({
  name: "explore",
  initialState: getInitialState(),
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

    
      if (payload?.prompts) {
        state.prompts = payload.prompts;
      }

      state.loading = false;

      if (lastSelection) {
        const { type, value } = lastSelection;
        state.selections[type] = value;
      }

 
      localStorage.setItem("active_explore_session", JSON.stringify(state));
    },

    exploreFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    jumpToStep(state, action) {
      const targetStep = action.payload;
      state.currentStep = targetStep;
      if (targetStep === "ROLE") { state.selections.task = ""; state.selections.tools = []; }
      if (targetStep === "TASK") { state.selections.tools = []; }
      localStorage.setItem("active_explore_session", JSON.stringify(state));
    },

    resetExplore() {
      localStorage.removeItem("active_explore_session");
  
      return JSON.parse(JSON.stringify(baseInitialState));
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
        state.currentStep = "ROLE";
    
        state.selections = { role: "", task: "", tools: [] };
        state.prompts = [];
        state.stepPayload = null;
        localStorage.setItem("active_explore_session", JSON.stringify(state));
      })
      .addCase(startExploreThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { exploreStart, exploreSuccess, exploreFailure, resetExplore, jumpToStep } = exploreSlice.actions;
export default exploreSlice.reducer;
