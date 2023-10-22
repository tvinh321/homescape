import { useState, useContext, useEffect } from "react";

import { AuthContext } from "../../contexts/AuthContext";

import axios from "../../axiosConfig";

export default function ChangePassword() {
  const token = localStorage.getItem("token");

  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState({
    serverError: "",
    oldPassword: "",
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

    setError({
      serverError: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setSuccess("");

    if (!password.oldPassword) {
      setError({ ...error, oldPassword: "Vui lòng nhập mật khẩu cũ" });
      return;
    }

    if (!password.newPassword) {
      setError({ ...error, newPassword: "Vui lòng nhập mật khẩu mới" });
      return;
    }

    if (!password.confirmPassword) {
      setError({
        ...error,
        confirmPassword: "Vui lòng xác nhận mật khẩu mới",
      });
      return;
    }

    if (password.newPassword !== password.confirmPassword) {
      setError({
        ...error,
        confirmPassword: "Mật khẩu mới không khớp",
      });
      return;
    }

    axios
      .post("/api/user/changePassword", password, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setSuccess("Đổi mật khẩu thành công");
        setPassword({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      })
      .catch((err) => {
        console.log(err.response?.data?.message);
        if (
          err.response?.data?.message ==
          "New password must be different from old password"
        ) {
          setError({
            ...error,
            serverError: "Mật khẩu mới phải khác mật khẩu cũ",
          });
        } else if (err.response?.data?.message == "Old password is incorrect") {
          setError({
            ...error,
            serverError: "Mật khẩu cũ không chính xác",
          });
        } else {
          setError({
            ...error,
            serverError: "Đã xảy ra lỗi",
          });
        }
      });
  };

  return (
    <div className="bg-white h-full pt-16 pb-16">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-semibold mb-8">Thay đổi mật khẩu</h1>
        {error.serverError && (
          <div className="bg-red-200 text-red-700 px-8 py-4 mb-4 w-2/3 text-center font-semibold">
            {error.serverError}
          </div>
        )}
        {success && (
          <div className="bg-green-200 text-green-700 px-8 py-4 mb-4 w-2/3 text-center font-semibold">
            {success}
          </div>
        )}
        <form
          className="flex flex-col w-full items-center"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col w-2/5">
            <label htmlFor="oldPassword" className="font-semibold mb-1">
              Mật khẩu cũ
            </label>
            <input
              type="password"
              name="oldPassword"
              id="oldPassword"
              className="border rounded-md py-2 px-2 mb-2"
              value={password.oldPassword}
              onChange={(e) =>
                setPassword({ ...password, oldPassword: e.target.value })
              }
            />
            {error.oldPassword && (
              <div className="text-red-500">{error.oldPassword}</div>
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
