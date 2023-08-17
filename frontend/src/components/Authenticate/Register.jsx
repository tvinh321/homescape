import React, { useState } from "react";
import Header from "../Header";
import Footer from "../Footer";

export default function Register({ register, setRegister }) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [repassword, setRepassword] = useState("");
  const [repasswordError, setRepasswordError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  return (
    <div className="flex flex-col items-center mt-24">
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
      <form className="flex flex-col justify-center items-center w-full">
        <label className="text-left w-2/3 mb-2">Email</label>
        <input
          type="email"
          placeholder="Email"
          className="border-2 border-gray-300 rounded-md px-4 py-2 w-2/3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && <div className="text-red-500 w-2/3">{emailError}</div>}
        <label className="text-left w-2/3 mb-2 mt-4">Mật khẩu</label>
        <input
          type="password"
          placeholder="Mật khẩu"
          className="border-2 border-gray-300 rounded-md px-4 py-2 w-2/3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && (
          <div className="text-red-500 w-2/3">{passwordError}</div>
        )}
        <label className="text-left w-2/3 mb-2 mt-4">Nhập lại mật khẩu</label>
        <input
          type="password"
          placeholder="Nhập lại mật khẩu"
          className="border-2 border-gray-300 rounded-md px-4 py-2 w-2/3"
          value={repassword}
          onChange={(e) => setRepassword(e.target.value)}
        />
        {repasswordError && (
          <div className="text-red-500 w-2/3">{repasswordError}</div>
        )}
        <button
          type="submit"
          className="bg-blue-800 text-white hover:text-black hover:bg-blue-500 font-bold py-2 px-4 rounded transition-all duration-150 flex justify-center items-center w-2/3 mt-8"
        >
          Đăng ký
        </button>
      </form>
      <div className="flex justify-center items-center mt-4 mb-16">
        <p className="mr-2">Chuyển về đăng nhập?</p>
        <button
          className="text-blue-800 hover:text-blue-500 font-bold"
          onClick={() => setRegister((prev) => !prev)}
        >
          Đăng nhập
        </button>
      </div>
    </div>
  );
}
