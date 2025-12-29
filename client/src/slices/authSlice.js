import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../services/apiClient";

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const response = await apiClient.post("api/auth/login", userData);
      console.log(response);

      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const logout = createAsyncThunk(
  "auth/logout",
  async (thunkAPI) => {
    try {
      await apiClient.post("api/auth/logout");
      localStorage.clear();
      window.location.href = "/";
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      console.log(userData);

      const response = await apiClient.post("api/auth/register", userData);

      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// --- Auth Slice ---
const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    // // Logout Reducer: clears state and local storage
    // logout: (state) => {
    //   // localStorage.removeItem("user"); // Clear the 'user' item
    //   // localStorage.removeItem("token"); // Clear the 'token'

    //   // state.user = null;
    //   // state.isAuthenticated = false;
    //   // state.isLoading = false;
    //   // state.error = null;

    // },

    // Set user from localStorage (for initialization)
    setUserFromStorage: (state, action) => {
      const user = action.payload;
      if (user) {
        state.user = user;
        state.isAuthenticated = true;
      }
    },

    // Clear authentication state
    clearAuthState: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
  },
  // ... extraReducers remain the same ...
  extraReducers: (builder) => {
    builder
      // Login Handlers
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;

        // Store the response data in localStorage if not already stored
        if (action.payload) {
          localStorage.setItem("user", JSON.stringify(action.payload));
          localStorage.setItem("token", action.payload.token);

          console.log("User data stored in localStorage:", action.payload);
        }

        // Set user in state - handle both possible data structures
        state.user = action.payload.user || action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload; // Stores the error message
      })
      // Registration Handlers (example, often less state management needed here)
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // Optionally handle success message for registration here
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setUserFromStorage, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
