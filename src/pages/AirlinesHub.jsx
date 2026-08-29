import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import PropTypes from "prop-types";
import {
  Search,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Plane,
  X,
} from "lucide-react";
import Header from "../header-footer/Header";
import Footer from "../header-footer/Footer";
import AirlineLogo from "@/components/ui/airline-logo";
import { usePublicAirlines, useAirlineDirectoryMeta } from "../hooks/useCms";

const PAGE_URL = "https://flyarzan.com/Airlines";
const OG_IMAGE =
  "https://flyarzan.com/Pics/Airline%20wing/Air%20line%20wings%2011.jpg";
const PAGE_TITLE = "Airline Directory — Airlines Worldwide | FlyArzan";
const PAGE_DESCRIPTION =
  "Browse airlines worldwide. Find carrier details, baggage rules, contact websites and the destinations they serve. Search by airline name, IATA or ICAO code.";

// Airlines shown per page on the directory grid.
const PER_PAGE = 12;
// Cap on the crawlable index below the grid (matches the backend's limit clamp).
const INDEX_LIMIT = 100;

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const airlineRowShape = PropTypes.shape({
  name: PropTypes.string,
  iata: PropTypes.string,
  icao: PropTypes.string,
  website: PropTypes.string,
  country: PropTypes.string,
  countryCode: PropTypes.string,
  flag: PropTypes.string,
});

const AirlineCard = ({ airline }) => (
  <Link
    to={`/Airlines/${encodeURIComponent(String(airline.iata || "").toUpperCase())}`}
    className="tw:flex tw:flex-col tw:bg-white tw:rounded-2xl tw:overflow-hidden tw:border tw:border-gray-100 tw:shadow-sm tw:hover:shadow-md tw:hover:border-primary/40 tw:transition-all tw:group"
  >
    {/* Logo plate — logos are 905 committed PNGs keyed by 2-letter IATA code. */}
    <div className="tw:h-28 tw:flex tw:items-center tw:justify-center tw:px-6! tw:border-b tw:border-gray-100 tw:overflow-hidden">
      <AirlineLogo
        code={airline.iata}
        name={airline.name}
        fallback="plane"
        className="tw:w-[150px] tw:h-auto tw:shrink-0"
        fallbackClassName="tw:w-full tw:h-16"
      />
    </div>
    <div className="tw:p-4! tw:pt-3!">
      <p className="tw:font-semibold tw:text-dark-purple tw:text-base tw:group-hover:text-primary tw:transition-colors tw:truncate">
        {airline.name || airline.iata}
      </p>
      {airline.iata && (
        <p className="tw:text-sm tw:text-gray-400 tw:mt-0.5! tw:mb-1!">
          {airline.iata.toUpperCase()}
        </p>
      )}
      <p className="tw:text-sm tw:text-gray-500 tw:truncate">
        {airline.country
          ? `${airline.country}${airline.countryCode ? ` (${airline.countryCode})` : ""}`
          : airline.countryCode || ""}
      </p>
    </div>
    <div className="tw:mt-auto tw:p-3! tw:pt-0! tw:flex tw:items-center tw:justify-end">
      <ArrowRight className="tw:w-4 tw:h-4 tw:text-gray-300 tw:group-hover:text-primary tw:transition-colors tw:flex-shrink-0" />
    </div>
  </Link>
);

AirlineCard.propTypes = {
  airline: airlineRowShape.isRequired,
};

// Single numbered page button for the directory pagination.
const PageButton = ({ n, active, onClick }) => (
  <button
    onClick={() => onClick(n)}
    aria-current={active ? "page" : undefined}
    className={`tw:h-9 tw:min-w-9 tw:px-2! tw:rounded-lg tw:text-sm tw:font-medium tw:transition-colors ${
      active
        ? "tw:bg-primary! tw:text-white!"
        : "tw:border tw:border-gray-200 tw:text-gray-600 tw:hover:border-primary tw:hover:text-primary"
    }`}
  >
    {n + 1}
  </button>
);

