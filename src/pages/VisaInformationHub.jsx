import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search, ArrowRight, Globe, Info, ChevronRight } from "lucide-react";
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
  depends: { label: "Depends on Nationality", color: "tw:bg-amber-50 tw:text-amber-700" },
  check: { label: "Check Requirements", color: "tw:bg-gray-100 tw:text-gray-600" },
};

const CountryCard = ({ country }) => {
  const status = VISA_STATUS_LABELS[country.visaRequired] || VISA_STATUS_LABELS.check;

  return (
    <Link
      to={`/visa-information/${country.countrySlug}`}
      className="tw:flex tw:items-center tw:gap-4 tw:bg-white tw:rounded-2xl tw:p-4 tw:border tw:border-gray-100 tw:shadow-sm tw:hover:shadow-md tw:hover:border-primary/40 tw:transition-all tw:group"
    >
      <div className="tw:flex-shrink-0">
        <FlagBadge country={country} />
      </div>
      <div className="tw:flex-1 tw:min-w-0">
        <p className="tw:font-semibold tw:text-dark-purple tw:text-sm tw:group-hover:text-primary tw:transition-colors">
          {country.countryName}
        </p>
        <div className="tw:flex tw:items-center tw:flex-wrap tw:gap-1.5 tw:mt-1.5">
          <span className={`tw:text-xs tw:px-2 tw:py-0.5 tw:rounded-full tw:font-medium ${status.color}`}>
            {status.label}
          </span>
          {country.eVisaAvailable === "yes" && (
            <span className="tw:text-xs tw:px-2 tw:py-0.5 tw:rounded-full tw:bg-primary/10 tw:text-dark-purple tw:font-medium">
              eVisa
            </span>
          )}
        </div>
      </div>
      <ArrowRight className="tw:w-4 tw:h-4 tw:text-gray-300 tw:group-hover:text-primary tw:transition-colors tw:flex-shrink-0" />
    </Link>
  );
};

const PAGE_DESCRIPTION =
  "Search visa requirements, passport rules, eVisa options, visa on arrival, required documents and official government links before you travel.";

const TRAVEL_PURPOSES = ["Tourism", "Business", "Transit", "Study", "Work"];
const STAY_LENGTHS = ["Up to 30 days", "30–90 days", "90–180 days", "More than 180 days"];

