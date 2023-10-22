import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";

import axios, { baseURL } from "../axiosConfig";

import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

export default function EmailVerify() {
  const { token } = useParams();

  const [screen, setScreen] = useState(0);
  const ranOnce = useRef(false);

  const handleVerifyEmail = async () => {
    try {
      const res = await axios.get(baseURL + "/api/verify/" + token);
      if (res.data.message == "Email verified") {
        setScreen(1);
      } else {
        setScreen(2);
      }
    } catch (err) {
      console.log(err);
      setScreen(2);
    }
  };

  useEffect(() => {
    if (!ranOnce.current) {
      ranOnce.current = true;
      handleVerifyEmail();
    }
  }, []);

  return (
    <>
      <Header />
      <div className="mt-24 mb-24">
        {screen == 1 ? (
          <div className="flex flex-col items-center justify-center">
            <CheckCircleIcon className="text-green-500 w-16 h-16 mb-4" />
            <h1 className="text-4xl font-bold mb-8">Thành công</h1>
            <p className="text-xl text-center">
              Email của bạn đã được xác nhận thành công.
            </p>
            <a href="/dang-nhap">
              <button className="bg-blue-700 px-6 py-3 rounded-lg text-white font-semibold mt-8 text-lg hover:bg-blue-900 transition-all duration-150">
                Đăng nhập
              </button>
            </a>
          </div>
        ) : screen == 2 ? (
          <div className="flex flex-col items-center justify-center">
            <XCircleIcon className="text-red-500 w-16 h-16 mb-4" />
            <h1 className="text-3xl font-bold mb-8">Thất bại</h1>
            <p className="text-xl text-center">
              Đường dẫn đặt lại mật khẩu đã hết hạn hoặc không hợp lệ
            </p>
            <button className="bg-blue-700 px-6 py-3 rounded-lg text-white font-semibold mt-8 text-lg hover:bg-blue-900 transition-all duration-150">
              <a href="/">Quay về trang chủ</a>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-8">Đang xác nhận</h1>
            <p className="text-xl text-center">
              Vui lòng đợi trong giây lát...
            </p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