PageButton.propTypes = {
  n: PropTypes.number.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

const AirlinesHub = () => {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState(""); // debounced term sent to the server
  const [letter, setLetter] = useState("");
  const [page, setPage] = useState(0);

  const { data: meta } = useAirlineDirectoryMeta();

  // Debounce the search box into the server query (300ms) and reset to page 1.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isFetching, isError } = usePublicAirlines({
    search,
    letter,
    page,
    limit: PER_PAGE,
  });

  // Full catalogue (no search, no letter) for the crawlable index below the
  // grid. The paginated grid hides later-page airlines from crawlers; this
  // guarantees every airline page is internally linked from the hub, so none
  // become orphan pages — the same guard the airport and visa hubs use.
  const { data: allData } = usePublicAirlines({ page: 0, limit: INDEX_LIMIT });

  const airlines = data?.airlines || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / PER_PAGE);
  const allAirlines = allData?.airlines || [];
  const allTotal = allData?.total || 0;

  const counts = meta?.counts || {};
  const heroTitle = meta?.hero?.title || meta?.title || "Airlines";
  const heroSubtitle = meta?.hero?.subtitle || PAGE_DESCRIPTION;

  const pageWindow = useMemo(() => {
    const window = [];
    for (
      let i = Math.max(0, page - 2);
      i <= Math.min(totalPages - 1, page + 2);
      i += 1
    ) {
      window.push(i);
    }
    return window;
  }, [page, totalPages]);

  // Picking a letter and typing a search are alternative ways to narrow the
  // same list, so each one clears the other rather than silently compounding.
  const selectLetter = (next) => {
    setLetter(next);
    setSearchInput("");
    setSearch("");
    setPage(0);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(0);
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://flyarzan.com/",
      },
      { "@type": "ListItem", position: 2, name: "Airlines", item: PAGE_URL },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
  };

  // First paint waits on the directory meta (title/hero/A-Z counts); show a
  // skeleton until it arrives rather than the empty-state copy.
  if (!meta) {
    return (
      <>
        <Helmet>
          <title>{PAGE_TITLE}</title>
          <meta name="robots" content="index, follow" />
        </Helmet>
        <Header />
        <section className="tw:bg-dark-purple tw:text-white tw:pt-24! tw:md:pt-28! tw:pb-10! tw:px-4! tw:sm:px-6!">
          <div className="container">
            <nav className="tw:flex tw:items-center tw:gap-1.5! tw:text-sm tw:text-white/60 tw:mb-5!">
              <Link to="/" className="tw:hover:text-white">
                Home
              </Link>
              <ChevronRight className="tw:w-3.5 tw:h-3.5" />
              <span className="tw:text-white tw:font-medium">Airlines</span>
            </nav>
            <div className="tw:h-9 tw:bg-white/20 tw:rounded-lg tw:mb-3! tw:w-3/4 tw:animate-pulse" />
            <div className="tw:h-5 tw:bg-white/10 tw:rounded tw:mb-7! tw:w-1/2 tw:animate-pulse" />
            <div className="tw:h-12 tw:bg-white tw:rounded-xl tw:mb-8! tw:animate-pulse" />
            <div className="tw:flex tw:flex-wrap tw:gap-1.5! tw:mb-8!">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="tw:h-9 tw:w-9 tw:bg-gray-200 tw:rounded-lg tw:animate-pulse"
                />
              ))}
            </div>
          </div>
        </section>
        <main className="container tw:py-10! tw:px-4! tw:sm:px-6! tw:animate-pulse">
          <div className="tw:h-6 tw:bg-gray-200 tw:rounded tw:mb-5! tw:w-1/4" />
          <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:lg:grid-cols-3 tw:gap-4!">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="tw:h-44 tw:bg-gray-200 tw:rounded-2xl tw:animate-pulse"
              />
            ))}
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE} />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(collectionSchema)}
        </script>
      </Helmet>

      <Header />

      {/* Hero — deep navy panel per the airport-directory reference. Top
          padding clears the fixed header. */}
      <section className="tw:bg-dark-purple tw:text-white tw:pt-24! tw:md:pt-28! tw:pb-10! tw:px-4! tw:sm:px-6!">
        <div className="container">
          <nav className="tw:flex tw:items-center tw:gap-1.5! tw:text-sm tw:text-white/60 tw:mb-5!">
            <Link to="/" className="tw:hover:text-white tw:transition-colors">
              Home
            </Link>
            <ChevronRight className="tw:w-3.5 tw:h-3.5" />
            <span className="tw:text-white tw:font-medium">Airlines</span>
          </nav>

          <h1 className="tw:text-2xl tw:md:text-4xl tw:font-bold! tw:text-white tw:mb-3! tw:leading-tight">
            {heroTitle}
          </h1>
          <p className="tw:text-white/70 tw:text-sm tw:md:text-base tw:mb-7! tw:max-w-2xl tw:leading-relaxed">
            {heroSubtitle}
          </p>

          <div className="tw:relative tw:max-w-xl">
            <Search className="tw:absolute tw:left-4 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-gray-400" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search airline name, IATA or ICAO code…"
              aria-label="Search airlines"
              className="tw:w-full tw:h-12 tw:pl-11! tw:pr-10! tw:rounded-xl tw:bg-white tw:text-gray-900! tw:text-sm tw:outline-none tw:border tw:border-transparent tw:focus:border-primary tw:shadow-lg"
            />
            {searchInput && (
              <button
                onClick={clearSearch}
                aria-label="Clear search"
                className="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:text-gray-400! tw:hover:text-gray-600!"
              >
                <X className="tw:w-4 tw:h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      <main className="container tw:py-10! tw:px-4! tw:sm:px-6!">
        {/* A–Z rail — letters with no airlines render disabled rather than
            leading to an empty page. */}
        <nav
          className="tw:flex tw:flex-wrap tw:gap-1.5! tw:mb-8!"
          aria-label="Browse airlines alphabetically"
        >
          <button
            onClick={() => selectLetter("")}
            aria-current={letter === "" ? "true" : undefined}
            className={`tw:h-9 tw:px-3! tw:rounded-lg tw:text-sm tw:font-medium tw:transition-colors ${
              letter === ""
                ? "tw:bg-primary! tw:text-white!"
                : "tw:border tw:border-gray-200 tw:text-gray-600 tw:hover:border-primary tw:hover:text-primary"
            }`}
          >
            All
          </button>
          {LETTERS.map((l) => {
            const count = counts[l] || 0;
            const active = letter === l;
            return (
              <button
                key={l}
                onClick={() => selectLetter(l)}
                disabled={count === 0}
                aria-current={active ? "true" : undefined}
                title={
                  count
                    ? `${count} airline${count === 1 ? "" : "s"}`
                    : "No airlines"
                }
                className={`tw:h-9 tw:min-w-9 tw:rounded-lg tw:text-sm tw:font-medium tw:transition-colors tw:disabled:opacity-30 tw:disabled:cursor-not-allowed ${
                  active
                    ? "tw:bg-primary! tw:text-white!"
                    : "tw:border tw:border-gray-200 tw:text-gray-600 tw:hover:border-primary tw:hover:text-primary tw:disabled:hover:border-gray-200 tw:disabled:hover:text-gray-600"
                }`}
              >
                {l}
              </button>
            );
          })}
        </nav>

        {/* Heading row */}
        <div className="tw:flex tw:items-center tw:justify-between tw:flex-wrap tw:gap-3! tw:mb-5!">
          <h2 className="tw:text-lg tw:font-bold! tw:text-dark-purple tw:m-0!">
            {search
              ? `Results for "${search}"`
              : letter
                ? `Airlines starting with ${letter}`
                : "All Airlines"}
            {total > 0 && (
              <span className="tw:text-sm tw:font-normal tw:text-gray-400 tw:ml-2!">
                ({total})
              </span>
            )}
          </h2>
          {(search || letter) && (
            <button
              onClick={() => selectLetter("")}
              className="tw:text-sm tw:text-primary! tw:hover:underline!"
            >
              Clear filters
            </button>
          )}
        </div>

        {isError ? (
          <div className="tw:text-center tw:py-16!">
            <p className="tw:text-gray-500">
              Airline information is unavailable right now. Please try again
              later.
            </p>
          </div>
        ) : isFetching && airlines.length === 0 ? (
          <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:lg:grid-cols-3 tw:gap-4!">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="tw:h-44 tw:bg-gray-200 tw:rounded-2xl tw:animate-pulse"
              />
            ))}
          </div>
        ) : airlines.length === 0 ? (
          <div className="tw:text-center tw:py-16!">
            <Plane className="tw:w-10 tw:h-10 tw:text-gray-300 tw:mx-auto! tw:mb-3!" />
            <p className="tw:text-base tw:font-semibold tw:text-dark-purple tw:mb-1!">
              {search || letter
                ? "No airlines found"
                : "No airlines available yet"}
            </p>
            <p className="tw:text-sm tw:text-gray-500">
              {search || letter
                ? "Try a different airline name, IATA or ICAO code."
                : "Airline guides are being added — check back soon."}
            </p>
          </div>
        ) : (
          <>
            <div
              className={`tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:lg:grid-cols-3 tw:gap-4! tw:transition-opacity ${
                isFetching ? "tw:opacity-60" : "tw:opacity-100"
              }`}
            >
              {airlines.map((airline) => (
                <AirlineCard
                  key={airline.iata || airline.name}
                  airline={airline}
                />
              ))}
            </div>

            {/* Server-driven pagination */}
            {totalPages > 1 && (
              <nav
                className="tw:flex tw:items-center tw:justify-center tw:gap-1.5! tw:mt-10!"
                aria-label="Pagination"
              >
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                  className="tw:h-9 tw:px-3! tw:flex tw:items-center tw:gap-1! tw:rounded-lg tw:border tw:border-gray-200 tw:text-sm tw:text-gray-600! tw:hover:border-primary tw:hover:text-primary tw:transition-colors tw:disabled:opacity-40 tw:disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="tw:w-4 tw:h-4" />
                  <span className="tw:hidden tw:sm:inline">Prev</span>
                </button>

                {pageWindow[0] > 0 && (
                  <>
                    <PageButton n={0} active={page === 0} onClick={setPage} />
                    {pageWindow[0] > 1 && (
                      <span className="tw:px-1! tw:text-gray-400">…</span>
                    )}
                  </>
                )}

                {pageWindow.map((n) => (
                  <PageButton
                    key={n}
                    n={n}
                    active={n === page}
                    onClick={setPage}
                  />
                ))}

                {pageWindow[pageWindow.length - 1] < totalPages - 1 && (
                  <>
                    {pageWindow[pageWindow.length - 1] < totalPages - 2 && (
                      <span className="tw:px-1! tw:text-gray-400">…</span>
                    )}
                    <PageButton
                      n={totalPages - 1}
                      active={page === totalPages - 1}
                      onClick={setPage}
                    />
                  </>
                )}

                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="tw:h-9 tw:px-3! tw:flex tw:items-center tw:gap-1! tw:rounded-lg tw:border tw:border-gray-200 tw:text-sm tw:text-gray-600! tw:hover:border-primary tw:hover:text-primary tw:transition-colors tw:disabled:opacity-40 tw:disabled:cursor-not-allowed"
                  aria-label="Next page"
                >
                  <span className="tw:hidden tw:sm:inline">Next</span>
                  <ChevronRight className="tw:w-4 tw:h-4" />
                </button>
              </nav>
            )}
          </>
        )}

        {/* All airlines — always-rendered, crawlable index so every airline page
            is internally linked from the hub regardless of the grid's paging. */}
        {allAirlines.length > 0 && allTotal > PER_PAGE && (
          <section className="tw:mt-14! tw:pt-10! tw:border-t tw:border-gray-100">
            <h2 className="tw:text-lg tw:font-bold! tw:text-dark-purple tw:mb-2!">
              All Airlines
            </h2>
            <p className="tw:text-sm tw:text-gray-400 tw:mb-5!">
              Browse every airline we cover.
            </p>
            <ul className="tw:grid tw:grid-cols-2 tw:sm:grid-cols-3 tw:lg:grid-cols-4 tw:gap-x-6! tw:gap-y-2.5!">
              {allAirlines.map((airline) => (
                <li key={airline.iata || airline.name}>
                  <Link
                    to={`/Airlines/${encodeURIComponent(String(airline.iata || "").toUpperCase())}`}
                    className="tw:text-sm tw:text-gray-600! tw:hover:text-primary! tw:transition-colors"
                  >
                    {airline.name}
                    {airline.iata && ` (${airline.iata.toUpperCase()})`}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
};

export default AirlinesHub;
