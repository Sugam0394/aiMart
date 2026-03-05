 import { createSlice } from "@reduxjs/toolkit";
import { startExploreThunk } from "./exploreThunks";

 
const getInitialState = () => {
  try {
    const saved = localStorage.getItem("exploreSession"); // Standardized key
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        exploreSessionId: parsed.exploreSessionId || null,
        currentStep: parsed.currentStep || "ROLE",
        selections: parsed.selections || { role: "", task: "", tools: [] },
        stepPayload: parsed.stepPayload || null,
        prompts: parsed.prompts || [],
        loading: false, // Reset loading on refresh
        error: null,    // Reset error on refresh
      };
    }
  } catch (err) {
    console.error("Hydration failed:", err);
  }
  return {
    exploreSessionId: null,
    currentStep: "ROLE",
    selections: { role: "", task: "", tools: [] },
    stepPayload: null,
    prompts: [],
    loading: false,
    error: null,
  };
};
 
const syncStorage = (state) => {
  const dataToSave = {
    exploreSessionId: state.exploreSessionId,
    currentStep: state.currentStep,
    selections: state.selections,
    stepPayload: state.stepPayload,
    prompts: state.prompts,
  };
  localStorage.setItem("exploreSession", JSON.stringify(dataToSave));
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

      if (payload?.prompts) state.prompts = payload.prompts;
      if (lastSelection) {
        state.selections[lastSelection.type] = lastSelection.value;
      }

      state.loading = false;
      syncStorage(state); // ✅ Sync selective data
    },

    exploreFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    jumpToStep(state, action) {
      const targetStep = action.payload;
      state.currentStep = targetStep;
      if (targetStep === "ROLE") { 
        state.selections.task = ""; 
        state.selections.tools = []; 
      }
      if (targetStep === "TASK") { 
        state.selections.tools = []; 
      }
      syncStorage(state);
    },

    resetExplore(state) {
      localStorage.removeItem("exploreSession");
      // Mutate state instead of returning for consistency
      state.exploreSessionId = null;
      state.currentStep = "ROLE";
      state.selections = { role: "", task: "", tools: [] };
      state.stepPayload = null;
      state.prompts = [];
      state.loading = false;
      state.error = null;
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
        if (!state.selections.role) state.currentStep = "ROLE";
        syncStorage(state); // ✅ Fixed hydration on fullfill
      })
      .addCase(startExploreThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { exploreStart, exploreSuccess, exploreFailure, resetExplore, jumpToStep } = exploreSlice.actions;
export default exploreSlice.reducer;
