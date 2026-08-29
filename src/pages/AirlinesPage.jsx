import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import PropTypes from "prop-types";
import {
  ChevronRight,
  Globe,
  Info,
  Luggage,
  Download,
  Plane,
} from "lucide-react";
import Header from "../header-footer/Header";
import Footer from "../header-footer/Footer";
import AirlineLogo from "@/components/ui/airline-logo";
import { getFlagEmoji } from "@/lib/flight-utils";
import { usePublicAirline } from "../hooks/useCms";

const SITE = "https://flyarzan.com";
const OG_IMAGE =
  "https://flyarzan.com/Pics/Airline%20wing/Air%20line%20wings%2011.jpg";

/** Normalise a website value into something safe to put in href. */
const toHref = (website) => {
  const value = String(website || "").trim();
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
};

/** Strip the scheme so the card shows "emirates.com", as on the flight cards. */
const toDomain = (website) =>
  String(website || "")
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/$/, "");

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

const AirlinesPage = () => {
  const { iata } = useParams();
  const code = String(iata || "").toUpperCase();

  const { data: airline, isLoading, isError } = usePublicAirline(code);

  const sections = airline?.sections || [];
  const tips = airline?.tips || [];
  const baggage = airline?.baggage || {};
  const hasBaggage = Boolean(
    baggage.summary || baggage.pdfUrl || (baggage.allowances || []).length,
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

  // A missing airline must not be indexed — the same guard the airport, visa and
  // article pages use for their not-found states.
  if (isError || !airline) {
    return (
      <>
        <Helmet>
          <title>Airline not found | FlyArzan</title>
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <Header />
        <main className="container tw:pt-28! tw:pb-20! tw:text-center!">
          <Plane className="tw:w-10 tw:h-10 tw:text-gray-300 tw:mx-auto! tw:mb-3!" />
          <h1 className="tw:text-xl tw:font-bold! tw:text-dark-purple tw:mb-2!">
            Airline not found
          </h1>
          <p className="tw:text-sm tw:text-gray-500 tw:mb-6!">
            We don&apos;t have a guide for &ldquo;{code}&rdquo; yet.
          </p>
          <Link
            to="/Airlines"
            className="tw:inline-flex tw:items-center tw:gap-2! tw:h-10 tw:px-4! tw:rounded-lg tw:bg-primary! tw:text-white! tw:text-sm tw:font-medium"
          >
            Browse all airlines
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const pageUrl = `${SITE}/Airlines/${code}`;
  const locationLabel = [airline.country, code ? `(${code})` : ""]
    .filter(Boolean)
    .join(" ");
  const title = `${airline.name}${code ? ` (${code})` : ""} — Baggage & Travel Information | FlyArzan`;
  const description =
    (airline.summary || airline.introduction || "").slice(0, 300) ||
    `${airline.name} airline guide: baggage rules, flight information and contact details${locationLabel ? ` for ${locationLabel}` : ""}.`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Airlines", item: `${SITE}/Airlines` },
      { "@type": "ListItem", position: 3, name: airline.name, item: pageUrl },
    ],
  };

  const airlineSchema = {
    "@context": "https://schema.org",
    "@type": "Airline",
    name: airline.name,
    iataCode: code || undefined,
    url: pageUrl,
    address: {
      "@type": "PostalAddress",
      addressCountry: airline.country || undefined,
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
          {JSON.stringify(airlineSchema)}
        </script>
      </Helmet>

      <Header />

      {/* Hero */}
      <section className="tw:bg-dark-purple tw:text-white tw:pt-24! tw:md:pt-28! tw:pb-10! tw:px-4! tw:sm:px-6!">
        <div className="container tw:flex tw:items-start tw:gap-6! tw:flex-wrap">
          <div className="tw:flex-1 tw:min-w-[240px]">
            <nav className="tw:flex tw:items-center tw:gap-1.5! tw:text-sm tw:text-white/60 tw:mb-5!">
              <Link to="/" className="tw:hover:text-white tw:transition-colors">
                Home
              </Link>
              <ChevronRight className="tw:w-3.5 tw:h-3.5" />
              <Link to="/Airlines" className="tw:hover:text-white tw:transition-colors">
                Airlines
              </Link>
              <ChevronRight className="tw:w-3.5 tw:h-3.5" />
              <span className="tw:text-white tw:font-medium">{airline.name}</span>
            </nav>

            <div className="tw:flex tw:items-center tw:gap-5! tw:flex-wrap tw:mb-4!">
              <div className="tw:w-48 tw:h-28 tw:flex tw:items-center tw:justify-center tw:shrink-0">
                <AirlineLogo
                  code={airline.iata}
                  name={airline.name}
                  fallback="plane"
                  className="tw:max-w-full tw:max-h-full tw:h-auto tw:shrink-0"
                  fallbackClassName="tw:w-20 tw:h-10"
                />
              </div>
              <div className="tw:flex-1 tw:min-w-[180px]">
                <h1 className="tw:text-2xl tw:md:text-4xl tw:font-bold! tw:text-white tw:m-0! tw:leading-tight">
                  {airline.name}
                </h1>
                <div className="tw:flex tw:items-center tw:gap-2.5! tw:mt-2.5! tw:flex-wrap">
                  {code && (
                    <span className="tw:text-sm tw:font-bold tw:px-2.5! tw:py-1! tw:rounded-lg tw:bg-primary! tw:text-white! tw:tracking-wide">
                      {code}
                    </span>
                  )}
                  {airline.icao && (
                    <span className="tw:text-xs tw:font-medium tw:text-white/60">
                      ICAO: {airline.icao.toUpperCase()}
                    </span>
                  )}
                </div>
                {(airline.country || airline.countryCode) && (
                  <p className="tw:text-white/70 tw:text-sm tw:mt-2! tw:flex tw:items-center tw:gap-2!">
                    {airline.flag || getFlagEmoji(airline.countryCode)}
                    {airline.country || ""}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Quick facts — IATA / ICAO / Country, mirroring the airport hero. */}
          <div className="tw:flex tw:gap-3! tw:flex-wrap tw:self-start tw:mt-[28px]!">
            {code && (
              <div className="tw:bg-white/10 tw:rounded-xl tw:px-4! tw:py-3! tw:min-w-[104px]">
                <p className="tw:text-xl tw:font-bold tw:text-white tw:m-0!">
                  {code}
                </p>
                <p className="tw:text-xs tw:text-white/60 tw:m-0!">IATA</p>
              </div>
            )}
            {airline.icao && (
              <div className="tw:bg-white/10 tw:rounded-xl tw:px-4! tw:py-3! tw:min-w-[104px]">
                <p className="tw:text-xl tw:font-bold tw:text-white tw:m-0!">
                  {airline.icao.toUpperCase()}
                </p>
                <p className="tw:text-xs tw:text-white/60 tw:m-0!">ICAO</p>
              </div>
            )}
            {(airline.country || airline.countryCode) && (
              <div className="tw:bg-white/10 tw:rounded-xl tw:px-4! tw:py-3! tw:min-w-[104px]">
                <p className="tw:text-xl tw:font-bold tw:text-white tw:m-0!">
                  {airline.country || airline.countryCode}
                </p>
                <p className="tw:text-xs tw:text-white/60 tw:m-0!">Country</p>
              </div>
            )}
            {airline.website && (
              <div className="tw:bg-white/10 tw:rounded-xl tw:px-4! tw:py-3! tw:min-w-[104px] tw:flex tw:items-center">
                <Globe className="tw:w-4 tw:h-4 tw:text-white/60" />
                <a
                  href={toHref(airline.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tw:ml-2! tw:text-sm tw:text-white! tw:hover:text-primary! tw:transition-colors tw:truncate"
                  title={airline.website}
                >
                  {toDomain(airline.website)}
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sticky section nav — the page is long once the baggage panel is filled
          in, so give readers a way to jump. */}
      <div className="tw:sticky tw:top-[72px] tw:z-40 tw:bg-white tw:border-b tw:border-gray-100 tw:shadow-sm">
        <div className="container tw:px-4! tw:sm:px-6!">
          <nav className="tw:flex tw:items-center tw:gap-6! tw:overflow-x-auto tw:scrollbar-hide">
            {(airline.summary || airline.introduction || sections.length > 0) && (
              <SectionLink href="#about">About</SectionLink>
            )}
            {hasBaggage && <SectionLink href="#baggage">Baggage</SectionLink>}
            {tips.length > 0 && <SectionLink href="#tips">Travel tips</SectionLink>}
          </nav>
        </div>
      </div>

      <main className="container tw:py-10! tw:px-4! tw:sm:px-6!">
        {/* About */}
        {(airline.summary || airline.introduction || sections.length > 0) && (
          <section id="about" className="tw:scroll-mt-32! tw:mb-10!">
            {(airline.summary || airline.introduction) && (
              <p className="tw:text-base tw:text-gray-600 tw:leading-relaxed tw:mb-6! tw:max-w-3xl">
                {airline.summary || airline.introduction}
              </p>
            )}

            {sections.length > 0 && (
              <>
                <div className="tw:flex tw:items-center tw:gap-2! tw:mb-4!">
                  <Info className="tw:w-5 tw:h-5 tw:text-primary" />
                  <h2 className="tw:text-lg tw:font-bold! tw:text-dark-purple tw:m-0!">
                    Airline information
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

        {/* Baggage — the most-read block on an airline page: tinted panel,
            accent bar and its own icon, with the inline PDF viewer plus an
            explicit download (same pairing used on PDF articles). This content
            lives on the airline record, decoupled from airports. */}
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
                    Allowances and rules for {airline.name}
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
                      title={`${airline.name} baggage guide`}
                      className="tw:w-full! tw:h-[70vh]! tw:border-0!"
                    />
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Travel tips */}
        {tips.length > 0 && (
          <section id="tips" className="tw:scroll-mt-32! tw:mb-10!">
            <div className="tw:flex tw:items-center tw:gap-2! tw:mb-4!">
              <Luggage className="tw:w-5 tw:h-5 tw:text-primary" />
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
              { to: "/Airlines", icon: Plane, label: "All airlines" },
              {
                to: "/Airport",
                icon: "building",
                label: "Airport guides",
              },
              {
                to: "/travel-guides/baggage-information",
                icon: Luggage,
                label: "Baggage information",
              },
            ].map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className="tw:inline-flex tw:items-center tw:gap-2! tw:h-10 tw:px-4! tw:rounded-lg tw:border tw:border-gray-200 tw:text-sm tw:text-gray-600! tw:hover:border-primary tw:hover:text-primary! tw:transition-colors"
              >
                {typeof Icon === "string" ? (
                  <Info className="tw:w-4 tw:h-4" />
                ) : (
                  <Icon className="tw:w-4 tw:h-4" />
                )}
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

export default AirlinesPage;
