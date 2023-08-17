import React from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function NotFound() {
  return (
    <div>
      <Header />
      <div className="h-96 font-semibold justify-center items-center flex flex-col">
        <h1 className="text-4xl">404 Not Found</h1>
        <p className="mt-4">Không tìm thấy trang</p>
      </div>
      <Footer />
    </div>
  );
}
