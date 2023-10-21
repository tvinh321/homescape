import React, { useState, useContext } from "react";

import axios from "../../axiosConfig";
import { AuthContext } from "../../contexts/AuthContext";

export default function Login({ screen, setScreen }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, setUser } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/login", {
        email: email,
        password: password,
      });
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);

        const res2 = await axios.get("/api/user/info", {
          headers: { Authorization: `Bearer ${res.data.token}` },
        });
        setUser(res2.data);

        window.location.href = "/";
      }
    } catch (err) {
      if (err.response?.data?.message == "Email not found") {
        setError("Email không tồn tại");
      }
      if (err.response?.data?.message == "Invalid password") {
        setError("Mật khẩu không đúng");
      }
      if (err.response?.data?.message == "User not verified") {
        setError("Tài khoản chưa được kích hoạt bằng email");
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-8">Đăng nhập</h1>
      {error && (
        <div className="bg-red-200 text-red-700 px-8 py-4 mb-4 w-2/3 text-center font-semibold">
          {error}
        </div>
      )}
      <form
        className="flex flex-col justify-center items-center w-full"
        onSubmit={handleLogin}
      >
        <input
          type="email"
          placeholder="Email"
          className="border-2 border-gray-300 rounded-md px-4 py-2 mb-4 w-2/3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          className="border-2 border-gray-300 rounded-md px-4 py-2 mb-4 w-2/3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          className="text-blue-800 hover:text-blue-900 font-bold mb-4"
          onClick={() => setScreen("forgotPassword")}
        >
          Quên mật khẩu?
        </button>
        <button
          type="submit"
          className={
            "text-white font-bold py-2 px-4 rounded transition-all duration-150 flex justify-center items-center w-2/3 " +
            (loading ? "bg-blue-900" : "bg-blue-800  hover:bg-blue-900")
          }
          disabled={loading}
        >
          {loading ? "Đang tải..." : "Đăng nhập"}
        </button>
      </form>
      <div className="flex justify-center items-center mt-4">
        <p className="mr-2">Bạn chưa có tài khoản?</p>
        <button
          className="text-blue-700 hover:text-blue-900 font-bold"
          onClick={() => setScreen("register")}
        >
          Đăng ký
        </button>
      </div>
    </div>
  );
}
