import { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import PropTypes from "prop-types";
import {
  ChevronRight,
  Globe,
  Info,
  Luggage,
  MapPin,
  Plane,
  Search,
  Download,
  Lightbulb,
  Building2,
} from "lucide-react";
import Header from "../header-footer/Header";
import Footer from "../header-footer/Footer";
import AirlineLogo from "@/components/ui/airline-logo";
import { usePublicAirport } from "../hooks/useCms";

const SITE = "https://flyarzan.com";
const OG_IMAGE =
  "https://flyarzan.com/Pics/Airline%20wing/Air%20line%20wings%2011.jpg";

/** Normalise a website value into something safe to put in href. */
const toHref = (website) => {
  const value = String(website || "").trim();
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
};

/** Strip the scheme so the card shows "emirates.com", as in the reference. */
const toDomain = (website) =>
  String(website || "")
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/$/, "");

/**
 * One airline card — logo, name, IATA, terminal, website.
 *
 * The logo comes from public/logos/<IATA>.png via AirlineLogo, which falls back
 * to a plane glyph when a carrier has no committed PNG (905 exist, so misses
 * are normal and must not render a broken image).
 */
const AirlineCard = ({ airline }) => {
  const href = toHref(airline.website);
  return (
    <div className="tw:bg-white tw:rounded-2xl tw:border tw:border-gray-100 tw:shadow-sm tw:hover:shadow-md tw:transition-shadow tw:overflow-hidden">
      <div className="tw:h-28 tw:flex tw:items-center tw:justify-center tw:px-6! tw:border-b tw:border-gray-100 tw:overflow-hidden">
        <AirlineLogo
          code={airline.iata}
          name={airline.name}
          fallback="plane"
          className="tw:w-[150px] tw:h-auto tw:shrink-0"
          fallbackClassName="tw:w-full tw:h-16"
        />
      </div>
      <div className="tw:p-4!">
        <p className="tw:font-semibold tw:text-dark-purple tw:text-base tw:m-0! tw:truncate">
          {airline.name || airline.iata}
        </p>
        {airline.iata && (
          <p className="tw:text-sm tw:text-gray-400 tw:mt-0.5! tw:mb-3!">
            {airline.iata.toUpperCase()}
          </p>
        )}
        <div className="tw:flex tw:flex-col tw:gap-2!">
          {airline.terminal && (
            <div className="tw:flex tw:items-center tw:gap-2.5!">
              <span className="tw:w-7 tw:h-7 tw:rounded-lg tw:bg-primary/10 tw:flex tw:items-center tw:justify-center tw:shrink-0">
                <MapPin className="tw:w-3.5 tw:h-3.5 tw:text-primary" />
              </span>
              <span className="tw:text-sm tw:text-gray-600">
                Terminal: {airline.terminal}
              </span>
            </div>
          )}
          {href && (
            <div className="tw:flex tw:items-center tw:gap-2.5!">
              <span className="tw:w-7 tw:h-7 tw:rounded-lg tw:bg-primary/10 tw:flex tw:items-center tw:justify-center tw:shrink-0">
                <Globe className="tw:w-3.5 tw:h-3.5 tw:text-primary" />
              </span>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="tw:text-sm tw:text-gray-600! tw:hover:text-primary! tw:truncate"
              >
                {toDomain(airline.website)}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

AirlineCard.propTypes = {
  airline: PropTypes.shape({
    name: PropTypes.string,
    iata: PropTypes.string,
    terminal: PropTypes.string,
    website: PropTypes.string,
  }).isRequired,
};

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

  const [terminal, setTerminal] = useState("");
  const [airlineQuery, setAirlineQuery] = useState("");

  const sections = airport?.sections || [];
  const tips = airport?.tips || [];
  const baggage = airport?.baggage || {};
  // Memoised because the `|| []` fallback would otherwise hand the memos below
  // a brand-new array on every render, making them recompute every time.
  const airlines = useMemo(() => airport?.airlines || [], [airport?.airlines]);

  // Terminal chips come from the airport's own terminal list, falling back to
  // whatever terminals the airline rows actually mention — so the filter still
  // works on records saved before the terminals field existed.
  const terminals = useMemo(() => {
    const declared = (airport?.terminals || []).filter(Boolean);
    if (declared.length) return declared;
    return [...new Set(airlines.map((a) => a?.terminal).filter(Boolean))].sort();
  }, [airport?.terminals, airlines]);

  const visibleAirlines = useMemo(() => {
    const q = airlineQuery.trim().toLowerCase();
    return airlines.filter((airline) => {
      if (terminal && airline?.terminal !== terminal) return false;
      if (!q) return true;
      return (
        airline?.name?.toLowerCase().includes(q) ||
        airline?.iata?.toLowerCase().includes(q)
      );
    });
  }, [airlines, terminal, airlineQuery]);

  const hasBaggage = Boolean(
    baggage.summary || baggage.pdfUrl || (baggage.allowances || []).length,
  );

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="container tw:pt-28! tw:pb-20! tw:text-center!">
          <p className="tw:text-gray-500">Loading airport information…</p>
        </main>
        <Footer />
      </>
    );
  }

  // A missing airport must not be indexed — the same guard the visa and article
  // pages use for their not-found states.
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
  const title = `${airport.name}${code ? ` (${code})` : ""} — Terminals, Airlines & Baggage | FlyArzan`;
  const description =
    airport.introduction?.slice(0, 300) ||
    `${airport.name} airport guide: terminals, airlines, baggage rules and travel tips${
      locationLabel ? ` in ${locationLabel}` : ""
    }.`;

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
                  <MapPin className="tw:w-4 tw:h-4" />
                  {locationLabel}
                  {airport.flag && <span>{airport.flag}</span>}
                </p>
              )}
            </div>

            {/* Quick facts */}
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
              {airlines.length > 0 && (
                <div className="tw:bg-white/10 tw:rounded-xl tw:px-4! tw:py-3! tw:min-w-[104px]">
                  <p className="tw:text-xl tw:font-bold tw:text-white tw:m-0!">
                    {airlines.length}
                  </p>
                  <p className="tw:text-xs tw:text-white/60 tw:m-0!">Airlines</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sticky section nav — the page is long once baggage and airlines are
          filled in, so give readers a way to jump. */}
      <div className="tw:sticky tw:top-[72px] tw:z-40 tw:bg-white tw:border-b tw:border-gray-100 tw:shadow-sm">
        <div className="container tw:px-4! tw:sm:px-6!">
          <nav className="tw:flex tw:items-center tw:gap-6! tw:overflow-x-auto tw:scrollbar-hide">
            {(airport.introduction || sections.length > 0) && (
              <SectionLink href="#about">About</SectionLink>
            )}
            {hasBaggage && <SectionLink href="#baggage">Baggage</SectionLink>}
            {airlines.length > 0 && (
              <SectionLink href="#airlines">Airlines</SectionLink>
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

        {/* Baggage — deliberately the most prominent block on the page: tinted
            panel, accent bar and its own icon, so it reads as the answer to the
            question most travellers arrive with. */}
        {hasBaggage && (
          <section id="baggage" className="tw:scroll-mt-32! tw:mb-10!">
            <div className="tw:rounded-2xl tw:bg-primary/5 tw:border tw:border-primary/20 tw:border-l-4 tw:border-l-primary tw:p-6!">
              <div className="tw:flex tw:items-center tw:gap-3! tw:mb-4!">
                <span className="tw:w-10 tw:h-10 tw:rounded-xl tw:bg-primary! tw:flex tw:items-center tw:justify-center tw:shrink-0">
                  <Luggage className="tw:w-5 tw:h-5 tw:text-white" />
                </span>
                <div>
                  <h2 className="tw:text-lg tw:font-bold! tw:text-dark-purple tw:m-0!">
                    Baggage information
                  </h2>
                  <p className="tw:text-xs tw:text-gray-500 tw:m-0!">
                    Allowances and rules for {airport.name}
                  </p>
                </div>
              </div>

              {baggage.summary && (
                <p className="tw:text-base tw:text-gray-700 tw:leading-relaxed tw:mb-5! tw:max-w-3xl">
                  {baggage.summary}
                </p>
              )}

              {(baggage.allowances || []).length > 0 && (
                <div className="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-4! tw:mb-5!">
                  {baggage.allowances.map((item, i) => (
                    <div
                      key={i}
                      className="tw:bg-white tw:rounded-xl tw:border tw:border-primary/15 tw:p-4!"
                    >
                      {item.title && (
                        <h3 className="tw:text-sm tw:font-semibold! tw:text-dark-purple tw:mb-1.5!">
                          {item.title}
                        </h3>
                      )}
                      {item.content && (
                        <p className="tw:text-sm tw:text-gray-600 tw:leading-relaxed tw:m-0!">
                          {item.content}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* PDF guide — embedded viewer plus an explicit download, the same
                  pairing used for PDF articles on ArticlePage. */}
              {baggage.pdfUrl && (
                <div>
                  <div className="tw:flex tw:items-center tw:justify-between tw:gap-3! tw:flex-wrap tw:mb-3!">
                    <h3 className="tw:text-sm tw:font-semibold! tw:text-dark-purple tw:m-0!">
                      Baggage guide (PDF)
                    </h3>
                    <a
                      href={baggage.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="tw:inline-flex tw:items-center tw:gap-2! tw:h-10 tw:px-4! tw:rounded-lg tw:bg-primary! tw:text-white! tw:text-sm tw:font-medium tw:hover:opacity-90"
                    >
                      <Download className="tw:w-4 tw:h-4" />
                      Download PDF
                    </a>
                  </div>
                  <div className="tw:rounded-xl tw:overflow-hidden tw:border tw:border-primary/20 tw:bg-white">
                    <iframe
                      src={baggage.pdfUrl}
                      title={`${airport.name} baggage guide`}
                      className="tw:w-full! tw:h-[70vh]! tw:border-0!"
                    />
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Airlines at this airport */}
        {airlines.length > 0 && (
          <section id="airlines" className="tw:scroll-mt-32! tw:mb-10!">
            <div className="tw:bg-dark-purple tw:rounded-2xl tw:p-6! tw:mb-6!">
              <div className="tw:flex tw:items-center tw:gap-2! tw:mb-5!">
                <Building2 className="tw:w-5 tw:h-5 tw:text-white/70" />
                <h2 className="tw:text-lg tw:md:text-xl tw:font-bold! tw:text-white tw:m-0!">
                  Airlines at {code || airport.name}
                </h2>
              </div>

              <div className="tw:flex tw:items-end tw:justify-between tw:gap-6! tw:flex-wrap">
                {terminals.length > 0 && (
                  <div>
                    <p className="tw:text-xs tw:font-semibold tw:text-white/70 tw:mb-2!">
                      Choose terminal:
                    </p>
                    <div className="tw:flex tw:flex-wrap tw:gap-2!">
                      <button
                        onClick={() => setTerminal("")}
                        aria-current={terminal === "" ? "true" : undefined}
                        className={`tw:h-9 tw:px-3.5! tw:rounded-lg tw:text-sm tw:font-semibold tw:transition-colors ${
                          terminal === ""
                            ? "tw:bg-primary! tw:text-white!"
                            : "tw:bg-white! tw:text-dark-purple! tw:hover:bg-white/90!"
                        }`}
                      >
                        All
                      </button>
                      {terminals.map((t) => (
                        <button
                          key={t}
                          onClick={() => setTerminal(t)}
                          aria-current={terminal === t ? "true" : undefined}
                          className={`tw:h-9 tw:px-3.5! tw:rounded-lg tw:text-sm tw:font-semibold tw:transition-colors ${
                            terminal === t
                              ? "tw:bg-primary! tw:text-white!"
                              : "tw:bg-white! tw:text-dark-purple! tw:hover:bg-white/90!"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="tw:flex-1 tw:min-w-[220px] tw:max-w-sm">
                  <p className="tw:text-xs tw:font-semibold tw:text-white/70 tw:mb-2!">
                    Search airline:
                  </p>
                  <div className="tw:relative">
                    <Search className="tw:absolute tw:left-3.5 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-gray-400" />
                    <input
                      type="search"
                      value={airlineQuery}
                      onChange={(e) => setAirlineQuery(e.target.value)}
                      placeholder="Search airline name"
                      aria-label="Search airlines at this airport"
                      className="tw:w-full tw:h-9 tw:pl-10! tw:pr-3! tw:rounded-lg tw:bg-white tw:text-gray-900 tw:text-sm tw:outline-none tw:border tw:border-transparent tw:focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {visibleAirlines.length === 0 ? (
              <p className="tw:text-sm tw:text-gray-500 tw:text-center! tw:py-10!">
                No airlines match this filter.
              </p>
            ) : (
              <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:lg:grid-cols-3 tw:gap-4!">
                {visibleAirlines.map((airline, i) => (
                  <AirlineCard key={`${airline.iata || airline.name}-${i}`} airline={airline} />
                ))}
              </div>
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
              {
                to: "/travel-guides/baggage-information",
                icon: Luggage,
                label: "Baggage information",
              },
              {
                to: "/travel-guides/airport-guides",
                icon: Building2,
                label: "Airport guides",
              },
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
