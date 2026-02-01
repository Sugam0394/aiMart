import { createSlice , createAsyncThunk  } from "@reduxjs/toolkit";
import api from "../../api/axios";
 

export const fetchToolsByUseCase = createAsyncThunk(
  "moment/fetchToolsByUseCase",
  async (useCaseKey, { rejectWithValue }) => {
    try {
      const res = await api.get(`/useCased/${useCaseKey}`);
      return {
        useCase: useCaseKey,
        tools: res.data.tools
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
  
  
  // API error message

   // 🔥 Use-Case Sections (NEW)
  // example:
  // "code-smarter": { status: "loading", tools: [] }
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
        };
      })
      .addCase(fetchToolsByUseCase.fulfilled, (state, action) => {
        const { useCase, tools } = action.payload;
        state.useCaseSections[useCase] = {
          status: "succeeded",
          tools,
        };
      })
      .addCase(fetchToolsByUseCase.rejected, (state, action) => {
        const key = action.meta.arg;
        state.useCaseSections[key] = {
          status: "failed",
          tools: [],
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
} = momentSlice.actions;

export default momentSlice.reducer;
