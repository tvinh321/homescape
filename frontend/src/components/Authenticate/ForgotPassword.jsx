import React, { useState } from "react";

export default function Login({ screen, setScreen }) {
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-8">Quên mật khẩu</h1>
      {error && (
        <div className="bg-red-200 text-red-700 px-8 py-4 mb-4 w-2/3 text-center font-semibold">
          {error}
        </div>
      )}
      <form className="flex flex-col justify-center items-center w-full">
        <input
          type="email"
          placeholder="Email"
          className="border-2 border-gray-300 rounded-md px-4 py-2 mb-4 w-2/3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className={
            "text-white font-bold py-2 px-4 rounded transition-all duration-150 flex justify-center items-center w-2/3 " +
            (loading ? "bg-blue-400" : "bg-blue-800  hover:bg-blue-900")
          }
          disabled={loading}
        >
          {loading ? "Đang tải..." : "Gửi yêu cầu"}
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
