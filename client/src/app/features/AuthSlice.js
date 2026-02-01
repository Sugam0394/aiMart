import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { setAccessToken } from "../../utils/token";
import { clearAccessToken } from "../../utils/token";


/**
 * 🔹 Register User
 */
export const registerUser = createAsyncThunk(
  "/register",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/register", formData);

      // token save
      setAccessToken(res.data.data.accessToken);

      return res.data.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);
export const loginUser = createAsyncThunk(
  "/login",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/login", formData);

      // token store
      setAccessToken(res.data.data.accessToken);

      return res.data.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

export const syncUserRole = createAsyncThunk(
  "/sync-role",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/me");
      return res.data.user;
    } catch (error) {
        console.log(error)
      return rejectWithValue(null);
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    role: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.error = null;
      clearAccessToken();

    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.role = action.payload.role;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

 
       // LOGIN
        .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
})
       .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
       state.user = action.payload;
       state.role = action.payload.role;
})
      .addCase(loginUser.rejected, (state, action) => {
       state.loading = false;
      state.error = action.payload;
})

 // ✅ ROLE AUTO SYNC (NEW — SAFE)
    .addCase(syncUserRole.fulfilled, (state, action) => {
  if (action.payload) {
    state.user = action.payload;
    state.role = action.payload.role;
  }
});






  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;