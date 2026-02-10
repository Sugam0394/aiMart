import { createSlice , createAsyncThunk  } from "@reduxjs/toolkit";
import api from "../../api/axios";
 

export const fetchToolsByUseCase = createAsyncThunk(
  "moment/fetchToolsByUseCase",
  async (useCaseKey, { rejectWithValue }) => {
    try {
      console.log("DEBUG 2: API Call Started for ->", useCaseKey);
      const res = await api.get(`/useCased/${useCaseKey}`);

      console.log("DEBUG 3: API Response Data ->", res.data); // Ya
      return {
        useCase: useCaseKey,
        tools: res.data.tools,
        meta : res.data.meta,
        count: res.data.count,
      };
    } catch (err) {
      console.error("Error fetching use case tools:", err);
      return rejectWithValue("Failed to load use case tools");
    }
  }
);

 



 
const initialState = {
  // Agenda + Discovery
  agenda: [],                // Future AI / user workflow
  groupedTools: [],          // Tools grouped by intent/category
  detectedIntents: [],       // ["student", "creator"] etc.
  selectedIntent: null,      // Current active intent

  // Trending Tools Section
  trendingTools: [],         // Fetched tools array
  trendingStatus: "idle",    // idle | loading | succeeded | failed
  trendingError: null, 
  useCaseSections: {},
};

 
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
    // ✅ Clear specific use-case section
    clearUseCaseSection: (state, action) => {
      const key = action.payload;
      if (state.useCaseSections[key]) {
        delete state.useCaseSections[key];
      }
    },
  },

  // ===========================
  // Extra Reducers — Use-Case Logic
  // ===========================
  extraReducers: (builder) => {
    builder
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
        const { useCase, tools , meta , count } = action.payload;
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

// ===========================
// Export actions & reducer
// ===========================
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
