import { Helmet } from "react-helmet-async";
import Header from "./Header";
import Footer from "./Footer";
import Requirementscomponet from "../components/COVID-page-componet/Requirementscomponet";

const VISA_PAGE_URL = "https://flyarzan.com/VisaRequirements";
const OG_IMAGE =
  "https://flyarzan.com/Pics/Airline%20wing/Air%20line%20wings%2011.jpg";
const VISA_DESCRIPTION =
  "Get essential visa requirements and travel documentation guidance to help you plan your trip with confidence. Learn what you need before you travel.";

const VisaRequirements = () => {
  return (
    <>
      <Helmet>
        <title>Visa Requirements Information – FlyArzan</title>
        <meta name="description" content={VISA_DESCRIPTION} />
        <link rel="canonical" href={VISA_PAGE_URL} />
        <meta property="og:url" content={VISA_PAGE_URL} />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Visa Requirements Information – FlyArzan"
        />
        <meta property="og:description" content={VISA_DESCRIPTION} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="flyarzan.com" />
        <meta property="twitter:url" content={VISA_PAGE_URL} />
        <meta
          name="twitter:title"
          content="Visa Requirements Information – FlyArzan"
        />
        <meta name="twitter:description" content={VISA_DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE} />
      </Helmet>
      <Header />
      <Requirementscomponet />
      <Footer />
    </>
  );
};

export default VisaRequirements;
