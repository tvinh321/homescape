import React from "react";
import HomeScapeWhite from "./../assets/homescape-white.svg";

export default function Footer() {
  return (
    <div>
      <div className="w-full bg-black px-36 pt-12 pb-16">
        <div className="flex justify-between items-center h-full">
          <div className="">
            <img
              src={HomeScapeWhite}
              alt="HomeScape Logo"
              className="h-14 mb-20"
            />
          </div>
        </div>
        <div className="text-center mt-10">
          <span className="text-sm text-gray-400">
            Copyright © 2023{" "}
            <a href="/" className="hover:underline">
              HomeScape
            </a>
            .
          </span>
        </div>
      </div>
    </div>
  );
}
