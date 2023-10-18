import { useState, useContext, useEffect } from "react";

import { AuthContext } from "../../contexts/AuthContext";

import axios from "axios";

export default function ChangePassword() {
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [success, setSuccess] = useState("");

  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      window.location.href = "/dang-nhap";
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("/api/userinfo/change-password", password)
      .then((res) => {
        setSuccess(res.data.message);
      })
      .catch((err) => {
        console.log(err.response.data);
        setError(err.response.data);
      });
  };

  return (
    <div className="bg-white h-full pt-16 pb-16">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-semibold mb-8">Thay đổi mật khẩu</h1>
        <form className="flex flex-col w-full items-center" onSubmit={handleSubmit}>
          <div className="flex flex-col w-2/5">
            <label htmlFor="currentPassword" className="font-semibold mb-1">
              Mật khẩu cũ
            </label>
            <input
              type="password"
              name="currentPassword"
              id="currentPassword"
              className="border rounded-md py-2 px-2 mb-2"
              value={password.currentPassword}
              onChange={(e) =>
                setPassword({ ...password, currentPassword: e.target.value })
              }
            />
            {error.currentPassword && (
              <div className="text-red-500">{error.currentPassword}</div>
            )}

            <label htmlFor="newPassword" className="font-semibold mb-1">
              Mật khẩu mới
            </label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              className="border rounded-md py-2 px-2 mb-2"
              value={password.newPassword}
              onChange={(e) =>
                setPassword({ ...password, newPassword: e.target.value })
              }
            />
            {error.newPassword && (
              <div className="text-red-500">{error.newPassword}</div>
            )}

            <label htmlFor="confirmPassword" className="font-semibold mb-1">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              className="border rounded-md py-2 px-2 mb-2"
              value={password.confirmPassword}
              onChange={(e) =>
                setPassword({ ...password, confirmPassword: e.target.value })
              }
            />
            {error.confirmPassword && (
              <div className="text-red-500">{error.confirmPassword}</div>
            )}

            <button
              type="submit"
              className="bg-blue-700 text-white hover:bg-blue-800 font-bold py-2 px-4 rounded transition-all duration-150 flex justify-center items-center mt-8"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
