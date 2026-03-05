 import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Existing: Fetch AI Stack
export const fetchStack = createAsyncThunk(
  'stack/fetchByRole',
  async ({ role, requirements }, { rejectWithValue }) => {
    try {
      // Requirements ko query param mein bhej rahe hain
      const res = await api.get(`/stack/${role}`, { params: { requirements } });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch stack');
    }
  }
);

// ✅ NEW: Fetch Total Tools Count (Change 2)
export const fetchToolsCount = createAsyncThunk(
  'stack/fetchToolsCount',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/count');
      return res.data.data.count;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch count');
    }
  }
);

const stackSlice = createSlice({
  name: 'stack',
  initialState: {
    data: null,
    status: 'idle', 
    currentRole: null,
    toolsCount: 0, // ✅ Badge ke liye naya state
  },
  reducers: {
    clearStack: (state) => {
      state.data = null;
      state.status = 'idle';
      state.currentRole = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Stack Cases
      .addCase(fetchStack.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchStack.fulfilled, (state, action) => {
        state.status = 'success';
        state.data = action.payload;
        state.currentRole = action.payload.role;
      })
      .addCase(fetchStack.rejected, (state) => { state.status = 'error'; })

      // ✅ Count Cases
      .addCase(fetchToolsCount.fulfilled, (state, action) => {
        state.toolsCount = action.payload;
      });
  },
});

export const { clearStack } = stackSlice.actions;
export default stackSlice.reducer;