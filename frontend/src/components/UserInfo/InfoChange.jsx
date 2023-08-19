import { useState, useContext, useEffect } from "react";

import { AuthContext } from "../../contexts/AuthContext";

import axios from "axios";

export default function InfoChange() {
  const { user } = useContext(AuthContext);

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    facebook: "",
  });

  const [error, setError] = useState({
    name: "",
    email: "",
    phone: "",
    facebook: "",
  });

  // useEffect(() => {
  //   if (!user) {
  //     window.location.href = "/dang-nhap";
  //   }

  //   axios
  //     .get(`/api/userinfo`)
  //     .then((res) => {
  //       console.log(res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, [user]);

  return (
    <div className="bg-white h-full pt-16 pb-16">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-semibold mb-8">Thông tin cá nhân</h1>
        <form className="flex flex-col w-full items-center">
          <div className="flex flex-col w-2/5">
            <label htmlFor="name" className="font-semibold mb-1">
              Họ và tên
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="border border-gray-400 rounded-md py-2 px-2 mb-2"
              value={userInfo.name}
              onChange={(e) =>
                setUserInfo({ ...userInfo, name: e.target.value })
              }
            />
            {error.name && <div className="text-red-500">{error.name}</div>}

            <label htmlFor="email" className="font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="border border-gray-400 rounded-md py-2 px-2 mb-2"
              value={userInfo.email}
              onChange={(e) =>
                setUserInfo({ ...userInfo, email: e.target.value })
              }
            />

            <label htmlFor="phone" className="font-semibold mb-1">
              Số điện thoại
            </label>
            <input
              type="text"
              name="phone"
              id="phone"
              className="border border-gray-400 rounded-md py-2 px-2 mb-2"
              value={userInfo.phone}
              onChange={(e) =>
                setUserInfo({ ...userInfo, phone: e.target.value })
              }
            />

            <label htmlFor="facebook" className="font-semibold mb-1">
              Facebook
            </label>
            <input
              type="text"
              name="facebook"
              id="facebook"
              className="border border-gray-400 rounded-md py-2 px-2 mb-2"
              value={userInfo.facebook}
              onChange={(e) =>
                setUserInfo({ ...userInfo, facebook: e.target.value })
              }
            />

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
