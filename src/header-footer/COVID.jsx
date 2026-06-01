import React from "react";
import { Helmet } from "react-helmet-async";
import Header from "./Header";
import Footer from "./Footer";
import COVIDcomponet from "../components/COVID-page-componet/COVIDcomponet";

const COVID = () => {
  return (
    <div className="tw:flex tw:flex-col tw:min-h-screen">
      <Helmet>
        <title>COVID-19 Travel Information | FlyArzan</title>
        <meta name="description" content="Stay informed about COVID-19 travel requirements, restrictions, and safety guidelines for your next flight with FlyArzan." />
        <link rel="canonical" href="https://flyarzan.com/COVID" />
        <meta property="og:title" content="COVID-19 Travel Information | FlyArzan" />
        <meta property="og:description" content="Stay informed about COVID-19 travel requirements, restrictions, and safety guidelines for your next flight with FlyArzan." />
        <meta property="og:url" content="https://flyarzan.com/COVID" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="COVID-19 Travel Information | FlyArzan" />
        <meta name="twitter:description" content="Stay informed about COVID-19 travel requirements, restrictions, and safety guidelines for your next flight with FlyArzan." />
      </Helmet>
      <Header />
      <COVIDcomponet />
      <Footer />
    </div>
  );
};

export default COVID;
