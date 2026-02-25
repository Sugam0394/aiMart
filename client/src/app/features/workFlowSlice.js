import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

 
export const fetchWorkflow = createAsyncThunk(
  "workflow/fetchByRole",
  async (role, { rejectWithValue }) => {
    try {
      // Role validation
      if (!role) throw new Error("Role is required to fetch workflow");

      const res = await api.get(`/workflow/${role}`);
      
      // Axios success check
      return res.data?.data || res.data; 
    } catch (err) {
      console.error("Workflow Fetch Error:", err);
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch workflow"
      );
    }
  }
);

const initialState = {
  data: null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  currentRole: null,
};

const workflowSlice = createSlice({
  name: "workflow",
  initialState,
  reducers: {
    // Role change ya logout pe state reset karne ke liye
    clearWorkflow: (state) => {
      state.data = null;
      state.status = "idle";
      state.currentRole = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkflow.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchWorkflow.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        // Payload se role extract karo agar available hai
        state.currentRole = action.payload?.role || null;
      })
      .addCase(fetchWorkflow.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.data = null;
        state.currentRole = null;
      });
  },
});

export const { clearWorkflow } = workflowSlice.actions;
export default workflowSlice.reducer;