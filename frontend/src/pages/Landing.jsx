import React, { useState, useEffect } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import Slideshow from "../components/Landing/Slideshow";
import OutstandingProperties from "../components/Landing/OutstandingProperties";
import News from "../components/Landing/News";

export default function Landing() {
  return (
    <div>
      <Header />
      <div>
        <Slideshow />
        <News />
        <OutstandingProperties />
      </div>
      <Footer />
    </div>
  );
}
