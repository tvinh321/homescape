import React, { useContext, useState } from "react";

import {
  IdentificationIcon,
  BuildingOffice2Icon,
  HeartIcon,
} from "@heroicons/react/24/outline";

import { AuthContext } from "../../contexts/AuthContext";

export default function UserMenu({ selected, setSelected }) {
  const { user, setUser } = useContext(AuthContext);

  return (
    <div className="w-1/5 h-screen">
      <img
        src={user?.avatar}
        alt="avatar"
        className="rounded-full w-32 h-32 mx-auto my-10"
      />
      <div className="text-center">
        <h1 className="text-2xl font-bold">Nguyễn Văn A</h1>
        <p className="text-sm">Thành viên từ 2021</p>
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
