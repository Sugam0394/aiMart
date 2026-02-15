// app/features/MomentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

// ========================================
// NEW: Fetch Available Use Cases (for switcher)
// ========================================
export const fetchAvailableUseCases = createAsyncThunk(
  "moment/fetchAvailableUseCases",
  async (_, { rejectWithValue }) => {
    // MomentSlice.js mein line 10 ke paas add karein
 
    try {
      console.log("🔍 Fetching available use cases...");
      const res = await axios.get('/api/use-cases');
      console.log("✅ Use cases fetched:", res.data);
      return res.data.data.useCases; // Array of use cases
    } catch (err) {
      console.error("❌ Error fetching use cases:", err);
      return rejectWithValue("Failed to load use cases");
    }
  }
);

// ========================================
// EXISTING: Fetch Tools by Use Case (for section)
// ========================================
export const fetchToolsByUseCase = createAsyncThunk(
  "moment/fetchToolsByUseCase",
  async (useCaseKey, { rejectWithValue }) => {
    try {
      console.log("🔍 Fetching tools for use case:", useCaseKey);
      // ✅ FIXED: Correct endpoint
      const res = await axios.get(`/api/use-case/${useCaseKey}`);
      console.log("✅ Tools fetched:", res.data);
      
      return {
        useCase: useCaseKey,
        tools: res.data.data.tools,
        meta: res.data.data.useCase,
        count: res.data.data.count,
      };
    } catch (err) {
      console.error("❌ Error fetching use case tools:", err);
      return rejectWithValue("Failed to load use case tools");
    }
  }
);

// ========================================
// Initial State
// ========================================
const initialState = {
  // Agenda + Discovery
  agenda: [],
  groupedTools: [],
  detectedIntents: [],
  selectedIntent: null,

  // Trending Tools Section
  trendingTools: [],
  trendingStatus: "idle",
  trendingError: null,
  
  // ✅ NEW: Available Use Cases (for switcher)
  availableUseCases: [],
  useCasesStatus: "idle", // idle | loading | succeeded | failed
  useCasesError: null,
  
  // Use Case Sections (existing)
  useCaseSections: {},
};

// ========================================
// Slice
// ========================================
const momentSlice = createSlice({
  name: "moment",
  initialState,
  reducers: {
    setAgenda: (state, action) => {
      state.agenda = action.payload;
    },

    setDetectedIntents: (state, action) => {
      state.detectedIntents = action.payload;
    },
    
    setSelectedIntent: (state, action) => {
      state.selectedIntent = action.payload;
    },

    setTrendingToolsLoading: (state) => {
      state.trendingStatus = "loading";
      state.trendingError = null;
    },
    
    setTrendingToolsSuccess: (state, action) => {
      state.trendingStatus = "succeeded";
      state.trendingTools = action.payload;
      state.trendingError = null;
    },
    
    setTrendingToolsError: (state, action) => {
      state.trendingStatus = "failed";
      state.trendingError = action.payload;
    },
    
    resetTrendingTools: (state) => {
      state.trendingTools = [];
      state.trendingStatus = "idle";
      state.trendingError = null;
    },
    
    clearUseCaseSection: (state, action) => {
      const key = action.payload;
      if (state.useCaseSections[key]) {
        delete state.useCaseSections[key];
      }
    },
  },

  // ========================================
  // Extra Reducers
  // ========================================
  extraReducers: (builder) => {
    builder
      // ========================================
      // NEW: Fetch Available Use Cases
      // ========================================
      .addCase(fetchAvailableUseCases.pending, (state) => {
        state.useCasesStatus = "loading";
        state.useCasesError = null;
      })
      .addCase(fetchAvailableUseCases.fulfilled, (state, action) => {
        state.useCasesStatus = "succeeded";
        state.availableUseCases = action.payload;
        state.useCasesError = null;
      })
      .addCase(fetchAvailableUseCases.rejected, (state, action) => {
        state.useCasesStatus = "failed";
        state.useCasesError = action.payload;
        state.availableUseCases = [];
      })
      
      // ========================================
      // EXISTING: Fetch Tools by Use Case
      // ========================================
      .addCase(fetchToolsByUseCase.pending, (state, action) => {
        const key = action.meta.arg;
        state.useCaseSections[key] = {
          status: "loading",
          tools: [],
          meta: null,
          count: 0,
        };
      })
      .addCase(fetchToolsByUseCase.fulfilled, (state, action) => {
        const { useCase, tools, meta, count } = action.payload;
        state.useCaseSections[useCase] = {
          status: "succeeded",
          tools,
          meta,
          count,
        };
      })
      .addCase(fetchToolsByUseCase.rejected, (state, action) => {
        const key = action.meta.arg;
        state.useCaseSections[key] = {
          status: "failed",
          tools: [],
          meta: null,
          count: 0,
          error: action.payload,
        };
      });
  },
});

// ========================================
// Export
// ========================================
export const {
  setAgenda,
  setDetectedIntents,
  setSelectedIntent,
  setTrendingToolsLoading,
  setTrendingToolsSuccess,
  setTrendingToolsError,
  resetTrendingTools,
  clearUseCaseSection
} = momentSlice.actions;

export default momentSlice.reducer; 
