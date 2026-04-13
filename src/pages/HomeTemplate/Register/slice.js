import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./../../../services/api";

export const actRegister = createAsyncThunk(
  "register/actRegister",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/Users/signup", userData);
      // Giả sử thông tin user được trả về trong response.data.content
      return response.data.content;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.content || "Đăng ký thất bại"
      );
    }
  }
);

const initialState = {
  loading: false,
  data: null,
  error: null,
};

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    resetRegister: (state) => {
      state.loading = false;
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(actRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetRegister } = registerSlice.actions;
export default registerSlice.reducer;
