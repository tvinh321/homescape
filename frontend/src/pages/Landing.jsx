import React, { useState, useEffect, useContext } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import Slideshow from "../components/Landing/Slideshow";
import OutstandingProperties from "../components/Landing/OutstandingProperties";

import SellingImage from "../assets/dang-tin.png";

import { AuthContext } from "../contexts/AuthContext";

export default function Landing() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <Header />
      <div>
        <Slideshow />
        <OutstandingProperties />
        <div className="flex">
          <img src={SellingImage} alt="" className="w-2/5 object-cover" />
          <div className="bg-white flex flex-col justify-center items-center w-3/5">
            <h1 className="text-3xl font-bold mb-4 -mt-16">
              Bạn cần một nơi để rao bán bất động sản?
            </h1>
            <p className="text-center mb-4">
              Đăng tin miễn phí ngay hôm nay để bán nhanh nhà đất, chung cư, đất
              tại đây
            </p>
            <a href={user ? "/dang-tin" : "/dang-nhap"}>
              <button className="bg-blue-700 text-white rounded-lg hover:bg-blue-900 font-semibold py-3 px-6 transition-all duration-150 flex justify-center items-center">
                Đăng tin
              </button>
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
