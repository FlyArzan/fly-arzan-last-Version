import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "../header-footer/Header";
import Footer from "../header-footer/Footer";
import { useVisaCountry } from "../hooks/useVisa";

const getFlagEmoji = (code) => {
  if (!code || code.length !== 2) return "🌍";
  return code.toUpperCase().split("").map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65)).join("");
};

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";

const SummaryCard = ({ icon, label, value, color = "tw:bg-gray-50" }) => (
  <div className={`tw:flex tw:flex-col tw:items-center tw:text-center tw:p-4 tw:rounded-2xl ${color}`}>
    <span className="tw:text-3xl tw:mb-2">{icon}</span>
    <span className="tw:text-xs tw:text-gray-500 tw:uppercase tw:tracking-wide tw:font-medium tw:mb-1">{label}</span>
    <span className="tw:font-semibold tw:text-gray-900 tw:text-sm">{value || "—"}</span>
  </div>
);

const Section = ({ title, children }) => (
  <section className="tw:mb-8">
    <h2 className="tw:text-xl tw:font-bold tw:text-gray-900 tw:mb-4 tw:pb-2 tw:border-b tw:border-gray-100">
      {title}
    </h2>
    {children}
  </section>
);

const VisaCountryPage = () => {
  const { slug } = useParams();
  const { data: country, isLoading, isError } = useVisaCountry(slug);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="tw:max-w-4xl tw:mx-auto tw:px-4 tw:py-16 tw:animate-pulse">
          <div className="tw:h-10 tw:bg-gray-200 tw:rounded tw:mb-4 tw:w-1/2" />
          <div className="tw:h-48 tw:bg-gray-100 tw:rounded-2xl tw:mb-6" />
          <div className="tw:grid tw:grid-cols-2 tw:gap-4 tw:mb-8">
            {[...Array(6)].map((_, i) => <div key={i} className="tw:h-24 tw:bg-gray-100 tw:rounded-xl" />)}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (isError || !country) {
    return (
      <>
        <Header />
        <div className="tw:max-w-4xl tw:mx-auto tw:px-4 tw:py-20 tw:text-center">
          <h1 className="tw:text-2xl tw:font-bold tw:text-gray-900 tw:mb-3">Country Not Found</h1>
          <p className="tw:text-gray-500 tw:mb-6">We don't have visa information for this country yet.</p>
          <Link to="/visa-information" className="tw:text-blue-600 tw:hover:underline">← Back to Visa Information</Link>
        </div>
        <Footer />
      </>
    );
  }

  const pageUrl = `https://flyarzan.com/visa-information/${country.countrySlug}`;
  const metaTitle = country.metaTitle || `${country.countryName} Visa Information for Travellers | FlyArzan`;
  const metaDesc = country.metaDescription ||
    `Check ${country.countryName} visa requirements, eVisa availability, passport validity, required documents, processing time, fees and official application links before you travel.`;

  const faqs = Array.isArray(country.faqs) ? country.faqs : [];
  const requiredDocs = Array.isArray(country.requiredDocuments) ? country.requiredDocuments : [];
  const sections = country.detailedSections || {};
  const visaTypes = Array.isArray(sections.visaTypes) ? sections.visaTypes : [];
  const applicationSteps = Array.isArray(sections.applicationSteps) ? sections.applicationSteps : [];
  const officialLinks = Array.isArray(sections.officialLinks) ? sections.officialLinks : [];
  const travelWarnings = Array.isArray(sections.travelWarnings) ? sections.travelWarnings : [];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://flyarzan.com" },
      { "@type": "ListItem", position: 2, name: "Visa Information", item: "https://flyarzan.com/visa-information" },
      { "@type": "ListItem", position: 3, name: country.countryName, item: pageUrl },
    ],
  };

  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  } : null;

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        {country.destinationImage && <meta property="og:image" content={country.destinationImage} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
      </Helmet>

      <Header />

      {/* Country hero */}
      <section className="tw:relative tw:bg-gradient-to-br tw:from-indigo-700 tw:to-purple-800 tw:text-white tw:py-16 tw:px-4 tw:overflow-hidden">
        {country.destinationImage && (
          <img
            src={country.destinationImage}
            alt={country.countryName}
            className="tw:absolute tw:inset-0 tw:w-full tw:h-full tw:object-cover tw:opacity-20"
          />
        )}
        <div className="tw:relative tw:max-w-4xl tw:mx-auto">
          {/* Breadcrumb */}
          <nav className="tw:text-sm tw:text-indigo-200 tw:mb-6 tw:flex tw:flex-wrap tw:gap-1">
            <Link to="/" className="tw:hover:text-white">Home</Link>
            <span>›</span>
            <Link to="/visa-information" className="tw:hover:text-white">Visa Information</Link>
            <span>›</span>
            <span className="tw:text-white">{country.countryName}</span>
          </nav>

          <div className="tw:flex tw:items-center tw:gap-5 tw:mb-4">
            <span className="tw:text-6xl">
              {country.flagImage
                ? <img src={country.flagImage} alt={country.countryName} className="tw:w-16 tw:h-12 tw:object-cover tw:rounded" />
                : getFlagEmoji(country.countryCode)}
            </span>
            <div>
              <h1 className="tw:text-3xl tw:md:text-4xl tw:font-bold">
                Visa Information for {country.countryName}
              </h1>
              {country.updatedAt && (
                <p className="tw:text-indigo-200 tw:text-sm tw:mt-1">Last updated: {formatDate(country.updatedAt)}</p>
              )}
            </div>
          </div>

          {country.travelIntroduction && (
            <p className="tw:text-indigo-100 tw:max-w-2xl tw:leading-relaxed">{country.travelIntroduction}</p>
          )}
        </div>
      </section>

      <main className="tw:max-w-4xl tw:mx-auto tw:px-4 tw:py-10">

        {/* Quick summary cards */}
        <div className="tw:grid tw:grid-cols-2 tw:sm:grid-cols-3 tw:gap-4 tw:mb-10">
          <SummaryCard
            icon={country.visaRequired === "no" ? "✅" : country.visaRequired === "yes" ? "🔴" : "⚠️"}
            label="Visa Required"
            value={
              country.visaRequired === "yes" ? "Yes"
              : country.visaRequired === "no" ? "No (Visa Free)"
              : country.visaRequired === "depends" ? "Depends on nationality"
              : "Check requirements"
            }
            color={country.visaRequired === "no" ? "tw:bg-green-50" : country.visaRequired === "yes" ? "tw:bg-red-50" : "tw:bg-yellow-50"}
          />
          <SummaryCard
            icon={country.eVisaAvailable === "yes" ? "💻" : "📋"}
            label="eVisa Available"
            value={country.eVisaAvailable === "yes" ? "Yes" : country.eVisaAvailable === "no" ? "No" : "Check"}
          />
          <SummaryCard
            icon="🛬"
            label="Visa on Arrival"
            value={country.visaOnArrival === "yes" ? "Yes" : country.visaOnArrival === "no" ? "No" : "Check"}
          />
          {country.passportValidity && (
            <SummaryCard icon="📘" label="Passport Validity" value={country.passportValidity} />
          )}
          {country.typicalProcessingTime && (
            <SummaryCard icon="⏱️" label="Processing Time" value={country.typicalProcessingTime} />
          )}
          {country.approximateVisaFee && (
            <SummaryCard icon="💰" label="Approximate Fee" value={country.approximateVisaFee} />
          )}
        </div>

        {/* Official application link */}
        {country.officialApplicationLink && (
          <div className="tw:mb-8 tw:p-4 tw:bg-blue-50 tw:border tw:border-blue-200 tw:rounded-2xl tw:flex tw:items-center tw:justify-between tw:flex-wrap tw:gap-3">
            <div>
              <p className="tw:font-semibold tw:text-blue-900">Official Application</p>
              <p className="tw:text-blue-700 tw:text-sm">Apply through the official government portal.</p>
            </div>
            <a
              href={country.officialApplicationLink}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="tw:bg-blue-600 tw:text-white tw:px-5 tw:py-2 tw:rounded-xl tw:text-sm tw:font-medium tw:hover:bg-blue-700 tw:transition-colors tw:flex-shrink-0"
            >
              Apply Official ↗
            </a>
          </div>
        )}

        {/* Travel warning */}
        {country.travelWarning && (
          <div className="tw:mb-8 tw:p-4 tw:bg-amber-50 tw:border tw:border-amber-300 tw:rounded-2xl tw:text-amber-900">
            <strong>⚠️ Important Note:</strong> {country.travelWarning}
          </div>
        )}

        {/* Visa types */}
        {visaTypes.length > 0 && (
          <Section title="Visa Types">
            <div className="tw:grid tw:gap-4">
              {visaTypes.map((vt, i) => (
                <div key={i} className="tw:p-4 tw:bg-white tw:border tw:border-gray-100 tw:rounded-xl">
                  <h3 className="tw:font-semibold tw:text-gray-900 tw:mb-1">{vt.type}</h3>
                  {vt.description && <p className="tw:text-gray-600 tw:text-sm tw:mb-2">{vt.description}</p>}
                  <div className="tw:flex tw:flex-wrap tw:gap-3 tw:text-xs tw:text-gray-500">
                    {vt.validity && <span>Validity: <strong>{vt.validity}</strong></span>}
                    {vt.stayDuration && <span>Stay: <strong>{vt.stayDuration}</strong></span>}
                  </div>
                  {vt.requirements && <p className="tw:text-sm tw:text-gray-600 tw:mt-2">{vt.requirements}</p>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Required documents */}
        {requiredDocs.length > 0 && (
          <Section title="Required Documents">
            <ul className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:gap-2">
              {requiredDocs.map((doc, i) => (
                <li key={i} className="tw:flex tw:items-start tw:gap-2 tw:text-gray-700 tw:text-sm">
                  <span className="tw:text-green-500 tw:mt-0.5">✓</span>
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Application steps */}
        {applicationSteps.length > 0 && (
          <Section title="Application Steps">
            <ol className="tw:space-y-3">
              {applicationSteps.map((step, i) => (
                <li key={i} className="tw:flex tw:items-start tw:gap-3">
                  <span className="tw:w-7 tw:h-7 tw:rounded-full tw:bg-indigo-100 tw:text-indigo-700 tw:text-sm tw:font-bold tw:flex tw:items-center tw:justify-center tw:flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="tw:text-gray-700 tw:text-sm tw:pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </Section>
        )}

        {/* Official links */}
        {officialLinks.length > 0 && (
          <Section title="Official Links & Resources">
            <div className="tw:grid tw:gap-2">
              {officialLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="tw:flex tw:items-center tw:justify-between tw:p-3 tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:text-sm tw:hover:border-blue-300 tw:transition-colors tw:group"
                >
                  <span className="tw:text-gray-800 tw:group-hover:text-blue-600">{link.label}</span>
                  <span className="tw:text-gray-400 tw:group-hover:text-blue-400">↗</span>
                </a>
              ))}
            </div>
          </Section>
        )}

        {/* Travel warnings */}
        {travelWarnings.length > 0 && (
          <Section title="Travel Warnings & Notes">
            <ul className="tw:space-y-2">
              {travelWarnings.map((w, i) => (
                <li key={i} className="tw:flex tw:items-start tw:gap-2 tw:text-sm tw:text-amber-800 tw:bg-amber-50 tw:p-3 tw:rounded-xl">
                  <span>⚠️</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* FAQs */}
        {faqs.length > 0 && (
          <Section title={`Frequently Asked Questions about ${country.countryName} Visa`}>
            <div className="tw:space-y-3">
              {faqs.map((faq, i) => (
                <details key={i} className="tw:border tw:border-gray-200 tw:rounded-xl tw:overflow-hidden">
                  <summary className="tw:px-5 tw:py-4 tw:font-semibold tw:text-gray-900 tw:cursor-pointer tw:hover:bg-gray-50 tw:list-none tw:flex tw:items-center tw:justify-between">
                    {faq.question}
                    <span className="tw:text-gray-400 tw:ml-2">+</span>
                  </summary>
                  <div className="tw:px-5 tw:pb-4 tw:text-gray-600 tw:text-sm tw:leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </Section>
        )}

        {/* Disclaimer */}
        <div className="tw:mt-8 tw:p-5 tw:bg-amber-50 tw:border tw:border-amber-200 tw:rounded-2xl tw:text-sm tw:text-amber-800">
          <strong>Important Disclaimer:</strong> Visa, passport and entry requirements can change at any time. FlyArzan provides this information as a general travel guide only. Travellers should always confirm the latest requirements with the official embassy, immigration authority, airline or government website before booking or travelling.
        </div>

        {/* Flight search CTA */}
        <div className="tw:mt-8 tw:p-6 tw:bg-indigo-600 tw:rounded-2xl tw:text-white tw:text-center">
          <p className="tw:font-semibold tw:text-lg tw:mb-2">Ready to Travel to {country.countryName}?</p>
          <p className="tw:text-indigo-100 tw:text-sm tw:mb-4">Search and compare flights on FlyArzan for the best deals.</p>
          <Link
            to="/"
            className="tw:inline-block tw:bg-white tw:text-indigo-700 tw:font-semibold tw:px-6 tw:py-2.5 tw:rounded-xl tw:text-sm tw:hover:bg-indigo-50 tw:transition-colors"
          >
            Search Flights to {country.countryName}
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default VisaCountryPage;
