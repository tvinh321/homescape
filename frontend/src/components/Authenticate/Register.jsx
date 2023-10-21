import { useState } from "react";

import axios from "../../axiosConfig";

export default function Register({ screen, setScreen }) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [repassword, setRepassword] = useState("");
  const [repasswordError, setRepasswordError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setEmailError("Vui lòng nhập email");
      return;
    }
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
      const res = await axios.post("/api/register", {
        email: email,
        password: password,
      });
      if (res.data?.message) {
        setSuccess(res.data.message);
      }
    } catch (err) {
      if (err.response?.data?.message == "Email already exists") {
        setError("Email đã tồn tại");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Đăng ký tài khoản</h1>
      {error && (
        <div className="bg-red-200 text-red-700 px-8 py-4 mb-4 w-2/3 text-center font-semibold">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-200 text-green-700 px-8 py-4 mb-4 w-2/3 text-center font-semibold">
          {success}
        </div>
      )}
      <form
        className="flex flex-col justify-center items-center w-full"
        onSubmit={handleRegister}
      >
        <input
          type="email"
          placeholder="Email"
          className="border-2 border-gray-300 rounded-md px-4 py-2 w-2/3 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && <div className="text-red-500 w-2/3">{emailError}</div>}
        <input
          type="password"
          placeholder="Mật khẩu"
          className="border-2 border-gray-300 rounded-md px-4 py-2 w-2/3 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && (
          <div className="text-red-500 w-2/3">{passwordError}</div>
        )}
        <input
          type="password"
          placeholder="Nhập lại mật khẩu"
          className="border-2 border-gray-300 rounded-md px-4 py-2 w-2/3 mb-4"
          value={repassword}
          onChange={(e) => setRepassword(e.target.value)}
        />
        {repasswordError && (
          <div className="text-red-500 w-2/3">{repasswordError}</div>
        )}
        <button
          type="submit"
          className="bg-blue-800 text-white hover:bg-blue-900 font-bold py-2 px-4 rounded transition-all duration-150 flex justify-center items-center w-2/3 mt-4"
        >
          Đăng ký
        </button>
      </form>
      <div className="flex justify-center items-center mt-4">
        <p className="mr-2">Chuyển về đăng nhập?</p>
        <button
          className="text-blue-700 hover:text-blue-900 font-bold"
          onClick={() => setScreen("login")}
        >
          Đăng nhập
        </button>
      </div>
    </div>
  );
}
