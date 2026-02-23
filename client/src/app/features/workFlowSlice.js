import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// API call to fetch workflow by role
export const fetchWorkflow = createAsyncThunk(
  "workflow/fetchByRole",
  async (role, { rejectWithValue }) => {
    try {
      // Backend route jo humne phase 1 mein banaya tha
      const res = await api.get(`/workflow/${role}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch workflow");
    }
  }
);

const workflowSlice = createSlice({
  name: "workflow",
  initialState: {
    data: null,
    status: "idle", // 'idle' | 'loading' | 'success' | 'error'
    currentRole: null,
  },
  reducers: {
    // Role change ya logout pe data clear karne ke liye
    clearWorkflow: (state) => {
      state.data = null;
      state.status = "idle";
      state.currentRole = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkflow.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWorkflow.fulfilled, (state, action) => {
        state.status = "success";
        state.data = action.payload;
        state.currentRole = action.payload.role;
      })
      .addCase(fetchWorkflow.rejected, (state) => {
        state.status = "error";
      });
  },
});

export const { clearWorkflow } = workflowSlice.actions;
export default workflowSlice.reducer;