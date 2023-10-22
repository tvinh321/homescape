import { useContext, useState, useRef } from "react";

import {
  IdentificationIcon,
  BuildingOffice2Icon,
  HeartIcon,
  KeyIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";

import { AuthContext } from "../../contexts/AuthContext";
import axios, { baseURL } from "../../axiosConfig";

export default function UserMenu({ selected, setSelected }) {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const inputFile = useRef(null);
  const [file, setFile] = useState(null);

  const handleAvatarChange = (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    axios
      .post("/api/user/avatar", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="w-1/5 h-full">
      <div className="flex items-center justify-center mb-4">
        <div
          className="relative"
          onClick={() => {
            inputFile.current.click();
          }}
        >
          <img
            className="w-36 h-36 object-cover rounded-full hover:opacity-75 transition-all duration-200"
            alt="User avatar"
            src={
              file
                ? URL.createObjectURL(file)
                : baseURL + `/api/avatar/${user.id}`
            }
          />
          <span className="absolute right-0 bottom-1">
            <CameraIcon className="w-6 h-6 mr-2" />
            <input
              type="file"
              accept="image/*"
              id="file"
              ref={inputFile}
              style={{
                display: "none",
              }}
              onChange={() => {
                handleAvatarChange({
                  target: {
                    files: [inputFile.current.files[0]],
                  },
                });
              }}
            />
          </span>
        </div>
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-bold">{user?.name}</h1>
      </div>
      <div className="mt-5">
        <ul className="flex flex-col">
          <li
            className={
              "hover:bg-blue-700 hover:text-white px-4 py-4 transition-all duration-200" +
              (selected === "nguoi-dung" ? " bg-blue-700 text-white" : "")
            }
          >
            <a
              href="#"
              className="flex items-center"
              onClick={(e) => {
                e.preventDefault();
                setSelected("nguoi-dung");
                window.history.pushState({}, "", "/nguoi-dung");
              }}
            >
              <IdentificationIcon className="h-5 w-5 mr-2" />
              <span>Thông tin cá nhân</span>
            </a>
          </li>
          <li
            className={
              "hover:bg-blue-700 hover:text-white px-4 py-4 transition-all duration-200" +
              (selected === "thay-doi-mat-khau"
                ? " bg-blue-700 text-white"
                : "")
            }
          >
            <a
              href="#"
              className="flex items-center"
              onClick={(e) => {
                e.preventDefault();
                setSelected("thay-doi-mat-khau");
                window.history.pushState({}, "", "/thay-doi-mat-khau");
              }}
            >
              <KeyIcon className="h-5 w-5 mr-2" />
              <span>Thay đổi mật khẩu</span>
            </a>
          </li>
          <li
            className={
              "hover:bg-blue-700 hover:text-white px-4 py-4 transition-all duration-200" +
              (selected === "bai-dang-cua-ban" ? " bg-blue-700 text-white" : "")
            }
          >
            <a
              href="#"
              className="flex items-center"
              onClick={(e) => {
                e.preventDefault();
                setSelected("bai-dang-cua-ban");
                window.history.pushState({}, "", "/bai-dang-cua-ban");
              }}
            >
              <BuildingOffice2Icon className="h-5 w-5 mr-2" />
              <span>Bài đăng của bạn</span>
            </a>
          </li>
          <li
            className={
              "hover:bg-blue-700 hover:text-white px-4 py-4 transition-all duration-200" +
              (selected === "bai-dang-da-luu" ? " bg-blue-700 text-white" : "")
            }
          >
            <a
              href="#"
              className="flex items-center"
              onClick={(e) => {
                e.preventDefault();
                setSelected("bai-dang-da-luu");
                window.history.pushState({}, "", "/bai-dang-da-luu");
              }}
            >
              <HeartIcon className="h-5 w-5 mr-2" />
              <span>Bài đăng yêu thích</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
