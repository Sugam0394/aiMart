 import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toolService } from "../../api/toolOwner/tool.services";


 
const mapUseCaseData = (item) => {
  

  return {
   
    key: item.key || item.slug || item.id,

  
    label: item.label || item.name || item.key || "Explore", 

   toolCount: item.toolCount || item.count || 0
  };
};

// ✅ 1. Unified Home Data Thunk
export const fetchHomeData = createAsyncThunk(
  "moment/fetchHomeData",
  async (tags, { rejectWithValue }) => {
    try {
      const res = await toolService.getHomeData(tags);
      return res.data.data; 
    } catch (err) {
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
  useCaseSections: {},
  agenda: [],
  detectedIntents: [],
  selectedIntent: null,
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
      // --- fetchHomeData ---
      .addCase(fetchHomeData.pending, (state) => {
        state.homeStatus = "loading";
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.homeStatus = "succeeded";
        const data = action.payload || {};
        
        // Use cases mapping
        state.availableUseCases = (data.useCases || []).map(mapUseCaseData);
        
        state.trendingTools = data.trending || [];
        state.risingTools = data.rising || [];
        state.recommendedTools = data.recommended || [];
        state.useCasesStatus = "succeeded";
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.homeStatus = "failed";
        state.homeError = action.payload;
      })

      // --- fetchAvailableUseCases (FIXED MAPPING) ---
      .addCase(fetchAvailableUseCases.pending, (state) => {
        state.useCasesStatus = "loading";
      })
      .addCase(fetchAvailableUseCases.fulfilled, (state, action) => {
        state.useCasesStatus = "succeeded";
        // ✅ FIXED: Pehle yahan mapping nahi thi, ab frontend ko hamesha 'label' milega
        state.availableUseCases = (action.payload || []).map(mapUseCaseData); 
      })
      .addCase(fetchAvailableUseCases.rejected, (state, action) => {
        state.useCasesStatus = "failed";
        state.useCasesError = action.payload;
      })

      // --- fetchToolsByUseCase ---
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

export const { setAgenda, setDetectedIntents, setSelectedIntent, clearUseCaseSection, resetHomeStatus } = momentSlice.actions;
export default momentSlice.reducer;

 
