import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { AuthContext } from "./contexts/AuthContext";

import Landing from "./pages/Landing";
import Authenticate from "./pages/Authenticate";
import UserInfo from "./pages/UserInfo";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";
import PostProperty from "./pages/PostProperty";
import ViewProperty from "./pages/ViewProperty";
import EditProperty from "./pages/EditProperty";
import axios from "./axiosConfig";

export default function PageRoute() {
  const [user, setUser] = useState(null);

  // Check if user is logged in using HttpOnly cookie
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const res = await axios.get("/api/user/info", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data?.data);
      }
    };
    checkLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dang-nhap" element={<Authenticate />} />
          <Route path="/tim-kiem" element={<Search />} />
          <Route path="/bai-dang/:id" element={<ViewProperty />} />
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

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
