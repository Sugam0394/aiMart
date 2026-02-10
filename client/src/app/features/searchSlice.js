import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchSearchTools = createAsyncThunk(
  'search/fetchSearchTools',
  async ({ term, category }, { rejectWithValue }) => {
    try {
      const safeTerm = term?.trim().toLowerCase() || '';
      const safeCategory = category?.trim().toLowerCase() || '';

      if (!safeTerm && !safeCategory) {
        return { tools: [], count: 0 }; // ✅ Return structured data
      }

      const response = await api.get('/search', {
        params: { term: safeTerm, category: safeCategory },
      });

      return {
        tools: response.data.tools,
        count: response.data.count, // ✅ Get count from backend
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Search failed'
      );
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    tools: [],
    count: 0, // ✅ Add count
    loading: false,
    error: null,
    activeSections: [],
    lastSearchTerm: '', // ✅ Track last search
  },
  reducers: {
    clearSearch: (state) => {
      state.tools = [];
      state.count = 0;
      state.error = null;
      state.lastSearchTerm = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchTools.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchTools.fulfilled, (state, action) => {
        state.loading = false;
        state.tools = action.payload.tools;
        state.count = action.payload.count;
        state.activeSections = [
          ...new Set(
            action.payload.tools.flatMap(tool => tool.intentTags || [])
          ),
        ];
      })
      .addCase(fetchSearchTools.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.tools = [];
        state.count = 0;
      });
  },
});

export const { clearSearch } = searchSlice.actions;
export default searchSlice.reducer; 
