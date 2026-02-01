import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Async thunk to fetch search results

export const fetchSearchTools = createAsyncThunk(
  'search/fetchSearchTools',
  async ({ term, category }, { rejectWithValue }) => {
    try {
      const safeTerm = term?.toLowerCase() || '';
      const safeCategory = category?.toLowerCase() || '';

      // prevent useless API call
      if (!safeTerm && !safeCategory) {
        return [];
      }

      const response = await api.get('/search', {
        params: {
          term: safeTerm,
          category: safeCategory,
        },
      });

      return response.data.tools;
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
    loading: false,
    error: null,
    activeSections: [] // to track which dynamic sections to show
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchSearchTools.pending, state => {
        state.loading = true;
        state.error = null;
      })
      
        .addCase(fetchSearchTools.fulfilled, (state, action) => {
        state.loading = false;
        state.tools = action.payload;

        state.activeSections = [
          ...new Set(
            action.payload.flatMap(tool => tool.intentTags || [])
          ),
        ];
      })
      .addCase(fetchSearchTools.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default searchSlice.reducer;
