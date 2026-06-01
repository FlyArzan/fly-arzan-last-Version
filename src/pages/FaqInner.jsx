// FAQ page with CMS integration
import { Helmet } from "react-helmet-async";
import Header from "../header-footer/Header";
import Footer from "../header-footer/Footer";
import FaqInnerhero from "../components/FaqInner_page_componets/FaqInnerhero";
import FaqInnersec2 from "../components/FaqInner_page_componets/FaqInnersec2";
import { usePublicCmsPage } from "../hooks/useCms";

const FAQ_CANONICAL = "https://flyarzan.com/Faq";
const FAQ_OG_URL = "https://flyarzan.com/Faq";
const OG_IMAGE =
  "https://flyarzan.com/Pics/Airline%20wing/Air%20line%20wings%2011.jpg";
const FAQ_DESCRIPTION =
  "Explore our FAQ section for answers to common questions about flights, hotels, car rentals, and payments. Get the information you need to plan your journey.";

const faqPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I search for flights on your website?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "To search for flights, simply enter your departure and destination locations, along with your travel dates and number of passengers. Our search engine will show you the best available options.",
      },
    },
    {
      "@type": "Question",
      name: "Can I book a flight directly on your website?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, we are a travel search engine. We help you find the best flight options, but bookings are made directly with airlines or other travel providers.",
      },
    },
    {
      "@type": "Question",
      name: "Are the flight prices shown in real-time?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the flight prices are updated in real-time, reflecting the latest available fares from airlines.",
      },
    },
    {
      "@type": "Question",
      name: "Do your flight prices include taxes and fees?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our flight prices include taxes and fees unless otherwise stated. You will see a breakdown of all costs before confirming your booking.",
      },
    },
    {
      "@type": "Question",
      name: "Can I search for one-way, round-trip, or multi-city flights?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can search for one-way, round-trip, or multi-city flights using our search engine, depending on your travel preferences.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer flexible date search options?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, our search engine allows you to choose flexible dates to find the best deals that fit your travel schedule.",
      },
    },
    {
      "@type": "Question",
      name: "How can I filter flights by airline, price, or duration?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can filter flights by airline, price range, or duration using the filter options provided in the search results.",
      },
    },
  ],
};

const FaqInner = () => {
  const { data: cmsData } = usePublicCmsPage("faq");
  const content = cmsData?.content;

  return (
    <>
      <Helmet>
        <title>FAQ - Answers to Common Travel Questions | FlyArzan</title>
        <meta name="description" content={FAQ_DESCRIPTION} />
        <link rel="canonical" href={FAQ_CANONICAL} />
        <meta property="og:url" content={FAQ_OG_URL} />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="FAQ - Answers to Common Travel Questions | FlyArzan"
        />
        <meta property="og:description" content={FAQ_DESCRIPTION} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="flyarzan.com" />
        <meta property="twitter:url" content={FAQ_OG_URL} />
        <meta
          name="twitter:title"
          content="FAQ - Answers to Common Travel Questions | FlyArzan"
        />
        <meta name="twitter:description" content={FAQ_DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE} />
        <script type="application/ld+json">
          {JSON.stringify(faqPageJsonLd)}
        </script>
      </Helmet>
      <Header />
      <FaqInnerhero content={content?.hero} />
      <FaqInnersec2 content={content} />
      <Footer />
    </>
  );
};

export default FaqInner;
