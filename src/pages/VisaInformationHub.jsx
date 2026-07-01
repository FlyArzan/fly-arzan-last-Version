import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Search,
  ArrowRight,
  Globe,
  Info,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
} from "lucide-react";
import Header from "../header-footer/Header";
import Footer from "../header-footer/Footer";
import { useVisaCountries } from "../hooks/useVisa";

// Two-letter country code shown when a country has no flag image. Clean,
// informative and on-brand — no emoji fallback.
const FlagBadge = ({ country, size = "tw:w-12 tw:h-12" }) => {
  if (country.flagImage) {
    return (
      <img
        src={country.flagImage}
        alt={`${country.countryName} flag`}
        width="48"
        height="48"
        loading="lazy"
        className={`${size} tw:object-cover tw:rounded-lg`}
      />
    );
  }
  return (
    <div
      className={`${size} tw:rounded-lg tw:bg-primary/10 tw:text-dark-purple tw:flex tw:items-center tw:justify-center tw:font-bold tw:text-sm`}
    >
      {(country.countryCode || "??").toUpperCase().slice(0, 2)}
    </div>
  );
};

const VISA_STATUS_LABELS = {
  yes: { label: "Visa Required", color: "tw:bg-red-50 tw:text-red-700" },
  no: { label: "Visa Free", color: "tw:bg-green-50 tw:text-green-700" },
  depends: {
    label: "Depends on Nationality",
    color: "tw:bg-amber-50 tw:text-amber-700",
  },
  check: {
    label: "Check Requirements",
    color: "tw:bg-gray-100 tw:text-gray-600",
  },
};

const CountryCard = ({ country }) => {
  const status =
    VISA_STATUS_LABELS[country.visaRequired] || VISA_STATUS_LABELS.check;

  return (
    <Link
      to={`/visa-information/${country.countrySlug}`}
      className="tw:flex tw:items-center tw:gap-4! tw:bg-white tw:rounded-2xl tw:p-4! tw:border tw:border-gray-100 tw:shadow-sm tw:hover:shadow-md tw:hover:border-primary/40 tw:transition-all tw:group"
    >
      <div className="tw:flex-shrink-0">
        <FlagBadge country={country} />
      </div>
      <div className="tw:flex-1 tw:min-w-0">
        <p className="tw:font-semibold tw:text-dark-purple tw:text-base tw:group-hover:text-primary tw:transition-colors">
          {country.countryName}
        </p>
        <div className="tw:flex tw:items-center tw:flex-wrap tw:gap-1.5! tw:mt-1.5!">
          <span
            className={`tw:text-xs tw:px-2! tw:py-0.5! tw:rounded-full tw:font-medium ${status.color}`}
          >
            {status.label}
          </span>
          {country.eVisaAvailable === "yes" && (
            <span className="tw:text-xs tw:px-2! tw:py-0.5! tw:rounded-full tw:bg-primary/10 tw:text-dark-purple tw:font-medium">
              eVisa
            </span>
          )}
        </div>
      </div>
      <ArrowRight className="tw:w-4 tw:h-4 tw:text-gray-300 tw:group-hover:text-primary tw:transition-colors tw:flex-shrink-0" />
    </Link>
  );
};

// Single numbered page button for the destinations pagination.
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

const PAGE_DESCRIPTION =
  "Search visa requirements, passport rules, eVisa options, visa on arrival, required documents and official government links before you travel.";

const TRAVEL_PURPOSES = ["Tourism", "Business", "Transit", "Study", "Work"];
const STAY_LENGTHS = [
  "Up to 30 days",
  "30–90 days",
  "90–180 days",
  "More than 180 days",
];

// Countries shown per page on the destinations grid.
const PER_PAGE = 12;

