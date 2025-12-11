import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../services/apiClient";

const storedUser = localStorage.getItem("user");

let user = null;
if (storedUser && storedUser !== "undefined") {
  try {
    user = JSON.parse(storedUser);
  } catch (e) {
    console.error("Error parsing user from localStorage", e);

    localStorage.removeItem("user");
  }
}
const initialState = {
  user: user ? user : null,
  isAuthenticated: !!user,
  isLoading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const response = await apiClient.post("/api/auth/login", userData);

      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
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

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      console.log(userData);

      const response = await apiClient.post("/api/auth/register", userData);

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
    // Logout Reducer: clears state and local storage
    logout: (state) => {
      localStorage.removeItem("user"); // Clear the 'user' item
      // Note: If you also store 'userToken' separately, clear it too:
      // localStorage.removeItem("userToken");
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
        state.user = action.payload; // Stores user data including token
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

export const { logout } = authSlice.actions;
export default authSlice.reducer;
