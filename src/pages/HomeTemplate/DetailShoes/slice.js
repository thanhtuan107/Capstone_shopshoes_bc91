// src/pages/HomeTemplate/DetailMovie/slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./../../../services/api";

export const fetchProductDetail = createAsyncThunk(
  "detailProduct/fetchProductDetail",
  async (id, { rejectWithValue }) => {
    try {
      const result = await api.get(`/Product/getbyid?id=${id}`);
      return result.data.content || result.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  loading: false,
  data: null,
  error: null,
};

const detailProductSlice = createSlice({
  name: "detailProduct",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductDetail.pending, (state) => { state.loading = true; })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default detailProductSlice.reducer;