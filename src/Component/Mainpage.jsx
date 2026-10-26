import React from "react";
import Firstpage from "./Firstpage";
import Secondpage from "./Secondpage";
import Footer from "./Footer";
import Carousel from "./Carousel";

export default function Mainpage() {
  return (
    <main className="pt-16">
      <Firstpage />
      <Carousel/>
      <Secondpage/>
      <Footer/>
      
    </main>
  );
}