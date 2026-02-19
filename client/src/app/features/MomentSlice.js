 import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toolService } from "../../api/toolOwner/tool.services";

// ✅ 1. Unified Home Data Thunk
export const fetchHomeData = createAsyncThunk(
  "moment/fetchHomeData",
  async (tags, { rejectWithValue }) => {
    try {
      const res = await toolService.getHomeData(tags);
      return res.data.data; // { useCases, trending, rising, recommended }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load home data");
    }
  }
);

// ✅ 2. Independent Use Cases Thunk (For Switcher compatibility)
export const fetchAvailableUseCases = createAsyncThunk(
  "moment/fetchAvailableUseCases",
  async (_, { rejectWithValue }) => {
    try {
      const res = await toolService.getAvailableUseCases();
      return res.data.data.useCases; 
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load use cases");
    }
  }
);

// ✅ 3. Tools by Use Case Thunk
export const fetchToolsByUseCase = createAsyncThunk(
  "moment/fetchToolsByUseCase",
  async (useCaseKey, { rejectWithValue }) => {
    try {
      const res = await toolService.getToolsByUseCase(useCaseKey);
      return {
        useCase: useCaseKey,
        tools: res.data.data.tools,
        meta: res.data.data.useCase,
        count: res.data.data.count,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load tools");
    }
  }
);

const initialState = {
  // Home Data Sections
  availableUseCases: [],
  trendingTools: [],
  risingTools: [],
  recommendedTools: [],
  
  // Status Handling
  homeStatus: "idle", 
  homeError: null,
  useCasesStatus: "idle", // Specifically for Switcher
  useCasesError: null,

  // UI States
  agenda: [],
  detectedIntents: [],
  selectedIntent: null,
  useCaseSections: {},
};

const momentSlice = createSlice({
  name: "moment",
  initialState,
  reducers: {
    setAgenda: (state, action) => { state.agenda = action.payload; },
    setDetectedIntents: (state, action) => { state.detectedIntents = action.payload; },
    setSelectedIntent: (state, action) => { state.selectedIntent = action.payload; },
    clearUseCaseSection: (state, action) => {
      const key = action.payload;
      if (state.useCaseSections[key]) delete state.useCaseSections[key];
    },
    resetHomeStatus: (state) => {
      state.homeStatus = "idle";
      state.useCasesStatus = "idle";
    }
  },

  extraReducers: (builder) => {
    builder
      // ========================================
      // CASE: fetchHomeData
      // ========================================
      .addCase(fetchHomeData.pending, (state) => {
        state.homeStatus = "loading";
        state.homeError = null;
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.homeStatus = "succeeded";
        state.availableUseCases = action.payload.useCases || [];
        state.trendingTools = action.payload.trending || [];
        state.risingTools = action.payload.rising || [];
        state.recommendedTools = action.payload.recommended || [];
        state.useCasesStatus = "succeeded"; // Sync both statuses
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.homeStatus = "failed";
        state.homeError = action.payload;
      })

      // ========================================
      // CASE: fetchAvailableUseCases (ADD BACK)
      // ========================================
      .addCase(fetchAvailableUseCases.pending, (state) => {
        state.useCasesStatus = "loading";
      })
      .addCase(fetchAvailableUseCases.fulfilled, (state, action) => {
        state.useCasesStatus = "succeeded";
        state.availableUseCases = action.payload;
      })
      .addCase(fetchAvailableUseCases.rejected, (state, action) => {
        state.useCasesStatus = "failed";
        state.useCasesError = action.payload;
      })

      // ========================================
      // CASE: fetchToolsByUseCase
      // ========================================
      .addCase(fetchToolsByUseCase.pending, (state, action) => {
        const key = action.meta.arg;
        state.useCaseSections[key] = { status: "loading", tools: [] };
      })
      .addCase(fetchToolsByUseCase.fulfilled, (state, action) => {
        const { useCase, tools, meta, count } = action.payload;
        state.useCaseSections[useCase] = { status: "succeeded", tools, meta, count };
      })
      .addCase(fetchToolsByUseCase.rejected, (state, action) => {
        const key = action.meta.arg;
        state.useCaseSections[key] = { status: "failed", tools: [], error: action.payload };
      });
  },
});

export const {
  setAgenda, setDetectedIntents, setSelectedIntent, clearUseCaseSection, resetHomeStatus
} = momentSlice.actions;

export default momentSlice.reducer;
