 import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  exploreSessionId: null,
  currentStep: null,
  // 🔥 NEW: Har step ki final choice yahan save hogi summary dikhane ke liye
  selections: {
    intent: "",
    useCase: "",
    tools: []
  },
  stepPayload: null, // Backend se aane wale options (e.g. use-case list ya tools list)
  useCasePayload: null, // Preserved for Edit back-navigation
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
      if (step === "USE_CASE") state.useCasePayload = payload;
      state.loading = false;

      // 🔥 Sync selections: Jo user ne abhi choose kiya, use save kar lo
      if (lastSelection) {
        const { type, value } = lastSelection; // e.g. {type: 'intent', value: 'Study'}
        state.selections[type] = value;
      }
    },

    // 🔥 NEW: Back to Edit Action
    jumpToStep(state, action) {
      const targetStep = action.payload; // "INTENT" or "USE_CASE"
      state.currentStep = targetStep;
      
      // Clear downstream data (Peeche jaane par aage ka data reset karna zaruri hai)
      if (targetStep === "INTENT") {
        state.selections.useCase = "";
        state.selections.tools = [];
      }
      if (targetStep === "USE_CASE") {
        state.selections.tools = [];
        state.stepPayload = state.useCasePayload;
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
});

export const {
  exploreStart,
  exploreSuccess,
  exploreFailure,
  resetExplore,
  jumpToStep
} = exploreSlice.actions;

export default exploreSlice.reducer;
