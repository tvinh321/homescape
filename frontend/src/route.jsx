import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { AuthContext } from "./contexts/AuthContext";

import Landing from "./pages/Landing";
import Authenticate from "./pages/Authenticate";
import UserInfo from "./pages/UserInfo";
import Search from "./pages/Search";
import PostProperty from "./pages/PostProperty";
import ViewProperty from "./pages/ViewProperty";
import EditProperty from "./pages/EditProperty";
import ResetPassword from "./pages/ResetPassword";
import axios from "./axiosConfig";
import EmailVerify from "./pages/EmailVerify";

export default function PageRoute() {
  const [user, setUser] = useState(null);
  const ranOnce = useRef(false);
  const token = localStorage.getItem("token");

  // Check if user is logged in using HttpOnly cookie
  useEffect(() => {
    const checkLoggedIn = async () => {
      if (token) {
        const res = await axios.get("/api/user/info", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data?.data);
      }
    };

    if (!ranOnce.current) {
      ranOnce.current = true;
      checkLoggedIn();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dang-nhap" element={<Authenticate />} />
          <Route path="/tim-kiem" element={<Search />} />
          <Route path="/bai-dang/:id" element={<ViewProperty />} />
          <Route path="/dat-mat-khau/:token" element={<ResetPassword />} />
          <Route path="/xac-thuc/:token" element={<EmailVerify />} />
          {user && (
            <>
              <Route path="/nguoi-dung" element={<UserInfo />} />
              <Route path="/thay-doi-mat-khau" element={<UserInfo />} />
              <Route path="/bai-dang-cua-ban" element={<UserInfo />} />
              <Route path="/bai-dang-da-luu" element={<UserInfo />} />
              <Route path="/dang-tin" element={<PostProperty />} />
              <Route path="/chinh-sua/:id" element={<EditProperty />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
