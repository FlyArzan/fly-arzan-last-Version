// Contact page with CMS integration
import Header from "../header-footer/Header";
import Footer from "../header-footer/Footer";
import FlightSec4 from "../components/Landing_page_1_componets/FlightSec4";
import Contacthero from "../components/Contact_page_componets/Contacthero";
import Contactsec1 from "../components/Contact_page_componets/Contactsec1";
import { usePublicCmsPage } from "../hooks/useCms";

const Contact = () => {
  const { data: cmsData } = usePublicCmsPage("contact");
  const content = cmsData?.content;

  return (
    <>
      <Header />
      <Contacthero content={content?.hero} />
      <Contactsec1 content={content} />
      <FlightSec4 />
      <Footer />
    </>
  );
};

export default Contact;
