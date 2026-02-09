import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// 1. Fetch all saved tools
export const fetchSavedTools = createAsyncThunk('saved/fetchSaved', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/saved-tools');
    return response.data.data; 
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// 2. Toggle Save (Updated logic to handle immediate UI)
export const toggleSaveTool = createAsyncThunk('saved/toggleSave', async (toolData, { rejectWithValue }) => {
  try {
    // Agar hum toolData mein pura object bhej rahe hain (toolData._id)
    const toolId = toolData._id || toolData; 
    const response = await api.post(`/save/${toolId}`);
    return { 
      toolId, 
      isSaved: response.data.isSaved, 
      fullTool: toolData // Hum pura object payload mein bhej rahe hain
    };
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

const savedSlice = createSlice({
  name: 'saved',
  initialState: {
    items: [], 
    savedIds: [], 
    status: 'idle'
  },
  reducers: {
    // Logout ke waqt state saaf karne ke liye
    resetSavedState: (state) => {
      state.items = [];
      state.savedIds = [];
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedTools.fulfilled, (state, action) => {
        state.items = action.payload || [];
        state.savedIds = action.payload?.map(tool => tool._id) || [];
        state.status = 'succeeded';
      })
      // ... baaki thunks same ...

.addCase(toggleSaveTool.fulfilled, (state, action) => {
  const { toolId, isSaved, fullTool } = action.payload;
  if (isSaved) {
    if (!state.savedIds.includes(toolId)) {
      state.savedIds.push(toolId);
      // Agar humne tool object bheja hai, toh items array mein push karo
      if (fullTool && typeof fullTool === 'object') {
        state.items.push(fullTool);
      }
    }
  } else {
    // Unsave hone par dono jagah se nikaalo
    state.savedIds = state.savedIds.filter(id => id !== toolId);
    state.items = state.items.filter(item => item._id !== toolId);
  }
});
  }
});

export const { resetSavedState } = savedSlice.actions;
export default savedSlice.reducer; 