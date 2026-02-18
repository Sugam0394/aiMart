import { createSlice } from "@reduxjs/toolkit";
import { startExploreThunk, submitExploreStepThunk } from "./exploreThunks";

const initialState = {
  exploreSessionId: null,
  currentStep: null,
  // Har step ki final choice yahan save hogi summary dikhane ke liye
  selections: {
    intent: "",
    useCase: "",
    tools: []
  },
  stepPayload: null, // Backend se aane wale options
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

      // Sync selections: Jo user ne abhi choose kiya, use save kar lo
      if (lastSelection) {
        const { type, value } = lastSelection;
        state.selections[type] = value;
      }
    },

    // Back to Edit Action
    jumpToStep(state, action) {
      const targetStep = action.payload; // "INTENT" or "USE_CASE"
      state.currentStep = targetStep;
      
      // Peeche jaane par aage ka data reset karna zaruri hai
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
  
  // 🔥 IMPORTANT: Thunks ke result ko handle karne ke liye
  extraReducers: (builder) => {
    builder
      // Handle Start Explore Thunk
      .addCase(startExploreThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startExploreThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Thunk se jo return data hai wo yahan action.payload mein milega
        state.exploreSessionId = action.payload.sessionId;
        state.currentStep = action.payload.currentStep || "INTENT";
        state.stepPayload = action.payload.payload || null;
      })
      .addCase(startExploreThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Jo rejectWithValue se bheja tha
      })
      
      // Handle Submit Step Thunk (Optional: Agar manual success nahi kar rahe)
      .addCase(submitExploreStepThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitExploreStepThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(submitExploreStepThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
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
