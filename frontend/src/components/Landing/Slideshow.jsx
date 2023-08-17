import React, { useState, useEffect } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "../Animations/style.css";

import Image1 from "../../assets/Landing1.jpg";
import Image2 from "../../assets/Landing2.jpg";
import Image3 from "../../assets/Landing3.jpg";
import Search from "./Search";

export default function Slideshow() {
  const [image, setImage] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setImage((image) => {
        if (image === 3) return 1;
        return image + 1;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <link rel="preload" href={Image1} as="image" />
      <link rel="preload" href={Image2} as="image" />
      <link rel="preload" href={Image3} as="image" />

      <div className="relative h-[30rem]">
        <TransitionGroup>
          <CSSTransition
            key={image}
            timeout={300}
            classNames="fade"
            unmountOnExit={false}
          >
            <img
              src={image === 1 ? Image1 : image === 2 ? Image2 : Image3}
              alt="Landing Image"
              className="absolute w-full h-fit object-cover -z-10"
              // style={{
              //     animation: "slowScroll 10s linear infinite",
              // }}
            />
          </CSSTransition>
        </TransitionGroup>
        <div
          className="bg-transparent h-full"
          style={{
            boxShadow: "0px 0px 200px 100px rgba(0, 0, 0, 0.3) inset",
          }}
        >
          <div className="h-full justify-center items-center flex flex-col text-gray-100">
            <p className="text-4xl font-bold mb-12 drop-shadow-xl">
              Tìm kiếm mái ấm của bạn
            </p>
            <Search />
          </div>
        </div>
      </div>
    </>
  );
}
