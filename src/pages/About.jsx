// About page with CMS integration
import Header from "../header-footer/Header";
import Footer from "../header-footer/Footer";
import Abouthero from "../components/About_page_componets/Abouthero";
import Aboutsec1 from "../components/About_page_componets/Aboutsec1";
import Aboutsec2 from "../components/About_page_componets/Aboutsec2";
import Aboutsec3 from "../components/About_page_componets/Aboutsec3";
import Aboutsec4 from "../components/About_page_componets/Aboutsec4";
import FlightSec4 from "../components/Landing_page_1_componets/FlightSec4";
import { usePublicCmsPage } from "../hooks/useCms";

const About = () => {
  const { data: cmsData, isLoading } = usePublicCmsPage("about_us");
  const content = cmsData?.content;

  return (
    <>
      <Header />
      <Abouthero content={content?.hero} isLoading={isLoading} />
      <Aboutsec1 content={content?.whoWeAre} isLoading={isLoading} />
      <Aboutsec2 content={content} isLoading={isLoading} />
      <Aboutsec3 content={content?.features} isLoading={isLoading} />
      <Aboutsec4 content={content?.whyChooseUs} isLoading={isLoading} />
      <FlightSec4 />
      <Footer />
    </>
  );
};

export default About;
