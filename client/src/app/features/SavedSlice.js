import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

/* ================================
   1. Fetch Saved Tools
================================ */
export const fetchSavedTools = createAsyncThunk(
  'saved/fetchSaved',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/saved-tools');
      return res.data?.data || res.data?.tools || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ================================
   2. Toggle Save Tool
================================ */
export const toggleSaveTool = createAsyncThunk(
  'saved/toggleSave',
  async (toolData, { rejectWithValue }) => {
    try {
      const toolId = typeof toolData === 'object' ? toolData._id : toolData;
      const res = await api.post(`/save/${toolId}`);

      return {
        toolId,
        isSaved: res.data.isSaved,
        fullTool: typeof toolData === 'object' ? toolData : null,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ================================
   Slice
================================ */
const savedSlice = createSlice({
  name: 'saved',
  initialState: {
    items: [],       // full tool objects
    savedIds: [],    // only IDs (string)
    status: 'idle',
    error: null,
  },

  reducers: {
    resetSavedState: (state) => {
      state.items = [];
      state.savedIds = [];
      state.status = 'idle';
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ---------- Fetch Saved ---------- */
      .addCase(fetchSavedTools.pending, (state) => {
        state.status = 'loading';
      })

      .addCase(fetchSavedTools.fulfilled, (state, action) => {
        state.items = action.payload;
        state.savedIds = action.payload.map(t => t._id.toString());
        state.status = 'succeeded';
      })

      .addCase(fetchSavedTools.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      /* ---------- Toggle Save ---------- */
      .addCase(toggleSaveTool.fulfilled, (state, action) => {
        const { toolId, isSaved, fullTool } = action.payload;
        const id = toolId.toString();

        if (isSaved) {
          if (!state.savedIds.includes(id)) {
            state.savedIds.push(id);

            if (fullTool && !state.items.some(t => t._id === id)) {
              state.items.push(fullTool);
            }
          }
        } else {
          state.savedIds = state.savedIds.filter(tid => tid !== id);
          state.items = state.items.filter(item => item._id !== id);
        }
      });
  },
});

export const { resetSavedState } = savedSlice.actions;
export default savedSlice.reducer;
 