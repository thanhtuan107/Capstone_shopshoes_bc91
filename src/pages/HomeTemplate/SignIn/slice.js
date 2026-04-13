import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./../../../services/api";

export const actLogin = createAsyncThunk(
  "signIn/actLogin",
  async (user, { rejectWithValue }) => {
    try {
      const result = await api.post("/Users/signin", user);
      // Lưu thông tin user vào localStorage
      localStorage.setItem("userInfo", JSON.stringify(result.data.content));
      return result.data.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.content || "Login failed");
    }
  }
);

const initialState = {
  loading: false,
  data: null,
  error: null,
};

const signInSlice = createSlice({
  name: "signIn",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem("userInfo");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(actLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = signInSlice.actions;
export default signInSlice.reducer;
