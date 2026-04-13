// src/pages/HomeTemplate/ListMoviePage/index.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "./slice";
import Banner from "../Banner/Banner";
import ProductCard from "./ProductCard";

export default function ProductListPage() {
  const { data: products, loading } = useSelector((state) => state.productReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <p className="text-center py-10 text-xl">Đang tải sản phẩm...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Banner />

      <h1 className="text-3xl font-bold mb-8 text-center">Giày Dép Hot Nhất</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}