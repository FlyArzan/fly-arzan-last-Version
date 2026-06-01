// Privacy Policy page with CMS integration
import { Helmet } from "react-helmet-async";
import Header from "../header-footer/Header";
import Footer from "../header-footer/Footer";
import FlightSec4 from "../components/Landing_page_1_componets/FlightSec4";
import PrivacyPolicysec1 from "../components/PrivacyPolicy_page_componets/PrivacyPolicysec1";
import { usePublicCmsPage } from "../hooks/useCms";

const PrivacyPolicy = () => {
  const { data: cmsData } = usePublicCmsPage("privacy_policy");
  const content = cmsData?.content;

  return (
    <>
      <Helmet>
        <title>Privacy Policy | FlyArzan</title>
        <meta
          name="description"
          content="Read FlyArzan's privacy policy to understand how we collect, use, and protect your personal information when you use our flight search platform."
        />
        <link rel="canonical" href="https://flyarzan.com/PrivacyPolicy" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <Header />
      <PrivacyPolicysec1 content={content} />
      <FlightSec4 />
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