const VisaInformationHub = () => {
  const [searchInput, setSearchInput] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [nationality, setNationality] = useState("");
  const [purpose, setPurpose] = useState("");
  const [stay, setStay] = useState("");
  const navigate = useNavigate();

  // Fetch the full published list once; filter client-side so the country
  // datalist/dropdowns always have every option regardless of the search box.
  const { data, isLoading } = useVisaCountries({ search: "", limit: 200 });
  const allCountries = data?.countries || [];

  const query = submittedSearch.trim().toLowerCase();
  const countries = query
    ? allCountries.filter(
        (c) =>
          c.countryName.toLowerCase().includes(query) ||
          (c.countryCode || "").toLowerCase().includes(query),
      )
    : allCountries;

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchInput.trim();
    if (q.length === 0) return;

    // If the typed country exactly (or uniquely) matches a known country, go
    // straight to its page — carrying the guided-search context as query params.
    const lower = q.toLowerCase();
    const exact = allCountries.find((c) => c.countryName.toLowerCase() === lower);
    const partial = allCountries.filter((c) => c.countryName.toLowerCase().includes(lower));
    const match = exact || (partial.length === 1 ? partial[0] : null);

    if (match) {
      const params = new URLSearchParams();
      if (nationality.trim()) params.set("nationality", nationality.trim());
      if (purpose) params.set("purpose", purpose);
      if (stay) params.set("stay", stay);
      const qs = params.toString();
      navigate(`/visa-information/${match.countrySlug}${qs ? `?${qs}` : ""}`);
      return;
    }

    // Otherwise just filter the on-page list.
    setSubmittedSearch(q);
  };

  const PAGE_URL = "https://flyarzan.com/visa-information";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://flyarzan.com" },
      { "@type": "ListItem", position: 2, name: "Visa Information", item: PAGE_URL },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Visa Information & Travel Requirements",
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
  };

  const fieldClass =
    "tw:w-full tw:px-4 tw:py-2.5 tw:rounded-lg tw:bg-white tw:text-gray-900 tw:text-sm tw:border tw:border-gray-200 tw:shadow-sm tw:outline-none tw:transition tw:focus:border-primary tw:focus:ring-2 tw:focus:ring-white/60 tw:placeholder:text-gray-400";

  return (
    <>
      <Helmet>
        <title>Visa Information & Travel Requirements | FlyArzan</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Visa Information & Travel Requirements | FlyArzan" />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(collectionSchema)}</script>
      </Helmet>

      <Header />

      {/* Hero — primary cyan gradient; compact, with top padding clearing the fixed header */}
      <section className="tw:bg-gradient-to-b tw:from-[#3194c4] tw:to-[#1c6993] tw:text-white tw:pt-24 tw:md:pt-28 tw:pb-10 tw:px-4">
        <div className="tw:max-w-2xl tw:mx-auto tw:text-center">
          <nav className="tw:flex tw:items-center tw:justify-center tw:gap-1 tw:text-xs tw:text-white/70 tw:mb-4">
            <Link to="/" className="tw:hover:text-white tw:transition-colors">Home</Link>
            <ChevronRight className="tw:w-3 tw:h-3" />
            <span className="tw:text-white tw:font-medium">Visa Information</span>
          </nav>
          <h1 className="tw:text-2xl tw:md:text-4xl tw:font-bold tw:mb-3 tw:leading-tight">
            Visa Information &amp; Travel Requirements
          </h1>
          <p className="tw:text-white/80 tw:text-sm tw:md:text-base tw:mb-7 tw:max-w-xl tw:mx-auto tw:leading-relaxed">
            {PAGE_DESCRIPTION}
          </p>

          <form onSubmit={handleSearch} className="tw:max-w-xl tw:mx-auto">
            <div className="tw:flex tw:gap-2 tw:mb-2.5">
              <div className="tw:relative tw:flex-1">
                <Search className="tw:absolute tw:left-3.5 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-gray-400 tw:pointer-events-none" />
                <input
                  type="text"
                  list="visa-country-options"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Enter destination country…"
                  className={`${fieldClass} tw:pl-10`}
                />
              </div>
              <datalist id="visa-country-options">
                {allCountries.map((c) => (
                  <option key={c.id} value={c.countryName} />
                ))}
              </datalist>
              <button
                type="submit"
                className="tw:px-6 tw:py-2.5 tw:bg-white tw:text-[#1c6993] tw:font-semibold tw:rounded-lg tw:hover:bg-white/90 tw:transition-colors tw:text-sm tw:flex-shrink-0 tw:shadow-sm"
              >
                Search
              </button>
            </div>
            {/* Optional guided-search refinements */}
            <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-3 tw:gap-2">
              <input
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                placeholder="Passport nationality"
                className={fieldClass}
              />
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className={`${fieldClass} ${purpose ? "tw:text-gray-900" : "tw:text-gray-400"}`}
              >
                <option value="" className="tw:text-gray-400">Travel purpose</option>
                {TRAVEL_PURPOSES.map((p) => (
                  <option key={p} value={p} className="tw:text-gray-900">{p}</option>
                ))}
              </select>
              <select
                value={stay}
                onChange={(e) => setStay(e.target.value)}
                className={`${fieldClass} ${stay ? "tw:text-gray-900" : "tw:text-gray-400"}`}
              >
                <option value="" className="tw:text-gray-400">Length of stay</option>
                {STAY_LENGTHS.map((s) => (
                  <option key={s} value={s} className="tw:text-gray-900">{s}</option>
                ))}
              </select>
            </div>
          </form>

          <p className="tw:text-white/65 tw:text-[11px] tw:mt-5 tw:max-w-md tw:mx-auto tw:leading-relaxed">
            Visa and entry requirements can change. Always confirm with the official embassy or government website before travelling.
          </p>
        </div>
      </section>

      <main className="tw:max-w-6xl tw:mx-auto tw:px-4 tw:sm:px-6 tw:py-12">
        <div className="tw:flex tw:items-center tw:justify-between tw:mb-6">
          <h2 className="tw:text-2xl tw:font-bold tw:text-dark-purple">
            {submittedSearch ? `Results for "${submittedSearch}"` : "All Destinations"}
          </h2>
          {submittedSearch && (
            <button
              onClick={() => { setSearchInput(""); setSubmittedSearch(""); }}
              className="tw:text-sm tw:text-primary tw:font-medium tw:hover:underline"
            >
              Clear search
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:lg:grid-cols-3 tw:gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="tw:h-20 tw:bg-gray-100 tw:rounded-2xl tw:animate-pulse" />
            ))}
          </div>
        ) : countries.length === 0 ? (
          <div className="tw:text-center tw:py-20">
            <Globe className="tw:w-12 tw:h-12 tw:text-gray-300 tw:mx-auto tw:mb-4" />
            <p className="tw:text-lg tw:font-medium tw:text-gray-700">
              {submittedSearch ? "No results found" : "No visa information available yet"}
            </p>
            <p className="tw:text-sm tw:text-gray-400 tw:mt-1">Check back soon as we add more countries.</p>
          </div>
        ) : (
          <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:lg:grid-cols-3 tw:gap-4">
            {countries.map((c) => (
              <CountryCard key={c.id} country={c} />
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <div className="tw:mt-12 tw:flex tw:gap-3 tw:p-5 tw:bg-amber-50 tw:border tw:border-amber-200 tw:rounded-2xl tw:text-sm tw:text-amber-800">
          <Info className="tw:w-5 tw:h-5 tw:flex-shrink-0 tw:mt-0.5 tw:text-amber-600" />
          <p>
            <strong>Important Disclaimer:</strong> Visa, passport and entry requirements can change at any time. FlyArzan provides this information as a general travel guide only. Travellers should always confirm the latest requirements with the official embassy, immigration authority, airline or government website before booking or travelling.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default VisaInformationHub;
