import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { AuthContext } from "./contexts/AuthContext";

import Landing from "./pages/Landing";
import Authenticate from "./pages/Authenticate";
import UserInfo from "./pages/UserInfo";

import axios from "axios";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";

export default function PageRoute() {
  const [user, setUser] = useState(null);

  // Check if user is logged in using HttpOnly cookie
  useEffect(() => {
    // axios.get("/api/auth/check").then((res) => {
    //   if (res.data.user) {
    //     setUser(res.data.user);
    //   }
    // });
    // setUser({
    //   id: 1,
    //   avatar: "https://picsum.photos/200/300",
    // });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dang-nhap" element={<Authenticate />} />
          <Route path="/tim-kiem" element={<Search />} />

          {user && (
            <>
              <Route path="/nguoi-dung" element={<UserInfo />} />
              <Route path="/bai-dang-cua-ban" element={<UserInfo />} />
              <Route path="/bai-dang-da-luu" element={<UserInfo />} />
            </>
          )}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
