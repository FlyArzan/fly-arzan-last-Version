import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import COVIDcomponet from "../components/COVID-page-componet/COVIDcomponet";
const COVID = () => {
  return (
    <div className="tw:flex tw:flex-col tw:min-h-screen">
      <Header />
      <COVIDcomponet />
      <Footer />
    </div>
  );
};

export default COVID;
