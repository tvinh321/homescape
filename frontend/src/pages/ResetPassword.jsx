import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";

import axios, { baseURL } from "../axiosConfig";

import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

export default function ResetPassword() {
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [repassword, setRepassword] = useState("");
  const [repasswordError, setRepasswordError] = useState("");

  const [screen, setScreen] = useState(0);
  const [loading, setLoading] = useState(false);

  const ranOnce = useRef(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setLoading(true);

    setPasswordError("");
    setRepasswordError("");

    if (!password) {
      setPasswordError("Vui lòng nhập mật khẩu");
      return;
    }
    if (!repassword) {
      setRepasswordError("Vui lòng nhập lại mật khẩu");
      return;
    }
    if (password !== repassword) {
      setRepasswordError("Mật khẩu không khớp");
      return;
    }

    try {
      const res = await axios.post(baseURL + "/api/resetPassword", {
        token: token,
        newPassword: password,
        confirmPassword: repassword,
      });
      if (res.data?.message == "Password reset successfully") {
        setLoading(false);
        setScreen(1);
      }
    } catch (err) {
      setLoading(false);
      setRepasswordError("Đã có lỗi xảy ra");
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await axios.post(baseURL + "/api/checkToken", {
          token: token,
        });
        if (res.data?.message == "Valid token") {
          setScreen(0);
        } else {
          setScreen(2);
        }
      } catch (err) {
        setScreen(2);
      }
    };

    if (!ranOnce.current) {
      ranOnce.current = true;
      checkToken();
    }
  }, []);

  return (
    <>
      <Header />
      <div className="mt-24 mb-36">
        {screen == 1 ? (
          <div className="flex flex-col items-center justify-center">
            <CheckCircleIcon className="text-green-500 w-16 h-16 mb-4" />
            <h1 className="text-4xl font-bold mb-8">Thành công</h1>
            <p className="text-xl text-center">
              Mật khẩu của bạn đã được đặt lại thành công
            </p>
            <button className="bg-blue-700 px-6 py-3 rounded-lg text-white font-semibold mt-8 text-lg hover:bg-blue-900 transition-all duration-150">
              <a href="/">Quay về trang chủ</a>
            </button>
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
            <h1 className="text-3xl font-bold mb-8">Đặt lại mật khẩu</h1>
            <form
              className="flex flex-col justify-center items-center w-[30rem]"
              onSubmit={handleResetPassword}
            >
              <div className="mb-4 w-full">
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  className="border-2 border-gray-300 rounded-md px-4 py-2 w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {passwordError && (
                  <div className="text-red-500 w-full">{passwordError}</div>
                )}
              </div>
              <div className="mb-4 w-full">
                <input
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  className="border-2 border-gray-300 rounded-md px-4 py-2 w-full"
                  value={repassword}
                  onChange={(e) => setRepassword(e.target.value)}
                />
                {repasswordError && (
                  <div className="text-red-500 w-full">{repasswordError}</div>
                )}
              </div>
              <button
                type="submit"
                className={
                  "text-white font-bold py-2 px-4 rounded transition-all duration-150 flex justify-center items-center w-full " +
                  (loading ? "bg-blue-900" : "bg-blue-800  hover:bg-blue-900")
                }
                disabled={loading}
              >
                {loading ? "Đang tải..." : "Xác nhận"}
              </button>
            </form>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
