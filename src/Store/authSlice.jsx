import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import {
  signupApi,
  loginApi,
  getUserRoleApi,
  verifyTokenApi,
  forgotPasswordApi,
  refreshTokenApi,
} from "../APIs/LoginAPi.jsx";

/* =========================
   SIGNUP
========================= */
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async ({ email, password, name, contactNo, address }, { rejectWithValue }) => {
    try {
      const data = await signupApi(email, password, name, contactNo, address);
      return { ...data, email };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* =========================
   LOGIN (ROLE BASED)
========================= */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const authData = await loginApi(email, password);
      const userData = await getUserRoleApi(email);

      return {
        ...authData,
        email,
        role: userData.role, // 🔥 source of truth
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      return await forgotPasswordApi(email);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* =========================
   VALIDATE TOKEN
========================= */
export const validateToken = createAsyncThunk(
  "auth/validateToken",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");

      if (!token || !email) {
        throw new Error("No token or email found");
      }

      // Verify token with Firebase
      await verifyTokenApi(token);
      
      return { valid: true };
    } catch (err) {
      // Token is invalid, logout user
      dispatch(logout());
      return rejectWithValue("Invalid or expired token");
    }
  }
);

/* =========================
   CHECK AUTH ON APP LOAD
========================= */
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      let token = localStorage.getItem("token");
      const email = localStorage.getItem("email");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!email) {
        throw new Error("No session");
      }

      // Try to verify current token
      try {
        if (token) {
          await verifyTokenApi(token);
        } else {
          throw new Error("No token");
        }
      } catch (verifyError) {
        // Token expired or invalid, try to refresh
        if (!refreshToken) {
          throw new Error("No refresh token");
        }
        
        const refreshed = await refreshTokenApi(refreshToken);
        token = refreshed.idToken;
        
        // Update localStorage with new token
        localStorage.setItem("token", refreshed.idToken);
        localStorage.setItem("refreshToken", refreshed.refreshToken);
      }

      // Get role from DB (SOURCE OF TRUTH)
      const userData = await getUserRoleApi(email);

      return {
        token,
        email,
        role: userData.role,
      };
    } catch (err) {
      return rejectWithValue("Session expired");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token"),
    email: localStorage.getItem("email"),
    role: localStorage.getItem("role"),
    refreshToken: localStorage.getItem("refreshToken"),
    isAuthenticated: !!localStorage.getItem("token"),
    loading: false,
    error: null,
    notificationCount: 0,
    adminNotificationCount: 0,
  },

  reducers: {
    logout(state) {
      state.token = null;
      state.email = null;
      state.role = null;
      state.isAuthenticated = false;
      state.notificationCount = 0;
      state.adminNotificationCount = 0;
      localStorage.clear();
    },
    setNotificationCount(state, action) {
      state.notificationCount = action.payload;
    },
    setAdminNotificationCount(state, action) {
      state.adminNotificationCount = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      /* ---------- SIGNUP ---------- */
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.idToken;
        state.email = action.payload.email;
        state.role = "user";
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;

        localStorage.setItem("token", action.payload.idToken);
        localStorage.setItem("email", action.payload.email);
        localStorage.setItem("role", "user");
        localStorage.setItem("refreshToken", action.payload.refreshToken);

        toast.success(`Welcome ${action.payload.email}`);
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      /* ---------- LOGIN ---------- */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.idToken;
        state.email = action.payload.email;
        state.role = action.payload.role;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;

        localStorage.setItem("token", action.payload.idToken);
        localStorage.setItem("email", action.payload.email);
        localStorage.setItem("role", action.payload.role);
        localStorage.setItem("refreshToken", action.payload.refreshToken);

        toast.success(`Welcome back ${action.payload.email}`);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      /* ---------- SESSION RESTORE ---------- */
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.email = action.payload.email;
        state.role = action.payload.role;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.token = null;
        state.email = null;
        state.role = null;
        state.isAuthenticated = false;
        localStorage.clear();
      })
      /* ---------- VALIDATE TOKEN ---------- */
      .addCase(validateToken.rejected, (state) => {
        // Token is invalid, clear everything
        state.token = null;
        state.email = null;
        state.role = null;
        state.isAuthenticated = false;
        state.notificationCount = 0;
        state.adminNotificationCount = 0;
        localStorage.clear();
      });
  },
});

export const { logout, setNotificationCount, setAdminNotificationCount } = authSlice.actions;
export default authSlice.reducer;
