import React, { useState, useEffect } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import UserMenu from "../components/UserInfo/UserMenu";
import { SwitchTransition, CSSTransition } from "react-transition-group";

import InfoChange from "../components/UserInfo/InfoChange";
import MyPost from "../components/UserInfo/MyPost";
import FavoritePost from "../components/UserInfo/FavoritePost";

export default function UserInfo() {
  const [selected, setSelected] = useState("nguoi-dung");

  return (
    <div>
      <Header />
      <div className="flex">
        <UserMenu selected={selected} setSelected={setSelected} />
        <div className="w-4/5 bg-gray-200 h-screen">
          <SwitchTransition>
            <CSSTransition
              key={selected}
              timeout={150}
              classNames="fade"
              unmountOnExit={false}
            >
              {selected === "nguoi-dung" ? (
                <InfoChange />
              ) : selected === "bai-dang-cua-ban" ? (
                <MyPost />
              ) : (
                <FavoritePost />
              )}
            </CSSTransition>
          </SwitchTransition>
        </div>
      </div>
      <Footer />
    </div>
  );
}
