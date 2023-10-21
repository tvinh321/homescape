import React, { useState } from "react";

import Login from "../components/Authenticate/Login";
import Register from "../components/Authenticate/Register";
import ForgotPassword from "../components/Authenticate/ForgotPassword";

import Header from "../components/Header";
import Footer from "../components/Footer";

import AuthImg from "../assets/AuthImg.jpg";
import { CSSTransition, SwitchTransition } from "react-transition-group";

export default function Authenticate() {
  const [screen, setScreen] = useState("login");

  return (
    <>
      <Header />
      <div className="grid grid-cols-2 gap-0">
        <img
          src={AuthImg}
          alt="AuthImg"
          className="w-full h-[43rem] object-cover"
        />
        <SwitchTransition>
          <CSSTransition
            key={screen}
            timeout={150}
            classNames="fade"
            unmountOnExit={false}
          >
            {screen == "register" ? (
              <Register setScreen={setScreen} />
            ) : screen == "login" ? (
              <Login setScreen={setScreen} />
            ) : (
              <ForgotPassword setScreen={setScreen} />
            )}
          </CSSTransition>
        </SwitchTransition>
      </div>
      <Footer />
    </>
  );
}
