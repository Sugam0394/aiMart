 import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toolService } from "../../api/toolOwner/tool.services";

// ✅ 1. Unified Home Data Thunk
export const fetchHomeData = createAsyncThunk(
  "moment/fetchHomeData",
  async (tags, { rejectWithValue }) => {
    try {
      const res = await toolService.getHomeData(tags);
      console.log("1. API RESPONSE RECEIVED:", res.data); // DEBUG 1
      return res.data.data; 
    } catch (err) {
      console.error("1. API ERROR:", err);
      return rejectWithValue(err.response?.data?.message || "Failed to load home data");
    }
  }
);

// ✅ 2. Independent Use Cases Thunk
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
  availableUseCases: [],
  trendingTools: [],
  risingTools: [],
  recommendedTools: [],
  homeStatus: "idle",
  homeError: null,
  useCasesStatus: "idle",
  useCasesError: null,
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
      .addCase(fetchHomeData.pending, (state) => {
        console.log("2. FETCH HOME DATA PENDING...");
        state.homeStatus = "loading";
        state.homeError = null;
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        console.log("3. REDUX FULFILLED - PAYLOAD:", action.payload); // DEBUG 3
        state.homeStatus = "succeeded";
        const data = action.payload || {}; 
        
        state.availableUseCases = data.useCases || [];
        state.trendingTools = data.trending || [];
        state.risingTools = data.rising || [];
        state.recommendedTools = data.recommended || [];
        state.useCasesStatus = "succeeded";
        
        console.log("4. STATE UPDATED - USECASES:", state.availableUseCases.length);
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        console.error("3. REDUX REJECTED - ERROR:", action.payload);
        state.homeStatus = "failed";
        state.homeError = action.payload;
      })

      .addCase(fetchAvailableUseCases.fulfilled, (state, action) => {
        state.useCasesStatus = "succeeded";
        state.availableUseCases = action.payload || [];
      })

      .addCase(fetchToolsByUseCase.fulfilled, (state, action) => {
        const { useCase, tools, meta, count } = action.payload || {};
        if (useCase) {
          state.useCaseSections[useCase] = { 
            status: "succeeded", 
            tools: tools || [], 
            meta, 
            count 
          };
        }
      });
  }
});

export const {
  setAgenda, setDetectedIntents, setSelectedIntent, clearUseCaseSection, resetHomeStatus
} = momentSlice.actions;

export default momentSlice.reducer;
