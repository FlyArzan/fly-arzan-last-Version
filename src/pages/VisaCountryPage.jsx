import { Link, useParams, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  Laptop,
  PlaneLanding,
  BookUser,
  Clock,
  Wallet,
  Check,
  ExternalLink,
  AlertTriangle,
  Info,
  Map,
  PlaneTakeoff,
  FileText,
  Plus,
  ScrollText,
  Layers,
  Users,
  Briefcase,
  ArrowLeftRight,
  ClipboardList,
  Timer,
  Coins,
  ListOrdered,
  Link2,
} from "lucide-react";
import Header from "../header-footer/Header";
import Footer from "../header-footer/Footer";
import { useVisaCountry } from "../hooks/useVisa";

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";

const SummaryCard = ({ icon: Icon, label, value, tone = "tw:bg-gray-50 tw:text-gray-500" }) => (
  <div className="tw:flex tw:flex-col tw:items-center tw:text-center tw:p-4! tw:rounded-2xl tw:border tw:border-gray-100 tw:bg-white tw:shadow-sm">
    <span className={`tw:w-11 tw:h-11 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:mb-3! ${tone}`}>
      <Icon className="tw:w-5 tw:h-5" aria-hidden="true" />
    </span>
    <span className="tw:text-[11px] tw:text-gray-400 tw:uppercase tw:tracking-wide tw:font-semibold tw:mb-1!">{label}</span>
    <span className="tw:font-semibold tw:text-dark-purple tw:text-base">{value || "—"}</span>
  </div>
);

const Section = ({ title, icon: Icon, children }) => (
  <section className="tw:mb-10!">
    <h2 className="tw:flex tw:items-center tw:gap-2.5! tw:text-2xl tw:font-bold tw:text-dark-purple tw:mb-5! tw:pb-3! tw:border-b tw:border-gray-100">
      {Icon && (
        <span className="tw:inline-flex tw:w-9 tw:h-9 tw:rounded-lg tw:bg-primary/10 tw:text-dark-purple tw:items-center tw:justify-center tw:flex-shrink-0">
          <Icon className="tw:w-[18px] tw:h-[18px]" aria-hidden="true" />
        </span>
      )}
      {title}
    </h2>
    {children}
  </section>
);

