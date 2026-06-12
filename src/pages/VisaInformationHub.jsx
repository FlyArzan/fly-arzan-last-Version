import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "../header-footer/Header";
import Footer from "../header-footer/Footer";
import { useVisaCountries } from "../hooks/useVisa";

const getFlagEmoji = (countryCode) => {
  if (!countryCode || countryCode.length !== 2) return "🌍";
  return countryCode
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
};

const VISA_STATUS_LABELS = {
  yes: { label: "Visa Required", color: "tw:bg-red-50 tw:text-red-700" },
  no: { label: "Visa Free", color: "tw:bg-green-50 tw:text-green-700" },
  depends: { label: "Depends on Nationality", color: "tw:bg-yellow-50 tw:text-yellow-700" },
  check: { label: "Check Requirements", color: "tw:bg-gray-50 tw:text-gray-600" },
};

const CountryCard = ({ country }) => {
  const flag = country.flagImage || null;
  const emoji = getFlagEmoji(country.countryCode);
  const status = VISA_STATUS_LABELS[country.visaRequired] || VISA_STATUS_LABELS.check;

  return (
    <Link
      to={`/visa-information/${country.countrySlug}`}
      className="tw:flex tw:items-center tw:gap-4 tw:bg-white tw:rounded-2xl tw:p-4 tw:border tw:border-gray-100 tw:shadow-sm tw:hover:shadow-md tw:hover:border-blue-200 tw:transition-all tw:group"
    >
      <div className="tw:w-12 tw:h-12 tw:rounded-xl tw:overflow-hidden tw:flex-shrink-0 tw:flex tw:items-center tw:justify-center tw:bg-gray-50 tw:text-2xl">
        {flag ? <img src={flag} alt={country.countryName} className="tw:w-full tw:h-full tw:object-cover" /> : emoji}
      </div>
      <div className="tw:flex-1 tw:min-w-0">
        <p className="tw:font-semibold tw:text-gray-900 tw:text-sm tw:group-hover:text-blue-600 tw:transition-colors">
          {country.countryName}
        </p>
        <div className="tw:flex tw:items-center tw:gap-2 tw:mt-1">
          <span className={`tw:text-xs tw:px-2 tw:py-0.5 tw:rounded-full tw:font-medium ${status.color}`}>
            {status.label}
          </span>
          {country.eVisaAvailable === "yes" && (
            <span className="tw:text-xs tw:px-2 tw:py-0.5 tw:rounded-full tw:bg-blue-50 tw:text-blue-600 tw:font-medium">
              eVisa
            </span>
          )}
        </div>
      </div>
      <span className="tw:text-gray-300 tw:group-hover:text-blue-400 tw:transition-colors">→</span>
    </Link>
  );
};

const PAGE_DESCRIPTION =
  "Search visa requirements, passport rules, eVisa options, visa on arrival, required documents and official government links before you travel.";

const VisaInformationHub = () => {
  const [searchInput, setSearchInput] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const navigate = useNavigate();

  const { data, isLoading } = useVisaCountries({ search: submittedSearch, limit: 200 });
  const countries = data?.countries || [];

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchInput.trim();
    if (q.length > 0) {
      setSubmittedSearch(q);
    }
  };

  const PAGE_URL = "https://flyarzan.com/visa-information";

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
      </Helmet>

      <Header />

      {/* Hero */}
      <section className="tw:bg-gradient-to-br tw:from-indigo-600 tw:to-purple-700 tw:text-white tw:py-20 tw:px-4">
        <div className="tw:max-w-3xl tw:mx-auto tw:text-center">
          <h1 className="tw:text-4xl tw:md:text-5xl tw:font-bold tw:mb-4 tw:leading-tight">
            Visa Information & Travel Requirements
          </h1>
          <p className="tw:text-indigo-100 tw:text-lg tw:mb-8 tw:max-w-2xl tw:mx-auto">
            {PAGE_DESCRIPTION}
          </p>
          <form onSubmit={handleSearch} className="tw:flex tw:gap-2 tw:max-w-lg tw:mx-auto">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter destination country…"
              className="tw:flex-1 tw:px-4 tw:py-3 tw:rounded-xl tw:text-gray-900 tw:text-sm tw:outline-none tw:shadow"
            />
            <button
              type="submit"
              className="tw:px-6 tw:py-3 tw:bg-white tw:text-indigo-700 tw:font-semibold tw:rounded-xl tw:hover:bg-indigo-50 tw:transition-colors tw:text-sm"
            >
              Search
            </button>
          </form>

          <p className="tw:text-indigo-200 tw:text-xs tw:mt-5 tw:max-w-xl tw:mx-auto">
            ⚠️ Visa and entry requirements can change. Always confirm with the official embassy or government website before travelling.
          </p>
        </div>
      </section>

      <main className="tw:max-w-6xl tw:mx-auto tw:px-4 tw:py-12">
        <div className="tw:flex tw:items-center tw:justify-between tw:mb-6">
          <h2 className="tw:text-2xl tw:font-bold tw:text-gray-900">
            {submittedSearch ? `Results for "${submittedSearch}"` : "All Destinations"}
          </h2>
          {submittedSearch && (
            <button
              onClick={() => { setSearchInput(""); setSubmittedSearch(""); }}
              className="tw:text-sm tw:text-blue-600 tw:hover:underline"
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
          <div className="tw:text-center tw:py-20 tw:text-gray-400">
            <div className="tw:text-5xl tw:mb-4">🌍</div>
            <p className="tw:text-lg tw:font-medium">
              {submittedSearch ? "No results found" : "No visa information available yet"}
            </p>
            <p className="tw:text-sm tw:mt-1">Check back soon as we add more countries.</p>
          </div>
        ) : (
          <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:lg:grid-cols-3 tw:gap-4">
            {countries.map((c) => (
              <CountryCard key={c.id} country={c} />
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <div className="tw:mt-12 tw:p-5 tw:bg-amber-50 tw:border tw:border-amber-200 tw:rounded-2xl tw:text-sm tw:text-amber-800">
          <strong>Important Disclaimer:</strong> Visa, passport and entry requirements can change at any time. FlyArzan provides this information as a general travel guide only. Travellers should always confirm the latest requirements with the official embassy, immigration authority, airline or government website before booking or travelling.
        </div>
      </main>

      <Footer />
    </>
  );
};

export default VisaInformationHub;
