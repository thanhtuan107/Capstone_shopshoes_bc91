// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";


import bannerReducer from "./../pages/HomeTemplate/Banner/slice";
import productReducer from "./../pages/HomeTemplate/ListShoesPage/slice";
import detailProductReducer from "./../pages/HomeTemplate/DetailShoes/slice";
import signInReducer from "./../pages/HomeTemplate/SignIn/slice";
import profileReducer from "./../pages/HomeTemplate/Profile/slice";
import registerReducer from "./../pages/HomeTemplate/Register/slice";
import cartReducer from "../pages/HomeTemplate/Cart/slice";

export const store = configureStore({
  reducer: {
    bannerReducer,
    productReducer,
    detailProductReducer,
    signInReducer,
    profileReducer,
    registerReducer,
    cartReducer,
  },
});