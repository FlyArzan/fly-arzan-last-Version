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
        {flag ? <img src={flag} alt={`${country.countryName} flag`} width="48" height="48" loading="lazy" className="tw:w-full tw:h-full tw:object-cover" /> : emoji}
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

      {/* Hero */}
      <section className="tw:bg-gradient-to-br tw:from-indigo-600 tw:to-purple-700 tw:text-white tw:py-20 tw:px-4">
        <div className="tw:max-w-3xl tw:mx-auto tw:text-center">
          <h1 className="tw:text-4xl tw:md:text-5xl tw:font-bold tw:mb-4 tw:leading-tight">
            Visa Information & Travel Requirements
          </h1>
          <p className="tw:text-indigo-100 tw:text-lg tw:mb-8 tw:max-w-2xl tw:mx-auto">
            {PAGE_DESCRIPTION}
          </p>
          <form onSubmit={handleSearch} className="tw:max-w-2xl tw:mx-auto">
            <div className="tw:flex tw:gap-2 tw:mb-3">
              <input
                type="text"
                list="visa-country-options"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter destination country…"
                className="tw:flex-1 tw:px-4 tw:py-3 tw:rounded-xl tw:text-gray-900 tw:text-sm tw:outline-none tw:shadow"
              />
              <datalist id="visa-country-options">
                {allCountries.map((c) => (
                  <option key={c.id} value={c.countryName} />
                ))}
              </datalist>
              <button
                type="submit"
                className="tw:px-6 tw:py-3 tw:bg-white tw:text-indigo-700 tw:font-semibold tw:rounded-xl tw:hover:bg-indigo-50 tw:transition-colors tw:text-sm"
              >
                Search
              </button>
            </div>
            {/* Optional guided-search refinements (spec §8A) */}
            <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-3 tw:gap-2">
              <input
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                placeholder="Passport nationality (optional)"
                className="tw:px-3 tw:py-2.5 tw:rounded-xl tw:text-gray-900 tw:text-sm tw:outline-none tw:shadow"
              />
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="tw:px-3 tw:py-2.5 tw:rounded-xl tw:text-gray-900 tw:text-sm tw:outline-none tw:shadow tw:bg-white"
              >
                <option value="">Travel purpose</option>
                {TRAVEL_PURPOSES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <select
                value={stay}
                onChange={(e) => setStay(e.target.value)}
                className="tw:px-3 tw:py-2.5 tw:rounded-xl tw:text-gray-900 tw:text-sm tw:outline-none tw:shadow tw:bg-white"
              >
                <option value="">Length of stay</option>
                {STAY_LENGTHS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
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
