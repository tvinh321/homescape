import React, { useState } from "react";

import Login from "../components/Authenticate/Login";
import Register from "../components/Authenticate/Register";
import Header from "../components/Header";
import Footer from "../components/Footer";

import AuthImg from "../assets/AuthImg.jpg";
import { CSSTransition, SwitchTransition } from "react-transition-group";

export default function Authenticate() {
  const [register, setRegister] = useState(false);

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
            key={register}
            timeout={150}
            classNames="fade"
            unmountOnExit={false}
          >
            {register ? (
              <Register setRegister={setRegister} />
            ) : (
              <Login setRegister={setRegister} />
            )}
          </CSSTransition>
        </SwitchTransition>
      </div>
      <Footer />
    </>
  );
}
