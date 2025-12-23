// Privacy Policy page with CMS integration
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
      <Header />
      <PrivacyPolicysec1 content={content} />
      <FlightSec4 />
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
