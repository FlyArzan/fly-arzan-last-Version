import { Helmet } from "react-helmet-async";
import Header from "./Header";
import Footer from "./Footer";
import AirportHubComponent from "../components/COVID-page-componet/AirportHubComponent";

const AIRPORT_PAGE_URL = "https://flyarzan.com/Airport";
const OG_IMAGE =
  "https://flyarzan.com/Pics/Airline%20wing/Air%20line%20wings%2011.jpg";
const AIRPORT_DESCRIPTION =
  "Explore airports worldwide with FlyArzan. Find details about terminals, airlines, transport, and passenger services. Search by name, city, or IATA code.";

const Airport = () => {
  return (
    <>
      <Helmet>
        <title>Airports Information Hub - FlyArzan</title>
        <meta name="description" content={AIRPORT_DESCRIPTION} />
        <link rel="canonical" href={AIRPORT_PAGE_URL} />
        <meta property="og:url" content={AIRPORT_PAGE_URL} />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Airports Information Hub - FlyArzan"
        />
        <meta property="og:description" content={AIRPORT_DESCRIPTION} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="flyarzan.com" />
        <meta property="twitter:url" content={AIRPORT_PAGE_URL} />
        <meta
          name="twitter:title"
          content="Airports Information Hub - FlyArzan"
        />
        <meta name="twitter:description" content={AIRPORT_DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE} />
      </Helmet>
      <Header />
      <AirportHubComponent />
      <Footer />
    </>
  );
};

export default Airport;
