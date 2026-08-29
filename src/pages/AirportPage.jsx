import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import PropTypes from "prop-types";
import { ChevronRight, Info, Lightbulb, Plane } from "lucide-react";
import Header from "../header-footer/Header";
import Footer from "../header-footer/Footer";
import { usePublicAirport } from "../hooks/useCms";

const SITE = "https://flyarzan.com";
const OG_IMAGE =
  "https://flyarzan.com/Pics/Airline%20wing/Air%20line%20wings%2011.jpg";

/** Anchor link in the sticky section nav. */
const SectionLink = ({ href, children }) => (
  <a
    href={href}
    className="tw:text-sm tw:text-gray-600! tw:hover:text-primary! tw:py-3! tw:border-b-2 tw:border-transparent tw:hover:border-primary tw:transition-colors tw:whitespace-nowrap"
  >
    {children}
  </a>
);

SectionLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const AirportPage = () => {
  const { iata } = useParams();
  const code = String(iata || "").toUpperCase();

  const { data: airport, isLoading, isError } = usePublicAirport(code);

  const sections = airport?.sections || [];
  const tips = airport?.tips || [];
  const terminals = useMemo(
    () => (airport?.terminals || []).filter(Boolean),
    [airport?.terminals],
  );

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="container tw:pt-28! tw:md:pt-36! tw:pb-16! tw:animate-pulse">
          <div className="tw:h-8 tw:bg-gray-200 tw:rounded tw:mb-4! tw:w-3/4" />
          <div className="tw:h-64 tw:bg-gray-100 tw:rounded-2xl tw:mb-6!" />
          <div className="tw:space-y-3!">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`tw:h-4 tw:bg-gray-100 tw:rounded tw:${i % 4 === 3 ? "w-2/3" : "w-full"}`}
              />
            ))}
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // A missing airport must not be indexed — the same guard the airline, visa and
  // article pages use for their not-found states.
  if (isError || !airport) {
    return (
      <>
        <Helmet>
          <title>Airport not found | FlyArzan</title>
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <Header />
        <main className="container tw:pt-28! tw:pb-20! tw:text-center!">
          <Plane className="tw:w-10 tw:h-10 tw:text-gray-300 tw:mx-auto! tw:mb-3!" />
          <h1 className="tw:text-xl tw:font-bold! tw:text-dark-purple tw:mb-2!">
            Airport not found
          </h1>
          <p className="tw:text-sm tw:text-gray-500 tw:mb-6!">
            We don&apos;t have a guide for &ldquo;{code}&rdquo; yet.
          </p>
          <Link
            to="/Airport"
            className="tw:inline-flex tw:items-center tw:gap-2! tw:h-10 tw:px-4! tw:rounded-lg tw:bg-primary! tw:text-white! tw:text-sm tw:font-medium"
          >
            Browse all airports
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const pageUrl = `${SITE}/Airport/${code}`;
  const locationLabel = [airport.city, airport.country]
    .filter(Boolean)
    .join(", ");
  // Baggage and airline guides now live on their own /Airlines pages, so the
  // airport title focuses on the information that still lives here.
  const title = `${airport.name}${code ? ` (${code})` : ""} — Terminals & Travel Tips | FlyArzan`;
  const description =
    airport.introduction?.slice(0, 300) ||
    `${airport.name} airport guide: terminal information, location and travel tips${locationLabel ? ` in ${locationLabel}` : ""}.`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Airports", item: `${SITE}/Airport` },
      { "@type": "ListItem", position: 3, name: airport.name, item: pageUrl },
    ],
  };

  const airportSchema = {
    "@context": "https://schema.org",
    "@type": "Airport",
    name: airport.name,
    iataCode: code || undefined,
    url: pageUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: airport.city || undefined,
      addressCountry: airport.country || undefined,
    },
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={OG_IMAGE} />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(airportSchema)}
        </script>
      </Helmet>

      <Header />

      {/* Hero */}
      <section className="tw:bg-dark-purple tw:text-white tw:pt-24! tw:md:pt-28! tw:pb-10! tw:px-4! tw:sm:px-6!">
        <div className="container">
          <nav className="tw:flex tw:items-center tw:gap-1.5! tw:text-sm tw:text-white/60 tw:mb-5! tw:flex-wrap">
            <Link to="/" className="tw:hover:text-white tw:transition-colors">
              Home
            </Link>
            <ChevronRight className="tw:w-3.5 tw:h-3.5" />
            <Link to="/Airport" className="tw:hover:text-white tw:transition-colors">
              Airports
            </Link>
            <ChevronRight className="tw:w-3.5 tw:h-3.5" />
            <span className="tw:text-white tw:font-medium">{airport.name}</span>
          </nav>

          <div className="tw:flex tw:items-start tw:gap-4! tw:flex-wrap">
            <div className="tw:flex-1 tw:min-w-[240px]">
              <div className="tw:flex tw:items-center tw:gap-3! tw:mb-2! tw:flex-wrap">
                <h1 className="tw:text-2xl tw:md:text-4xl tw:font-bold! tw:text-white tw:m-0! tw:leading-tight">
                  {airport.name}
                </h1>
                {code && (
                  <span className="tw:text-sm tw:font-bold tw:px-2.5! tw:py-1! tw:rounded-lg tw:bg-primary! tw:text-white! tw:tracking-wide">
                    {code}
                  </span>
                )}
              </div>
              {locationLabel && (
                <p className="tw:text-white/70 tw:text-sm tw:md:text-base tw:m-0! tw:flex tw:items-center tw:gap-2!">
                  <span className="tw:text-xs tw:leading-none">
                    {airport.flag && <span>{airport.flag}</span>}
                  </span>
                  {locationLabel}
                </p>
              )}
            </div>

            {/* Quick facts — terminals + a pointer to airline baggage, which now
                lives on the dedicated /Airlines pages. */}
            <div className="tw:flex tw:gap-3! tw:flex-wrap">
              {terminals.length > 0 && (
                <div className="tw:bg-white/10 tw:rounded-xl tw:px-4! tw:py-3! tw:min-w-[104px]">
                  <p className="tw:text-xl tw:font-bold tw:text-white tw:m-0!">
                    {terminals.length}
                  </p>
                  <p className="tw:text-xs tw:text-white/60 tw:m-0!">
                    Terminal{terminals.length === 1 ? "" : "s"}
                  </p>
                </div>
              )}
              <div className="tw:bg-white/10 tw:rounded-xl tw:px-4! tw:py-3! tw:min-w-[104px] tw:flex tw:items-center">
                <Plane className="tw:w-4 tw:h-4 tw:text-white/60" />
                <Link
                  to="/Airlines"
                  className="tw:ml-2! tw:text-sm tw:text-white! tw:hover:text-primary! tw:transition-colors"
                >
                  Airline baggage →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky section nav — the page is long once sections/tips are filled in,
          so give readers a way to jump. */}
      <div className="tw:sticky tw:top-[72px] tw:z-40 tw:bg-white tw:border-b tw:border-gray-100 tw:shadow-sm">
        <div className="container tw:px-4! tw:sm:px-6!">
          <nav className="tw:flex tw:items-center tw:gap-6! tw:overflow-x-auto tw:scrollbar-hide">
            {(airport.introduction || sections.length > 0) && (
              <SectionLink href="#about">About</SectionLink>
            )}
            {tips.length > 0 && <SectionLink href="#tips">Travel tips</SectionLink>}
          </nav>
        </div>
      </div>

      <main className="container tw:py-10! tw:px-4! tw:sm:px-6!">
        {/* About */}
        {(airport.introduction || sections.length > 0) && (
          <section id="about" className="tw:scroll-mt-32! tw:mb-10!">
            {airport.introduction && (
              <p className="tw:text-base tw:text-gray-600 tw:leading-relaxed tw:mb-6! tw:max-w-3xl">
                {airport.introduction}
              </p>
            )}

            {sections.length > 0 && (
              <>
                <div className="tw:flex tw:items-center tw:gap-2! tw:mb-4!">
                  <Info className="tw:w-5 tw:h-5 tw:text-primary" />
                  <h2 className="tw:text-lg tw:font-bold! tw:text-dark-purple tw:m-0!">
                    Airport information
                  </h2>
                </div>
                <div className="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-4!">
                  {sections.map((section, i) => (
                    <div
                      key={i}
                      className="tw:bg-white tw:rounded-2xl tw:border tw:border-gray-100 tw:p-5!"
                    >
                      {section.title && (
                        <h3 className="tw:text-base tw:font-semibold! tw:text-dark-purple tw:mb-2!">
                          {section.title}
                        </h3>
                      )}
                      {section.content && (
                        <p className="tw:text-sm tw:text-gray-600 tw:leading-relaxed tw:m-0!">
                          {section.content}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        )}

        {/* Travel tips */}
        {tips.length > 0 && (
          <section id="tips" className="tw:scroll-mt-32! tw:mb-10!">
            <div className="tw:flex tw:items-center tw:gap-2! tw:mb-4!">
              <Lightbulb className="tw:w-5 tw:h-5 tw:text-primary" />
              <h2 className="tw:text-lg tw:font-bold! tw:text-dark-purple tw:m-0!">
                Travel tips
              </h2>
            </div>
            <ul className="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-3!">
              {tips.map((tip, i) => (
                <li
                  key={i}
                  className="tw:flex tw:items-start tw:gap-3! tw:bg-white tw:rounded-xl tw:border tw:border-gray-100 tw:p-4!"
                >
                  <span className="tw:w-6 tw:h-6 tw:rounded-full tw:bg-primary/10 tw:text-primary tw:text-xs tw:font-bold tw:flex tw:items-center tw:justify-center tw:shrink-0 tw:mt-0.5!">
                    {i + 1}
                  </span>
                  <span className="tw:text-sm tw:text-gray-600 tw:leading-relaxed">
                    {tip}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Keep readers inside the travel content cluster. */}
        <section className="tw:mt-12! tw:pt-8! tw:border-t tw:border-gray-100">
          <h2 className="tw:text-base tw:font-bold! tw:text-dark-purple tw:mb-4!">
            Keep planning
          </h2>
          <div className="tw:flex tw:flex-wrap tw:gap-3!">
            {[
              { to: "/Airport", icon: Plane, label: "All airports" },
              { to: "/Airlines", icon: Plane, label: "Airlines" },
              { to: "/travel-guides", icon: Plane, label: "Travel Guides" },
            ].map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className="tw:inline-flex tw:items-center tw:gap-2! tw:h-10 tw:px-4! tw:rounded-lg tw:border tw:border-gray-200 tw:text-sm tw:text-gray-600! tw:hover:border-primary tw:hover:text-primary! tw:transition-colors"
              >
                <Icon className="tw:w-4 tw:h-4" />
                {label}
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default AirportPage;
