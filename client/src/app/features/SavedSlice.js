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
    3. FETCH (GET Request)
================================ */
export const fetchSavedPrompts = createAsyncThunk(
  'saved/fetchPrompts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/save-prompt'); // GET method: DB se data nikalne ke liye
      return res.data?.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ================================
    4. SAVE (POST Request)
================================ */
export const savePromptToDB = createAsyncThunk(
  'saved/savePrompt',
  async (promptData, { rejectWithValue }) => {
    try {
      const res = await api.post('/save-prompt', promptData); // POST method: DB mein naya data bhejne ke liye
      return res.data.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

 

/* ================================
    5. NEW: Remove Prompt from DB
================================ */
export const removePromptFromDB = createAsyncThunk(
  'saved/removePrompt',
  async (promptId, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/remove-prompt/${promptId}`);
      return res.data.data; // Returns updated savedPrompts array from DB
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
    items: [],       
    savedIds: [],    
    dbPrompts: [],    // ✅ Naya state permanent prompts ke liye
    status: 'idle',
    error: null,
  },

  reducers: {
    resetSavedState: (state) => {
      state.items = [];
      state.savedIds = [];
      state.dbPrompts = [];
      state.status = 'idle';
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* ---------- Fetch Saved Tools ---------- */
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

      /* ---------- Toggle Save Tool ---------- */
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
      })

      /* ---------- DB Prompts Logic (Permanent) ---------- */
      .addCase(fetchSavedPrompts.fulfilled, (state, action) => {
        state.dbPrompts = action.payload; // Hard refresh ke baad yahan data aayega
      })
      .addCase(savePromptToDB.fulfilled, (state, action) => {
        state.dbPrompts = action.payload; // Save hote hi state update
      })
      .addCase(removePromptFromDB.fulfilled, (state, action) => {
        state.dbPrompts = action.payload; // Remove hote hi state update
      });
  },
});

export const { resetSavedState } = savedSlice.actions;
export default savedSlice.reducer;
 