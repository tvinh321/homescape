import { useState, useContext } from "react";
import HomeScapeColor from "./../assets/homescape-color.svg";
import { UserIcon } from "@heroicons/react/24/solid";
import { AuthContext } from "../contexts/AuthContext";
import { CSSTransition } from "react-transition-group";
import "./Animations/style.css";
import { baseURL } from "../axiosConfig";

export default function Header() {
  const { user, setUser } = useContext(AuthContext);

  const [userMenu, setUserMenu] = useState(false);

  return (
    <div className="px-24 bg-white">
      <div className="h-24 w-full">
        <div className="flex justify-between items-center h-full">
          <a href="/">
            <div className="flex items-center">
              <img
                src={HomeScapeColor}
                alt="HomeScape Logo"
                className="h-14 ml-4 object-cover"
              />
            </div>
          </a>
          <div>
            <ul className="flex text-md mr-16 items-center">
              <li className="mr-10">
                <a
                  href="/"
                  className="text-black hover:text-blue-800 font-semibold transition-all duration-150"
                >
                  Trang chủ
                </a>
              </li>
              <li className="mr-10">
                <a
                  href="/tim-kiem"
                  className="text-black hover:text-blue-800 font-semibold transition-all duration-150"
                >
                  Nhà đất
                </a>
              </li>
              <li className="mr-10">
                <a
                  href={user ? "/dang-tin" : "/dang-nhap"}
                  className="text-black hover:text-blue-800 font-semibold transition-all duration-150"
                >
                  Đăng tin
                </a>
              </li>
              <li className="mr-10">
                {user ? (
                  <div className="relative">
                    <img
                      src={baseURL + "/api/avatar/" + user.id}
                      alt="avatar"
                      className="h-14 w-14 rounded-full cursor-pointer object-cover"
                      onClick={() => {
                        setUserMenu((prev) => !prev);
                      }}
                    />

                    <CSSTransition
                      in={userMenu}
                      timeout={150}
                      classNames="list-dropdown"
                      unmountOnExit
                    >
                      <div className="absolute right-0 mt-4 w-48 bg-white rounded-md shadow-lg border py-1 z-50">
                        <a
                          href="/nguoi-dung"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-700 hover:text-white"
                        >
                          Thông tin cá nhân
                        </a>
                        <a
                          href="/thay-doi-mat-khau"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-700 hover:text-white"
                        >
                          Thay đổi mật khẩu
                        </a>
                        <a
                          href="/bai-dang-cua-ban"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-700 hover:text-white"
                        >
                          Bài đăng của bạn
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-700 hover:text-white"
                          onClick={(e) => {
                            e.preventDefault();
                            localStorage.removeItem("token");
                            setUser(null);
                            window.location.href = "/";
                          }}
                        >
                          Đăng xuất
                        </a>
                      </div>
                    </CSSTransition>
                  </div>
                ) : (
                  <a href="/dang-nhap">
                    <button className="bg-blue-700 text-white  hover:bg-blue-800 font-bold py-2 px-4 rounded transition-all duration-150 flex justify-center items-center">
                      <UserIcon className="h-5 w-5 mr-1" />
                      Đăng nhập
                    </button>
                  </a>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
