import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { setAccessToken, clearAccessToken } from "../../utils/token";

const savedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

// ✅ 1. Logout User Thunk (Server side refresh token clear karne ke liye)
export const logoutUser = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  try {
    await api.post('/logout'); 
  } catch (e) {
    console.error('Server logout failed', e);
  } finally {
    dispatch(logout()); 
  }
});

 
 // ✅ 2. Sync User Role (Session Persistence)
export const syncUserRole = createAsyncThunk(
  "auth/sync-role",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/me");
      const userData = res.data.data?.user || res.data.user; 
      
      if (userData) {
        // 🔥 Analysis: User login persistence ke liye yahan localStorage update karna safe hai
        localStorage.setItem("user", JSON.stringify(userData));
        return userData;
      }
      return rejectWithValue("No user data");
    } catch (error) {
      console.error("Sync Error:", error);
      
      // ✅ FIXED: Return status and message instead of null
      return rejectWithValue({
        status: error?.response?.status,
        message: error?.response?.data?.message || error.message
      });
    }
  }
);

// ✅ 3. Google Login Thunk
export const googleLogin = createAsyncThunk(
  "auth/google-login",
  async (idToken, { rejectWithValue }) => {
    try {
      const res = await api.post("/google-login", { idToken });
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
 
 // ✅ UPDATED loginUser thunk
export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/login", formData);
      const { user, accessToken } = res.data.data; // Destructure directly
      setAccessToken(accessToken);
      localStorage.setItem("user", JSON.stringify(user)); // ✅ ADDED: Save to localStorage
      return user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

 
 // ✅ 5. Register User Thunk 
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
    user: null,
    role: savedUser ? savedUser.role : null,
    loading:  false,
    error: null,
    isInitialized: false,
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
      // PENDING STATES
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      
      // SYNC ROLE SUCCESS
      .addCase(syncUserRole.fulfilled, (state, action) => {
        state.user = action.payload;
        state.role = action.payload.role;
        state.isInitialized = true; 
        state.loading = false;
        state.error = null;
      })
      
     // ✅ FIXED: Only wipe state on definitive auth failures (401/403) 
      .addCase(syncUserRole.rejected, (state, action) => {
        const status = action.payload?.status;  
        const isAuthFailure = status === 401 || status === 403; 

        if (isAuthFailure) {
      
          state.user = null;  
          state.role = null;
          state.isInitialized = true; 
          state.loading = false;  
          localStorage.removeItem('user');  
        } else {
        
          state.isInitialized = true; 
          state.loading = false; 
         
        }
      })

      // COMMON SUCCESS MATCHERS (Login/Register/Google)
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled") && 
        (action.type.includes("login") || action.type.includes("register") || action.type.includes("google-login")),
        (state, action) => {
          state.loading = false;
          state.user = action.payload;
          state.role = action.payload.role;
          state.isInitialized = true;
          state.error = null;
        }
      )
      
      // COMMON ERROR MATCHERS
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