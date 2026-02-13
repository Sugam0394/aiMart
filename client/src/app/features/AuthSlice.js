import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { setAccessToken, clearAccessToken } from "../../utils/token";
 
const savedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

 
export const syncUserRole = createAsyncThunk(
  "/sync-role",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/me");
      // Backend structure check: res.data.data.user
      const userData = res.data.data?.user || res.data.user; 
      
      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
        return userData;
      }
      return rejectWithValue("No user data");
    } catch (error) {
      console.error("Sync Error:", error);
      return rejectWithValue(null);
    }
  }
);

 
export const loginUser = createAsyncThunk("/login", async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post("/login", formData);
    setAccessToken(res.data.data.accessToken);
    return res.data.data.user;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

export const registerUser = createAsyncThunk("/register", async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post("/register", formData);
    setAccessToken(res.data.data.accessToken);
    return res.data.data.user;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Registration failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: savedUser,
    role: savedUser ? savedUser.role : null,
    loading: false,
    error: null,
    isInitialized: savedUser ? true : false,
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.error = null;
      state.isInitialized = true;
      clearAccessToken();
      localStorage.removeItem("user");
    },
     
    setInitialized: (state) => {
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
   // ✅ 1. Sabse pehle addCase (Specific logic)
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncUserRole.fulfilled, (state, action) => {
        state.user = action.payload;
        state.role = action.payload.role;
        state.isInitialized = true;
        state.loading = false;
      })
      .addCase(syncUserRole.rejected, (state) => {
        state.user = null;
        state.role = null;
        state.isInitialized = true;
        state.loading = false;
        localStorage.removeItem("user");
      })
      // ✅ 2. Phir addMatcher (Common success logic)
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled") && (action.type.includes("login") || action.type.includes("register")),
        (state, action) => {
          state.loading = false;
          state.user = action.payload;
          state.role = action.payload.role;
          state.isInitialized = true;
          localStorage.setItem("user", JSON.stringify(action.payload));
        }
      )
      // ✅ 3. Common Error handling
      .addMatcher(
        (action) => action.type.endsWith("/rejected") && !action.type.includes("sync-role"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { logout , setInitialized  } = authSlice.actions;
export default authSlice.reducer; 