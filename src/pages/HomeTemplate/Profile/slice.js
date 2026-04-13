// src/pages/HomeTemplate/Profile/slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./../../../services/api";

export const getProfile = createAsyncThunk(
  "profile/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/Users/getProfile");
      console.log(response.data);
      return response.data.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.content || "Lấy thông tin thất bại");
    }
  }
  
);
console.log(getProfile);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/Users/updateProfile", userData);
      return response.data.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.content || "Cập nhật thất bại");
    }
  }
);

export const changePassword = createAsyncThunk(
  "profile/changePassword",
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await api.post("/Users/changePassword", {
        oldPassword,
        newPassword,
      });
      return response.data.content || "Đổi mật khẩu thành công";
    } catch (error) {
      return rejectWithValue(error.response?.data?.content || "Đổi mật khẩu thất bại");
    }
  }
);

// Nếu bạn cần deleteOrder (xóa đơn hàng), thêm sau khi có endpoint chi tiết
// export const deleteOrder = createAsyncThunk(...)

const initialState = {
  loading: false,
  data: null,        // thông tin profile
  error: null,
  successMessage: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    resetProfile: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Profile
      .addCase(getProfile.pending, (state) => { state.loading = true; })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => { state.loading = true; })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.successMessage = "Cập nhật thông tin thành công!";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Change Password
      .addCase(changePassword.pending, (state) => { state.loading = true; })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetProfile } = profileSlice.actions;
export default profileSlice.reducer;