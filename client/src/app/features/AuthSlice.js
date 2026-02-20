import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { setAccessToken, clearAccessToken } from "../../utils/token";
 
const savedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

// Sync User Role
export const syncUserRole = createAsyncThunk(
  "auth/sync-role",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/me");
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

// Google Login Thunk
 export const googleLogin = createAsyncThunk(
  "auth/google-login",
  async (idToken, { rejectWithValue }) => {
    console.log("🔥 GoogleLogin Thunk called");
    console.log("idToken received:", idToken);

    try {
      const res = await api.post("/google-login", { idToken });
      console.log("✅ Backend Response:", res.data);

      const { user, accessToken } = res.data.data;

      if (!accessToken || !user) {
        return rejectWithValue("Invalid server response");
      }

      setAccessToken(accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      return user;
    } catch (error) {
      console.error("🔥 Google Login Error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Google Login failed"
      );
    }
  }
);



// Login User
export const loginUser = createAsyncThunk(
  "auth/login", 
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/login", formData);
      setAccessToken(res.data.data.accessToken);
      return res.data.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Register User
export const registerUser = createAsyncThunk(
  "auth/register", 
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/register", formData);
      setAccessToken(res.data.data.accessToken);
      return res.data.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

 

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: savedUser,
    role: savedUser ? savedUser.role : null,
    loading: false,
    error: null,
    // ✅ FIX: Agar savedUser hai toh initialization FALSE rakho.
    // Jab tak server (syncUserRole) confirm na karde, tab tak 'false' rehna chahiye.
    isInitialized: savedUser ? false : true, 
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
      // PENDING
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      
      // SYNC ROLE (Session Validation)
      .addCase(syncUserRole.fulfilled, (state, action) => {
        state.user = action.payload;
        state.role = action.payload.role;
        // ✅ Server ne user confirm kiya, ab app ready hai
        state.isInitialized = true; 
        state.loading = false;
        state.error = null;
      })
      
      // ✅ FIX: Network error par session preserve karo 
      .addCase(syncUserRole.rejected, (state, action) => {
        const isNetworkError = !action.payload; 

        if (isNetworkError) {
          // Server down ya internet issue: user ko logged in rakho, bas init true kardo
          state.isInitialized = true;
          state.loading = false;
        } else {
          // Actual Auth Failure (401/Unauthorized): Clear session
          state.user = null;
          state.role = null;
          state.isInitialized = true;
          state.loading = false;
          localStorage.removeItem('user');
        }
      })

      // AUTH SUCCESS MATCHERS (Login/Register)
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled") && (action.type.includes("login") || action.type.includes("register")),
        (state, action) => {
          state.loading = false;
          state.user = action.payload;
          state.role = action.payload.role;
          state.isInitialized = true;
          state.error = null;
          localStorage.setItem("user", JSON.stringify(action.payload));
        }
      )
      
      // ERROR MATCHERS
      .addMatcher(
        (action) => action.type.endsWith("/rejected") && !action.type.includes("syncUserRole"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});
 

export const { logout, setInitialized } = authSlice.actions;
export default authSlice.reducer; 