// Renders a list of label/value rows, skipping any that are empty. Used by the
// detailed visa-type sections (tourist / business / transit / eVisa / VoA).
const DetailRows = ({ rows }) => {
  const visible = rows.filter((r) => r.value);
  if (visible.length === 0) return null;
  return (
    <dl className="tw:grid tw:gap-4!">
      {visible.map((r, i) => (
        <div key={i} className="tw:flex tw:flex-col tw:sm:flex-row tw:sm:gap-4!">
          <dt className="tw:text-base tw:font-semibold tw:text-dark-purple tw:sm:w-48 tw:flex-shrink-0">{r.label}</dt>
          <dd className="tw:text-base tw:text-gray-600 tw:leading-relaxed">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
};

// True when a detail object has at least one non-empty field.
const hasContent = (obj) => obj && typeof obj === "object" && Object.values(obj).some((v) => v && String(v).trim());

const RELATED_RESOURCES = [
  { to: "/travel-guides/destination-guides", icon: Map, label: "Destination Guides" },
  { to: "/travel-guides/airport-guides", icon: PlaneTakeoff, label: "Airport Guides" },
  { to: "/travel-guides/visa-travel-documents", icon: FileText, label: "Visa & Travel Documents" },
];

const VisaCountryPage = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const searchNationality = searchParams.get("nationality") || "";
  const searchPurpose = searchParams.get("purpose") || "";
  const searchStay = searchParams.get("stay") || "";
  const hasSearchContext = searchNationality || searchPurpose || searchStay;
  const { data: country, isLoading, isError } = useVisaCountry(slug);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="tw:max-w-4xl tw:mx-auto tw:px-4! tw:pt-28! tw:md:pt-36! tw:pb-16! tw:animate-pulse">
          <div className="tw:h-10 tw:bg-gray-200 tw:rounded tw:mb-4! tw:w-1/2" />
          <div className="tw:h-48 tw:bg-gray-100 tw:rounded-2xl tw:mb-6!" />
          <div className="tw:grid tw:grid-cols-2 tw:gap-4! tw:mb-8!">
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
        <Helmet>
          <title>Country Not Found | FlyArzan</title>
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <Header />
        <div className="tw:max-w-4xl tw:mx-auto tw:px-4! tw:pt-28! tw:md:pt-36! tw:pb-20! tw:text-center">
          <h1 className="tw:text-2xl tw:font-bold tw:text-dark-purple tw:mb-3!">Country Not Found</h1>
          <p className="tw:text-gray-500 tw:mb-6!">We don&apos;t have visa information for this country yet.</p>
          <Link to="/visa-information" className="tw:text-primary tw:font-medium tw:hover:underline">← Back to Visa Information</Link>
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
  // Detailed per-type visa sections (spec sections C–G). Each is an optional
  // structured object filled in from the admin CMS; rendered only when present.
  const visaRequirementDetail = sections.visaRequirementDetail || "";
  const touristVisa = sections.touristVisa || {};
  const businessVisa = sections.businessVisa || {};
  const transitVisa = sections.transitVisa || {};
  const eVisaDetails = sections.eVisaDetails || {};
  const visaOnArrivalDetails = sections.visaOnArrivalDetails || {};
  const passportValidityDetail = sections.passportValidityDetail || "";
  const processingTimeDetail = sections.processingTimeDetail || "";

  // Status-driven icon + tone for the "Visa Required" summary card.
  const visaReq = country.visaRequired;
  const visaReqMeta =
    visaReq === "no"
      ? { icon: ShieldCheck, tone: "tw:bg-green-50 tw:text-green-600", value: "No (Visa Free)" }
      : visaReq === "yes"
      ? { icon: ShieldAlert, tone: "tw:bg-red-50 tw:text-red-600", value: "Yes" }
      : visaReq === "depends"
      ? { icon: HelpCircle, tone: "tw:bg-amber-50 tw:text-amber-600", value: "Depends on nationality" }
      : { icon: HelpCircle, tone: "tw:bg-gray-100 tw:text-gray-500", value: "Check requirements" };

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

      {/* Country hero — navy brand gradient; top padding clears the fixed header */}
      <section className="tw:relative tw:bg-gradient-to-br tw:from-dark-purple tw:to-[#1a2a7a] tw:text-white tw:pt-28! tw:md:pt-36! tw:pb-14! tw:px-4! tw:overflow-hidden">
        {country.destinationImage && (
          <img
            src={country.destinationImage}
            alt={`${country.countryName} destination`}
            loading="lazy"
            className="tw:absolute tw:inset-0 tw:w-full tw:h-full tw:object-cover tw:opacity-20"
          />
        )}
        <div className="tw:relative tw:max-w-4xl tw:mx-auto">
          {/* Breadcrumb */}
          <nav className="tw:text-sm tw:text-white/60 tw:mb-6! tw:flex tw:flex-wrap tw:items-center tw:gap-1!">
            <Link to="/" className="tw:hover:text-white tw:transition-colors">Home</Link>
            <ChevronRight className="tw:w-3.5 tw:h-3.5" />
            <Link to="/visa-information" className="tw:hover:text-white tw:transition-colors">Visa Information</Link>
            <ChevronRight className="tw:w-3.5 tw:h-3.5" />
            <span className="tw:text-white">{country.countryName}</span>
          </nav>

          <div className="tw:flex tw:items-center tw:gap-5! tw:mb-4!">
            {country.flagImage ? (
              <img
                src={country.flagImage}
                alt={`${country.countryName} flag`}
                width="64"
                height="48"
                loading="lazy"
                className="tw:w-16 tw:h-12 tw:object-cover tw:rounded-md tw:ring-1 tw:ring-white/20 tw:flex-shrink-0"
              />
            ) : (
              <div className="tw:w-16 tw:h-12 tw:rounded-md tw:bg-white/10 tw:ring-1 tw:ring-white/20 tw:flex tw:items-center tw:justify-center tw:font-bold tw:text-lg tw:flex-shrink-0">
                {(country.countryCode || "??").toUpperCase().slice(0, 2)}
              </div>
            )}
            <div>
              <h1 className="tw:text-3xl tw:md:text-4xl tw:font-bold tw:leading-tight">
                Visa Information for {country.countryName}
              </h1>
              {country.updatedAt && (
                <p className="tw:text-white/60 tw:text-sm tw:mt-1.5!">Last updated: {formatDate(country.updatedAt)}</p>
              )}
            </div>
          </div>

          {country.travelIntroduction && (
            <p className="tw:text-white/75 tw:text-lg tw:max-w-2xl tw:leading-relaxed">{country.travelIntroduction}</p>
          )}
        </div>
      </section>

      <main className="tw:max-w-4xl tw:mx-auto tw:px-4! tw:sm:px-6! tw:py-10!">

        {/* Guided-search context from the visa hub */}
        {hasSearchContext && (
          <div className="tw:mb-6! tw:p-4! tw:bg-primary/5 tw:border tw:border-primary/20 tw:rounded-2xl tw:text-base tw:text-dark-purple">
            <span className="tw:font-semibold">Your search:</span>{" "}
            {[
              searchNationality && `${searchNationality} passport`,
              searchPurpose && `${searchPurpose} travel`,
              searchStay && searchStay.toLowerCase(),
            ]
              .filter(Boolean)
              .join(" · ")}
            <span className="tw:block tw:text-sm tw:text-gray-500 tw:mt-1!">
              The information below is general guidance for {country.countryName}. Confirm specifics for your nationality with the official sources linked on this page.
            </span>
          </div>
        )}

        {/* Quick summary cards */}
        <div className="tw:grid tw:grid-cols-2 tw:sm:grid-cols-3 tw:gap-4! tw:mb-10!">
          <SummaryCard icon={visaReqMeta.icon} label="Visa Required" value={visaReqMeta.value} tone={visaReqMeta.tone} />
          <SummaryCard
            icon={Laptop}
            label="eVisa Available"
            value={country.eVisaAvailable === "yes" ? "Yes" : country.eVisaAvailable === "no" ? "No" : "Check"}
            tone="tw:bg-primary/10 tw:text-dark-purple"
          />
          <SummaryCard
            icon={PlaneLanding}
            label="Visa on Arrival"
            value={country.visaOnArrival === "yes" ? "Yes" : country.visaOnArrival === "no" ? "No" : "Check"}
            tone="tw:bg-primary/10 tw:text-dark-purple"
          />
          {country.passportValidity && (
            <SummaryCard icon={BookUser} label="Passport Validity" value={country.passportValidity} tone="tw:bg-primary/10 tw:text-dark-purple" />
          )}
          {country.typicalProcessingTime && (
            <SummaryCard icon={Clock} label="Processing Time" value={country.typicalProcessingTime} tone="tw:bg-primary/10 tw:text-dark-purple" />
          )}
          {country.approximateVisaFee && (
            <SummaryCard icon={Wallet} label="Approximate Fee" value={country.approximateVisaFee} tone="tw:bg-primary/10 tw:text-dark-purple" />
          )}
        </div>

        {/* Official application link */}
        {country.officialApplicationLink && (
          <div className="tw:mb-8! tw:p-4! tw:bg-primary/5 tw:border tw:border-primary/20 tw:rounded-2xl tw:flex tw:items-center tw:justify-between tw:flex-wrap tw:gap-3!">
            <div>
              <p className="tw:font-semibold tw:text-dark-purple tw:text-lg">Official Application</p>
              <p className="tw:text-gray-600 tw:text-base">Apply through the official government portal.</p>
            </div>
            <a
              href={country.officialApplicationLink}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="tw:inline-flex tw:items-center tw:gap-1.5! tw:bg-dark-purple! tw:text-white! tw:px-5! tw:py-2.5! tw:rounded-xl tw:text-base tw:font-medium tw:hover:bg-[#000080]! tw:transition-colors tw:flex-shrink-0"
            >
              Apply Official <ExternalLink className="tw:w-4 tw:h-4" />
            </a>
          </div>
        )}

        {/* Travel warning */}
        {country.travelWarning && (
          <div className="tw:mb-8! tw:flex tw:gap-3! tw:p-4! tw:bg-amber-50 tw:border tw:border-amber-300 tw:rounded-2xl tw:text-amber-900 tw:text-base">
            <AlertTriangle className="tw:w-5 tw:h-5 tw:flex-shrink-0 tw:mt-0.5! tw:text-amber-600" />
            <p><strong>Important Note:</strong> {country.travelWarning}</p>
          </div>
        )}

        {/* A. Visa requirement (detailed prose) */}
        {visaRequirementDetail && (
          <Section title="Visa Requirement" icon={ScrollText}>
            <p className="tw:text-gray-600 tw:text-base tw:leading-relaxed tw:whitespace-pre-line">{visaRequirementDetail}</p>
          </Section>
        )}

        {/* B. Visa types */}
        {visaTypes.length > 0 && (
          <Section title="Visa Types" icon={Layers}>
            <div className="tw:grid tw:gap-4!">
              {visaTypes.map((vt, i) => (
                <div key={i} className="tw:p-4! tw:bg-white tw:border tw:border-gray-100 tw:rounded-xl tw:shadow-sm">
                  <h3 className="tw:font-semibold tw:text-dark-purple tw:text-lg tw:mb-1!">{vt.type}</h3>
                  {vt.description && <p className="tw:text-gray-600 tw:text-base tw:mb-2!">{vt.description}</p>}
                  <div className="tw:flex tw:flex-wrap tw:gap-3! tw:text-sm tw:text-gray-500">
                    {vt.validity && <span>Validity: <strong>{vt.validity}</strong></span>}
                    {vt.stayDuration && <span>Stay: <strong>{vt.stayDuration}</strong></span>}
                  </div>
                  {vt.requirements && <p className="tw:text-base tw:text-gray-600 tw:mt-2!">{vt.requirements}</p>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* C. Tourist visa information */}
        {hasContent(touristVisa) && (
          <Section title="Tourist Visa Information" icon={Users}>
            <DetailRows rows={[
              { label: "Eligibility", value: touristVisa.eligibility },
              { label: "Validity", value: touristVisa.validity },
              { label: "Stay duration", value: touristVisa.stayDuration },
              { label: "Entry type", value: touristVisa.entryType },
              { label: "Main requirements", value: touristVisa.requirements },
              { label: "Application method", value: touristVisa.applicationMethod },
            ]} />
          </Section>
        )}

        {/* D. Business visa information */}
        {hasContent(businessVisa) && (
          <Section title="Business Visa Information" icon={Briefcase}>
            <DetailRows rows={[
              { label: "Purpose", value: businessVisa.purpose },
              { label: "Invitation letter", value: businessVisa.invitationLetter },
              { label: "Business documents", value: businessVisa.businessDocuments },
              { label: "Processing time", value: businessVisa.processingTime },
              { label: "Application method", value: businessVisa.applicationMethod },
            ]} />
          </Section>
        )}

        {/* E. Transit visa information */}
        {hasContent(transitVisa) && (
          <Section title="Transit Visa Information" icon={ArrowLeftRight}>
            <DetailRows rows={[
              { label: "When required", value: transitVisa.whenRequired },
              { label: "Airport transit rules", value: transitVisa.airportTransitRules },
              { label: "Connecting flight conditions", value: transitVisa.connectingFlightConditions },
              { label: "Important exceptions", value: transitVisa.exceptions },
            ]} />
          </Section>
        )}

        {/* F. eVisa availability (detailed) */}
        {hasContent(eVisaDetails) && (
          <Section title="eVisa Availability" icon={Laptop}>
            <DetailRows rows={[
              { label: "Available", value: eVisaDetails.available },
              { label: "Application steps", value: eVisaDetails.applicationSteps },
              { label: "Processing time", value: eVisaDetails.processingTime },
              { label: "Required documents", value: eVisaDetails.requiredDocuments },
            ]} />
            {eVisaDetails.officialLink && (
              <a
                href={eVisaDetails.officialLink}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="tw:inline-flex tw:items-center tw:gap-1.5! tw:mt-3! tw:text-base tw:text-primary tw:font-medium tw:hover:underline"
              >
                Official eVisa portal <ExternalLink className="tw:w-3.5 tw:h-3.5" />
              </a>
            )}
            <div className="tw:mt-3! tw:flex tw:gap-2! tw:p-3! tw:bg-red-50 tw:border tw:border-red-200 tw:rounded-xl tw:text-sm tw:text-red-800">
              <AlertTriangle className="tw:w-4 tw:h-4 tw:flex-shrink-0 tw:mt-0.5!" />
              <p><strong>Beware of unofficial websites.</strong> {eVisaDetails.warnings || "Only apply through the official government eVisa portal. Third-party sites may charge extra fees or be fraudulent."}</p>
            </div>
          </Section>
        )}

        {/* G. Visa on arrival (detailed) */}
        {hasContent(visaOnArrivalDetails) && (
          <Section title="Visa on Arrival" icon={PlaneLanding}>
            <DetailRows rows={[
              { label: "Available", value: visaOnArrivalDetails.available },
              { label: "Eligible travellers", value: visaOnArrivalDetails.eligibleTravellers },
              { label: "Required documents", value: visaOnArrivalDetails.requiredDocuments },
              { label: "Payment method", value: visaOnArrivalDetails.paymentMethod },
              { label: "Airport / border availability", value: visaOnArrivalDetails.availability },
              { label: "Important notes", value: visaOnArrivalDetails.notes },
            ]} />
          </Section>
        )}

        {/* Required documents */}
        {requiredDocs.length > 0 && (
          <Section title="Required Documents" icon={ClipboardList}>
            <ul className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:gap-2.5!">
              {requiredDocs.map((doc, i) => (
                <li key={i} className="tw:flex tw:items-start tw:gap-2! tw:text-gray-700 tw:text-base">
                  <Check className="tw:w-4 tw:h-4 tw:text-green-500 tw:mt-0.5! tw:flex-shrink-0" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* I. Passport validity requirement */}
        {passportValidityDetail && (
          <Section title="Passport Validity Requirement" icon={BookUser}>
            <p className="tw:text-gray-600 tw:text-base tw:leading-relaxed tw:whitespace-pre-line">{passportValidityDetail}</p>
          </Section>
        )}

        {/* J. Processing time */}
        {processingTimeDetail && (
          <Section title="Processing Time" icon={Timer}>
            <p className="tw:text-gray-600 tw:text-base tw:leading-relaxed tw:whitespace-pre-line">{processingTimeDetail}</p>
          </Section>
        )}

        {/* K. Approximate fees disclaimer */}
        {country.approximateVisaFee && (
          <Section title="Approximate Fees" icon={Coins}>
            <p className="tw:text-gray-700 tw:text-base tw:mb-2!">
              Approximate visa fee: <strong>{country.approximateVisaFee}</strong>
            </p>
            <p className="tw:text-sm tw:text-gray-500 tw:bg-gray-50 tw:p-3! tw:rounded-xl">
              Fees can change depending on nationality, visa type and application method. Always confirm on the official government or embassy website.
            </p>
          </Section>
        )}

        {/* L. Application steps */}
        {applicationSteps.length > 0 && (
          <Section title="Application Steps" icon={ListOrdered}>
            <ol className="tw:space-y-3!">
              {applicationSteps.map((step, i) => (
                <li key={i} className="tw:flex tw:items-start tw:gap-3!">
                  <span className="tw:w-7 tw:h-7 tw:rounded-full tw:bg-primary/15 tw:text-dark-purple tw:text-sm tw:font-bold tw:flex tw:items-center tw:justify-center tw:flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="tw:text-gray-700 tw:text-base tw:pt-0.5!">{step}</span>
                </li>
              ))}
            </ol>
          </Section>
        )}

        {/* Official links */}
        {officialLinks.length > 0 && (
          <Section title="Official Links & Resources" icon={Link2}>
            <div className="tw:grid tw:gap-2!">
              {officialLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="tw:flex tw:items-center tw:justify-between tw:p-3! tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:text-base tw:hover:border-primary/50 tw:transition-colors tw:group"
                >
                  <span className="tw:text-gray-800 tw:group-hover:text-primary">{link.label}</span>
                  <ExternalLink className="tw:w-4 tw:h-4 tw:text-gray-400 tw:group-hover:text-primary" />
                </a>
              ))}
            </div>
          </Section>
        )}

        {/* Travel warnings */}
        {travelWarnings.length > 0 && (
          <Section title="Travel Warnings & Notes" icon={AlertTriangle}>
            <ul className="tw:space-y-2!">
              {travelWarnings.map((w, i) => (
                <li key={i} className="tw:flex tw:items-start tw:gap-2! tw:text-base tw:text-amber-800 tw:bg-amber-50 tw:p-3! tw:rounded-xl">
                  <AlertTriangle className="tw:w-4 tw:h-4 tw:flex-shrink-0 tw:mt-0.5! tw:text-amber-600" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* FAQs */}
        {faqs.length > 0 && (
          <Section title={`Frequently Asked Questions about ${country.countryName} Visa`} icon={HelpCircle}>
            <div className="tw:space-y-3!">
              {faqs.map((faq, i) => (
                <details key={i} className="tw:border tw:border-gray-200 tw:rounded-xl tw:overflow-hidden tw:group">
                  <summary className="tw:px-5! tw:py-4! tw:font-semibold tw:text-dark-purple tw:text-lg tw:cursor-pointer tw:hover:bg-gray-50 tw:list-none tw:flex tw:items-center tw:justify-between">
                    {faq.question}
                    <Plus className="tw:w-4 tw:h-4 tw:text-gray-400 tw:ml-2! tw:flex-shrink-0 tw:transition-transform tw:group-open:rotate-45" />
                  </summary>
                  <div className="tw:px-5! tw:pb-4! tw:text-gray-600 tw:text-base tw:leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </Section>
        )}

        {/* Disclaimer */}
        <div className="tw:mt-8! tw:flex tw:gap-3! tw:p-5! tw:bg-amber-50 tw:border tw:border-amber-200 tw:rounded-2xl tw:text-base tw:text-amber-800">
          <Info className="tw:w-5 tw:h-5 tw:flex-shrink-0 tw:mt-0.5! tw:text-amber-600" />
          <p>
            <strong>Important Disclaimer:</strong> Visa, passport and entry requirements can change at any time. FlyArzan provides this information as a general travel guide only. Travellers should always confirm the latest requirements with the official embassy, immigration authority, airline or government website before booking or travelling.
          </p>
        </div>

        {/* Related travel resources — internal links for SEO + navigation */}
        <Section title="Related Travel Resources" icon={Map}>
          <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-3 tw:gap-3! tw:mt-4!">
            {RELATED_RESOURCES.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className="tw:flex tw:items-center tw:gap-3! tw:p-4! tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:text-base tw:hover:border-primary/50 tw:hover:shadow-sm tw:transition-all tw:group"
              >
                <span className="tw:w-9 tw:h-9 tw:rounded-lg tw:bg-primary/10 tw:text-dark-purple tw:flex tw:items-center tw:justify-center tw:flex-shrink-0">
                  <Icon className="tw:w-5 tw:h-5" />
                </span>
                <span className="tw:text-gray-800 tw:group-hover:text-primary tw:font-medium">{label}</span>
              </Link>
            ))}
          </div>
        </Section>

        {/* Flight search CTA */}
        <div className="tw:mt-8! tw:p-7! tw:bg-gradient-to-br tw:from-dark-purple tw:to-[#1a2a7a] tw:rounded-2xl tw:text-white tw:text-center">
          <p className="tw:font-semibold tw:text-xl tw:mb-2!">Ready to Travel to {country.countryName}?</p>
          <p className="tw:text-white/70 tw:text-base tw:mb-5!">Search and compare flights on FlyArzan for the best deals.</p>
          <Link
            to="/search/flight"
            className="tw:inline-block tw:bg-primary! tw:text-dark-purple! tw:font-semibold tw:px-6! tw:py-2.5! tw:rounded-xl tw:text-base tw:hover:bg-[#6cc0e3]! tw:transition-colors"
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