const VisaInformationHub = () => {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState(""); // debounced term sent to the server
  const [nationality, setNationality] = useState("");
  const [purpose, setPurpose] = useState("");
  const [stay, setStay] = useState("");
  const [page, setPage] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false); // mobile filter accordion
  const navigate = useNavigate();

  // Debounce the search box into the server query (300ms). Reset to page 1
  // whenever the term changes so results always start from the top.
  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(0);
    }, 300);
    return () => clearTimeout(id);
  }, [searchInput]);

  // Server-driven pagination + search — the client only consumes what the API
  // returns for the requested page.
  const { data, isLoading, isFetching } = useVisaCountries({
    search,
    page,
    limit: PER_PAGE,
  });
  const countries = data?.countries || [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  // Full published catalogue (no search / no pagination) used only to render the
  // crawlable "All Destinations" index below. The paginated grid above hides
  // later-page countries from crawlers; this guarantees every country page is
  // internally linked from the hub so none become orphan pages. Backend caps
  // limit at 100 — revisit with a slim dedicated endpoint if the catalogue
  // ever grows beyond that (the XML sitemap remains the complete backstop).
  const { data: allData } = useVisaCountries({ page: 0, limit: 100 });
  const allCountries = allData?.countries || [];
  const allTotal = allData?.total ?? 0;

  const pageWindow = [];
  for (
    let i = Math.max(0, page - 2);
    i <= Math.min(totalPages - 1, page + 2);
    i++
  ) {
    pageWindow.push(i);
  }

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchInput.trim();
    if (q.length === 0) return;

    // If the typed country exactly matches one already returned for this term,
    // jump straight to its page — carrying the guided-search context as params.
    const exact = countries.find(
      (c) => c.countryName.toLowerCase() === q.toLowerCase(),
    );
    if (exact) {
      const params = new URLSearchParams();
      if (nationality.trim()) params.set("nationality", nationality.trim());
      if (purpose) params.set("purpose", purpose);
      if (stay) params.set("stay", stay);
      const qs = params.toString();
      navigate(`/visa-information/${exact.countrySlug}${qs ? `?${qs}` : ""}`);
      return;
    }

    // Otherwise apply the search immediately (skip the debounce) and reset.
    setSearch(q);
    setPage(0);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(0);
  };

  const PAGE_URL = "https://flyarzan.com/visa-information";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://flyarzan.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Visa Information",
        item: PAGE_URL,
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Visa Information & Travel Requirements",
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
  };

  // White fields with clearly-visible borders for easy separation, dark text.
  const fieldClass =
    "tw:w-full tw:h-12! tw:px-4! tw:rounded-xl tw:bg-white! tw:text-gray-900! tw:text-sm tw:border tw:border-gray-300 tw:outline-none tw:transition tw:focus:border-primary tw:focus:ring-2 tw:focus:ring-primary/20 tw:placeholder:text-gray-500";
  const selectBase = `${fieldClass} tw:appearance-none tw:bg-no-repeat tw:pr-9! tw:cursor-pointer`;
  // Inline chevron + explicit text colour (grey when empty) so the legacy
  // cascade can't hide the native select text.
  const selectStyle = (val) => ({
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
    backgroundPosition: "right 0.75rem center",
    backgroundColor: "#ffffff",
    color: val ? "#111827" : "#6b7280",
  });
  const textInputStyle = { color: "#111827", backgroundColor: "#ffffff" };

  return (
    <>
      <Helmet>
        <title>Visa Information & Travel Requirements | FlyArzan</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Visa Information & Travel Requirements | FlyArzan"
        />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(collectionSchema)}
        </script>
      </Helmet>

      <Header />

      {/* Hero — soft brand banner (cyan→teal); top padding clears the fixed header */}
      <section className="tw:bg-gradient-to-br tw:from-[#3194c4] tw:to-[#1c6993] tw:text-white tw:pt-24! tw:md:pt-28! tw:pb-12! tw:px-4! tw:sm:px-6!">
        <div className="tw:max-w-6xl tw:mx-auto! tw:text-center!">
          <nav className="tw:flex tw:items-center tw:justify-center tw:gap-1! tw:text-xs tw:text-white/70 tw:mb-5!">
            <Link to="/" className="tw:hover:text-white tw:transition-colors">
              Home
            </Link>
            <ChevronRight className="tw:w-3 tw:h-3" />
            <span className="tw:text-white tw:font-medium">Visa Information</span>
          </nav>
          <h1 className="tw:text-2xl tw:md:text-4xl tw:font-bold! tw:text-white tw:mb-4! tw:leading-tight tw:text-center!">
            Visa Information &amp; Travel Requirements
          </h1>
          <p className="tw:text-white/80 tw:text-sm tw:md:text-base tw:mb-7! tw:max-w-2xl tw:mx-auto! tw:leading-relaxed tw:text-center!">
            {PAGE_DESCRIPTION}
          </p>

          <form
            onSubmit={handleSearch}
            className="tw:max-w-5xl tw:mx-auto! tw:bg-white tw:rounded-2xl tw:p-3! tw:sm:p-4! tw:shadow-xl tw:text-left"
          >
            <datalist id="visa-country-options">
              {countries.map((c) => (
                <option key={c.id} value={c.countryName} />
              ))}
            </datalist>

            {/* Desktop — destination + all three filters on one line; the
                magnifier inside the field submits, and Enter triggers search */}
            <div className="tw:hidden tw:sm:flex tw:flex-wrap tw:gap-3! tw:items-stretch">
              <div className="tw:relative tw:flex-1 tw:min-w-[220px]">
                <button
                  type="submit"
                  aria-label="Search"
                  className="tw:absolute tw:left-3.5 tw:top-1/2 tw:-translate-y-1/2 tw:text-gray-400! tw:hover:text-primary!"
                >
                  <Search className="tw:w-4 tw:h-4" />
                </button>
                <input
                  type="text"
                  list="visa-country-options"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Enter destination country…"
                  style={textInputStyle}
                  className={`${fieldClass} tw:pl-10!`}
                />
              </div>
              <input
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                placeholder="Passport nationality"
                style={textInputStyle}
                className={`${fieldClass} tw:w-full tw:sm:w-40! tw:lg:w-44! tw:flex-shrink-0`}
              />
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className={`${selectBase} tw:w-full tw:sm:w-40! tw:lg:w-44! tw:flex-shrink-0`}
                style={selectStyle(purpose)}
              >
                <option value="">Travel purpose</option>
                {TRAVEL_PURPOSES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <select
                value={stay}
                onChange={(e) => setStay(e.target.value)}
                className={`${selectBase} tw:w-full tw:sm:w-40! tw:lg:w-44! tw:flex-shrink-0`}
                style={selectStyle(stay)}
              >
                <option value="">Days of stay</option>
                {STAY_LENGTHS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile — destination always visible; the extra filters collapse
                behind an accordion to keep the form compact */}
            <div className="tw:sm:hidden">
              <div className="tw:relative">
                <button
                  type="submit"
                  aria-label="Search"
                  className="tw:absolute tw:left-3.5 tw:top-1/2 tw:-translate-y-1/2 tw:text-gray-400! tw:hover:text-primary!"
                >
                  <Search className="tw:w-4 tw:h-4" />
                </button>
                <input
                  type="text"
                  list="visa-country-options"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Enter destination country…"
                  style={textInputStyle}
                  className={`${fieldClass} tw:pl-10!`}
                />
              </div>
              <button
                type="button"
                onClick={() => setFiltersOpen((o) => !o)}
                className="tw:flex tw:items-center tw:justify-between tw:w-full tw:mt-3! tw:px-4! tw:py-2.5! tw:rounded-xl tw:border tw:border-gray-200 tw:bg-gray-50! tw:text-sm tw:font-medium tw:text-gray-600!"
              >
                <span>{filtersOpen ? "Hide filters" : "More filters"}</span>
                <ChevronDown
                  className={`tw:w-4 tw:h-4 tw:transition-transform ${
                    filtersOpen ? "tw:rotate-180" : ""
                  }`}
                />
              </button>
              {filtersOpen && (
                <div className="tw:mt-3! tw:space-y-3!">
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    placeholder="Passport nationality"
                    style={textInputStyle}
                    className={fieldClass}
                  />
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className={selectBase}
                    style={selectStyle(purpose)}
                  >
                    <option value="">Travel purpose</option>
                    {TRAVEL_PURPOSES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <select
                    value={stay}
                    onChange={(e) => setStay(e.target.value)}
                    className={selectBase}
                    style={selectStyle(stay)}
                  >
                    <option value="">Days of stay</option>
                    {STAY_LENGTHS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </form>

          <p className="tw:flex tw:items-center tw:justify-center! tw:gap-1.5! tw:text-white/80 tw:text-xs tw:mt-5! tw:max-w-2xl tw:mx-auto! tw:leading-relaxed">
            <Info className="tw:w-5 tw:h-5 tw:flex-shrink-0 tw:text-white/70" />
            <span>
              Visa and entry requirements can change. Always confirm with the
              official embassy or government website
            </span>
          </p>
        </div>
      </section>

      <main className="tw:max-w-6xl tw:mx-auto! tw:px-4! tw:sm:px-6! tw:pt-8! tw:pb-14!">
        {/* Heading row — only shown when there are results or an active search */}
        {(total > 0 || search) && (
          <div className="tw:flex tw:items-center tw:justify-between tw:flex-wrap tw:gap-3! tw:mb-6!">
            <h2 className="tw:text-xl tw:sm:text-2xl tw:font-bold! tw:text-dark-purple">
              {search ? `Results for "${search}"` : "All Destinations"}
              <span className="tw:text-gray-400 tw:font-normal tw:text-base tw:ml-2!">
                ({total})
              </span>
            </h2>
            {search && (
              <button
                onClick={clearSearch}
                className="tw:text-sm tw:text-primary! tw:font-medium tw:hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:lg:grid-cols-3 tw:gap-4!">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="tw:h-20 tw:bg-gray-100 tw:rounded-2xl tw:animate-pulse"
              />
            ))}
          </div>
        ) : countries.length === 0 ? (
          <div className="tw:text-center tw:py-16! tw:sm:py-20!">
            <Globe className="tw:w-12 tw:h-12 tw:text-gray-300 tw:mx-auto! tw:mb-4!" />
            <p className="tw:text-lg tw:font-medium tw:text-gray-700">
              {search ? "No results found" : "No visa information available yet"}
            </p>
            <p className="tw:text-sm tw:text-gray-400 tw:mt-1!">
              {search
                ? "Try a different country name or clear the search."
                : "Check back soon as we add more countries."}
            </p>
          </div>
        ) : (
          <>
            <div
              className={`tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:lg:grid-cols-3 tw:gap-4! tw:transition-opacity ${
                isFetching ? "tw:opacity-60" : "tw:opacity-100"
              }`}
            >
              {countries.map((c) => (
                <CountryCard key={c.id} country={c} />
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
                  className="tw:h-9 tw:px-3! tw:flex tw:items-center tw:gap-1! tw:rounded-lg tw:border tw:border-gray-200 tw:text-sm tw:text-gray-600! tw:hover:border-primary tw:hover:text-primary tw:transition-colors tw:disabled:opacity-40 tw:disabled:cursor-not-allowed tw:disabled:hover:border-gray-200 tw:disabled:hover:text-gray-600"
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
                  className="tw:h-9 tw:px-3! tw:flex tw:items-center tw:gap-1! tw:rounded-lg tw:border tw:border-gray-200 tw:text-sm tw:text-gray-600! tw:hover:border-primary tw:hover:text-primary tw:transition-colors tw:disabled:opacity-40 tw:disabled:cursor-not-allowed tw:disabled:hover:border-gray-200 tw:disabled:hover:text-gray-600"
                  aria-label="Next page"
                >
                  <span className="tw:hidden tw:sm:inline">Next</span>
                  <ChevronRight className="tw:w-4 tw:h-4" />
                </button>
              </nav>
            )}
          </>
        )}

        {/* All destinations — always-rendered, crawlable index of every
            published country so each country page is internally linked from the
            hub (no orphan pages), independent of the paginated/searchable grid
            above. Only shown once the catalogue exceeds one page; below that the
            grid already links every country. */}
        {allCountries.length > 0 && allTotal > PER_PAGE && (
          <section className="tw:mt-14! tw:pt-10! tw:border-t tw:border-gray-100">
            <h2 className="tw:text-lg tw:font-bold! tw:text-dark-purple tw:mb-2!">
              All Visa Destinations
            </h2>
            <p className="tw:text-sm tw:text-gray-400 tw:mb-5!">
              Browse visa information for every destination we cover.
            </p>
            <ul className="tw:grid tw:grid-cols-2 tw:sm:grid-cols-3 tw:lg:grid-cols-4 tw:gap-x-6! tw:gap-y-2.5!">
              {allCountries.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/visa-information/${c.countrySlug}`}
                    className="tw:text-sm tw:text-gray-600! tw:hover:text-primary! tw:transition-colors"
                  >
                    {c.countryName} visa
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

export default VisaInformationHub;
