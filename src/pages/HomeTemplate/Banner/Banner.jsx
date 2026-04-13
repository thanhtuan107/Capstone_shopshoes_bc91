// src/pages/HomeTemplate/Banner/Banner.jsx
import React, { useEffect } from "react";
import Slider from "react-slick";
import { useDispatch, useSelector } from "react-redux";
import { fetchBanners } from "./slice";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Banner() {
  const dispatch = useDispatch();
  const { data: banners, loading } = useSelector((state) => state.bannerReducer);

  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  if (loading) return <p className="text-center py-10">Đang tải banner...</p>;
  if (!banners || banners.length === 0) return <p className="text-center py-10">Không có banner</p>;

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <Slider {...settings}>
        {banners.map((item) => (
          <div key={item.id}>
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-[500px] sm:h-[600px] md:h-[700px] object-cover rounded"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}