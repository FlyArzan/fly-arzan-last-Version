import { Helmet } from "react-helmet-async";
import Header from "../header-footer/Header";
import Footer from "../header-footer/Footer";
import Abouthero from "../components/About_page_componets/Abouthero";
import Aboutsec1 from "../components/About_page_componets/Aboutsec1";
import Aboutsec2 from "../components/About_page_componets/Aboutsec2";
import Aboutsec3 from "../components/About_page_componets/Aboutsec3";
import Aboutsec4 from "../components/About_page_componets/Aboutsec4";
import FlightSec4 from "../components/Landing_page_1_componets/FlightSec4";
import { usePublicCmsPage } from "../hooks/useCms";

const ABOUT_PAGE_URL = "https://flyarzan.com/about-us";
const OG_IMAGE =
  "https://flyarzan.com/Pics/Airline%20wing/Air%20line%20wings%2011.jpg";
const ABOUT_DESCRIPTION =
  "Find the best deals on flights, hotels, and car rentals all in one place with FlyArzan. Travel smarter and cheaper, with expert support and seamless booking.";

const About = () => {
  const { data: cmsData, isLoading } = usePublicCmsPage("about_us");
  const content = cmsData?.content;

  return (
    <>
      <Helmet>
        <title>Affordable Travel Search Engine - FlyArzan</title>
        <link rel="canonical" href={ABOUT_PAGE_URL} />
        <meta name="description" content={ABOUT_DESCRIPTION} />
        <meta property="og:url" content={ABOUT_PAGE_URL} />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Affordable Travel Search Engine - FlyArzan"
        />
        <meta property="og:description" content={ABOUT_DESCRIPTION} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="flyarzan.com" />
        <meta property="twitter:url" content={ABOUT_PAGE_URL} />
        <meta
          name="twitter:title"
          content="Affordable Travel Search Engine - FlyArzan"
        />
        <meta name="twitter:description" content={ABOUT_DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE} />
      </Helmet>
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
