// Contact page with CMS integration
import { Helmet } from "react-helmet-async";
import Header from "../header-footer/Header";
import Footer from "../header-footer/Footer";
import FlightSec4 from "../components/Landing_page_1_componets/FlightSec4";
import Contacthero from "../components/Contact_page_componets/Contacthero";
import Contactsec1 from "../components/Contact_page_componets/Contactsec1";
import { usePublicCmsPage } from "../hooks/useCms";

const CONTACT_PAGE_URL = "https://flyarzan.com/Contact";
const OG_IMAGE =
  "https://flyarzan.com/Pics/Airline%20wing/Air%20line%20wings%2011.jpg";
const CONTACT_DESCRIPTION =
  "Need assistance or have questions? Contact FlyArzan at info@flyarzan.com. Our team is ready to help you with bookings, promotions, and any inquiries.";

const Contact = () => {
  const { data: cmsData } = usePublicCmsPage("contact");
  const content = cmsData?.content;

  return (
    <>
      <Helmet>
        <title>Contact FlyArzan | We&apos;re Here to Help</title>
        <meta name="description" content={CONTACT_DESCRIPTION} />
        <link rel="canonical" href="https://flyarzan.com/Contact" />
        <meta property="og:url" content={CONTACT_PAGE_URL} />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Contact FlyArzan | We're Here to Help"
        />
        <meta property="og:description" content={CONTACT_DESCRIPTION} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="flyarzan.com" />
        <meta property="twitter:url" content={CONTACT_PAGE_URL} />
        <meta
          name="twitter:title"
          content="Contact FlyArzan | We're Here to Help"
        />
        <meta name="twitter:description" content={CONTACT_DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE} />
      </Helmet>
      <Header />
      <Contacthero content={content?.hero} />
      <Contactsec1 content={content} />
      <FlightSec4 />
      <Footer />
    </>
  );
};

export default Contact;
