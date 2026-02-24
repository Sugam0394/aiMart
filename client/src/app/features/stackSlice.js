import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios'
 
export const fetchStack = createAsyncThunk(
  'stack/fetchByRole',
  async (role, { rejectWithValue }) => {
    try {
      const res = await api.get(`/stack/${role}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch stack');
    }
  }
);

const stackSlice = createSlice({
  name: 'stack',
  initialState: {
    data: null,
    status: 'idle', // 'idle' | 'loading' | 'success' | 'error'
    currentRole: null,
  },
  reducers: {
    // State clear karne ke liye (jab user role badle)
    clearStack: (state) => {
      state.data = null;
      state.status = 'idle';
      state.currentRole = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStack.pending, (state) => { 
        state.status = 'loading';
      })
      .addCase(fetchStack.fulfilled, (state, action) => {
        state.status = 'success';
        state.data = action.payload;
        state.currentRole = action.payload.role;
      })
      .addCase(fetchStack.rejected, (state) => { 
        state.status = 'error';
      });
  },
});

export const { clearStack } = stackSlice.actions;
export default stackSlice.reducer;