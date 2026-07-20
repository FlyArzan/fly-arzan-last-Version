import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChevronRight, Plus, Info, Download } from "lucide-react";
import Header from "../header-footer/Header";
import Footer from "../header-footer/Footer";
import CategoryIcon from "../components/travel/CategoryIcon";
import { useArticleBySlug, useFeaturedArticles } from "../hooks/useArticles";

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";

// Thin white heading bar, no shadow — matches the pattern used on the Travel
// Guides hub/category pages so sidebar sections read consistently site-wide.
const SectionHeadingBar = ({ children }) => (
  <div className="tw:bg-white tw:rounded-xl tw:border tw:border-gray-100 tw:min-h-[52px]! tw:px-4! tw:py-2! tw:mb-3! tw:flex tw:items-center">
    {children}
  </div>
);

const POPULAR_GUIDES = [
  { slug: "airport-guides", label: "Airport Guides" },
  { slug: "destination-guides", label: "Destination Guides" },
  { slug: "flight-booking-tips", label: "Flight Booking Tips" },
  { slug: "baggage-information", label: "Baggage Information" },
];

const ArticlePage = () => {
  const { category, slug } = useParams();
  const { data: article, isLoading, isError } = useArticleBySlug(slug);
  const { data: related = [] } = useFeaturedArticles();
  const bodyRef = useRef(null);

  // Some published articles have links whose visible text is the raw pasted
  // URL (an authoring artifact — the WYSIWYG editor's link tool only prompts
  // for a URL, not display text). Rather than leave that unfixable for
  // already-published content, relabel any such link at render time to just
  // its hostname + an arrow, matching the cleaner link style used elsewhere
  // (e.g. the visa pages' Official Links section).
  useEffect(() => {
    const container = bodyRef.current;
    if (!container) return;
    container.querySelectorAll("a[href]").forEach((link) => {
      const text = link.textContent.trim();
      if (!/^https?:\/\//i.test(text)) return;
      const href = link.getAttribute("href") || "";
      let hostname;
      try {
        hostname = new URL(href).hostname.replace(/^www\./, "");
      } catch {
        return;
      }
      link.textContent = "";
      const label = document.createElement("span");
      label.textContent = hostname;
      link.appendChild(label);
      const arrow = document.createElement("span");
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = " ↗";
      link.appendChild(arrow);
      link.classList.add("article-content-link-cleaned");
      if (!link.hasAttribute("target")) {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      }
    });
  }, [article?.body]);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="container tw:pt-28! tw:md:pt-36! tw:pb-16! tw:animate-pulse">
          <div className="tw:h-8 tw:bg-gray-200 tw:rounded tw:mb-4! tw:w-3/4" />
          <div className="tw:h-64 tw:bg-gray-100 tw:rounded-2xl tw:mb-6!" />
          <div className="tw:space-y-3!">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`tw:h-4 tw:bg-gray-100 tw:rounded tw:${i % 4 === 3 ? "w-2/3" : "w-full"}`} />
            ))}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (isError || !article) {
    return (
      <>
        <Helmet>
          <title>Article Not Found | FlyArzan</title>
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <Header />
        <div className="container tw:pt-28! tw:md:pt-36! tw:pb-20! tw:text-center">
          <h1 className="tw:text-2xl tw:font-bold tw:text-dark-purple tw:mb-3!">Article Not Found</h1>
          <p className="tw:text-gray-500 tw:mb-6!">This article may have been moved or removed.</p>
          <Link to="/travel-guides" className="tw:text-primary tw:font-medium tw:hover:underline">
            ← Back to Travel Guides
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const articleCategory = article.articleCategory?.[0];
  // Canonicalise to the article's TRUE category, not the URL's :category segment.
  // The article is fetched by slug alone, so any category prefix renders it;
  // pinning the canonical to the real category avoids duplicate-content variants.
  const catSlug = articleCategory?.slug || category || "general-travel-advice";
  const pageUrl = `https://flyarzan.com/travel-guides/${catSlug}/${article.slug}`;
  const faqs = Array.isArray(article.faqs) ? article.faqs : [];
  // Prefer the editor-chosen related articles (stored as {slug,title,categorySlug}
  // objects). Fall back to featured articles when none are set.
  const relatedManual = Array.isArray(article.relatedArticles)
    ? article.relatedArticles.filter((r) => r && r.slug && r.slug !== article.slug)
    : [];
  const relatedFiltered =
    relatedManual.length > 0
      ? relatedManual.slice(0, 6).map((r) => ({
          id: r.slug,
          slug: r.slug,
          title: r.title || r.slug,
          readingTime: r.readingTime,
          articleCategory: r.categorySlug ? [{ slug: r.categorySlug }] : [],
        }))
      : related.filter((r) => r.slug !== article.slug).slice(0, 6);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.shortSummary || "",
    author: { "@type": "Organization", name: article.authorName || "Fly Arzan Travel Team" },
    publisher: { "@type": "Organization", name: "FlyArzan", url: "https://flyarzan.com" },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    url: pageUrl,
    ...(article.featuredImage && { image: article.featuredImage }),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://flyarzan.com" },
      { "@type": "ListItem", position: 2, name: "Travel Guides", item: "https://flyarzan.com/travel-guides" },
      ...(articleCategory ? [{ "@type": "ListItem", position: 3, name: articleCategory.name, item: `https://flyarzan.com/travel-guides/${catSlug}` }] : []),
      { "@type": "ListItem", position: articleCategory ? 4 : 3, name: article.title, item: pageUrl },
    ],
  };

  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  } : null;

  return (
    <>
      <Helmet>
        <title>{article.metaTitle || `${article.title} | FlyArzan`}</title>
        <meta name="description" content={article.metaDescription || article.shortSummary || ""} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.shortSummary || ""} />
        <meta property="og:url" content={pageUrl} />
        {article.featuredImage && <meta property="og:image" content={article.featuredImage} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
      </Helmet>

      <Header />

      {/* Top padding clears the fixed header; max-w-6xl keeps the article
          column at a comfortable ~800px reading width alongside the sidebar */}
      <article className="container tw:pt-28! tw:md:pt-36! tw:pb-12! tw:flex tw:flex-col tw:lg:flex-row tw:gap-10!">
        {/* Main content */}
        <div className="tw:flex-1 tw:min-w-0">
          {/* Breadcrumb */}
          <nav className="tw:text-sm tw:text-gray-400 tw:mb-6! tw:flex tw:flex-wrap tw:gap-1! tw:items-center">
            <Link to="/" className="tw:hover:text-primary tw:transition-colors">Home</Link>
            <ChevronRight className="tw:w-3.5 tw:h-3.5" />
            <Link to="/travel-guides" className="tw:hover:text-primary tw:transition-colors">Travel Guides</Link>
            {articleCategory && (
              <>
                <ChevronRight className="tw:w-3.5 tw:h-3.5" />
                <Link to={`/travel-guides/${catSlug}`} className="tw:hover:text-primary tw:transition-colors">{articleCategory.name}</Link>
              </>
            )}
            <ChevronRight className="tw:w-3.5 tw:h-3.5" />
            <span className="tw:text-gray-600 tw:truncate tw:max-w-xs">{article.title}</span>
          </nav>

          {/* Header */}
          {articleCategory && (
            <span className="tw:inline-block tw:bg-primary/10 tw:text-dark-purple tw:text-xs tw:font-semibold tw:px-2.5! tw:py-1! tw:rounded-full tw:mb-4! tw:uppercase tw:tracking-wide">
              {articleCategory.name}
            </span>
          )}
          <h1 className="tw:text-4xl tw:md:text-5xl tw:font-bold tw:text-dark-purple tw:leading-tight tw:mb-4!">
            {article.title}
          </h1>
          {article.shortSummary && (
            <p className="tw:text-lg tw:text-gray-600 tw:mb-5! tw:leading-relaxed">{article.shortSummary}</p>
          )}

          <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-4! tw:text-sm tw:text-gray-400 tw:mb-6! tw:pb-6! tw:border-b tw:border-gray-100">
            <span className="tw:font-medium tw:text-gray-600">{article.authorName || "Fly Arzan Travel Team"}</span>
            {article.publishedAt && (
              <>
                <span>·</span>
                <span>Published {formatDate(article.publishedAt)}</span>
              </>
            )}
            {article.updatedAt && article.updatedAt !== article.publishedAt && (
              <>
                <span>·</span>
                <span>Updated {formatDate(article.updatedAt)}</span>
              </>
            )}
            {article.readingTime && (
              <>
                <span>·</span>
                <span>{article.readingTime} min read</span>
              </>
            )}
          </div>

          {/* Featured image */}
          {article.featuredImage && (
            <img
              src={article.featuredImage}
              alt={article.imageAlt || article.title}
              width="800"
              height="384"
              className="tw:w-full! tw:h-96! tw:object-cover! tw:rounded-2xl! tw:mb-8!"
            />
          )}

          {/* Article body — a rich-text article, or an embedded PDF viewer +
              download link for PDF-type articles */}
          {article.articleType === "pdf" && article.pdfFile ? (
            <div className="tw:mb-8!">
              <div className="tw:rounded-2xl! tw:overflow-hidden! tw:border tw:border-gray-200 tw:mb-4!">
                <iframe
                  src={article.pdfFile}
                  title={article.title}
                  className="tw:w-full! tw:h-[80vh]! tw:border-0!"
                />
              </div>
              <a
                href={article.pdfFile}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="tw:inline-flex tw:items-center tw:gap-2! tw:bg-primary! tw:text-dark-purple! tw:font-semibold tw:px-5! tw:py-2.5! tw:rounded-xl tw:text-sm tw:hover:bg-[#6cc0e3]! tw:transition-colors"
              >
                <Download className="tw:w-4 tw:h-4" /> Download PDF
              </a>
            </div>
          ) : article.body ? (
            <div
              ref={bodyRef}
              className="article-content"
              dangerouslySetInnerHTML={{ __html: article.body }}
            />
          ) : (
            // Defensive fallback: `body` is nullable (PDF-type articles store
            // their content in `pdfFile` instead), so this only renders if a
            // "pdf" article somehow has no pdfFile — otherwise unreachable.
            <p className="tw:text-gray-400 tw:italic tw:mb-8!">
              This article has no content yet.
            </p>
          )}

          {/* FAQs */}
          {faqs.length > 0 && (
            <section className="tw:mt-10!">
              <h2 className="tw:text-2xl tw:font-bold tw:text-dark-purple tw:mb-5!">Frequently Asked Questions</h2>
              <div className="tw:space-y-4!">
                {faqs.map((faq, i) => (
                  <details key={i} className="tw:border tw:border-gray-200 tw:rounded-xl tw:overflow-hidden tw:group">
                    <summary className="tw:list-none! tw:[&::-webkit-details-marker]:hidden tw:px-5! tw:py-4! tw:cursor-pointer tw:hover:bg-gray-50 tw:flex! tw:items-center tw:justify-between tw:gap-3!">
                      <span className="tw:font-semibold tw:text-dark-purple tw:text-lg">{faq.question}</span>
                      <Plus className="tw:w-5 tw:h-5 tw:text-dark-purple tw:flex-shrink-0 tw:transition-transform tw:group-open:rotate-45" />
                    </summary>
                    <div className="tw:px-5! tw:pt-3! tw:pb-4! tw:text-gray-600 tw:text-base tw:leading-relaxed tw:border-t tw:border-gray-100">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Disclaimer */}
          <div className="tw:mt-10! tw:flex tw:gap-3! tw:p-4! tw:bg-amber-50 tw:border tw:border-amber-200 tw:rounded-xl tw:text-sm tw:text-amber-800">
            <Info className="tw:w-5 tw:h-5 tw:flex-shrink-0 tw:mt-0.5! tw:text-amber-600" />
            <p><strong>Disclaimer:</strong> Travel information can change at any time. FlyArzan provides this content as a general travel guide only. Always confirm the latest requirements with official sources before booking or travelling.</p>
          </div>

          {/* CTA */}
          <div className="tw:mt-8! tw:p-7! tw:bg-gradient-to-br tw:from-[#3194c4] tw:to-[#1c6993] tw:rounded-2xl tw:text-white tw:text-center">
            <p className="tw:font-semibold tw:text-lg tw:mb-2!">Ready to Book Your Flight?</p>
            <p className="tw:text-white/80 tw:text-sm tw:mb-5!">Search and compare flights on FlyArzan for the best deals.</p>
            <Link
              to="/search/flight"
              className="tw:inline-block tw:bg-white! tw:text-[#1c6993]! tw:font-semibold tw:px-6! tw:py-2.5! tw:rounded-xl tw:text-sm tw:hover:bg-white/90! tw:transition-colors"
            >
              Search Flights
            </Link>
          </div>
        </div>

        {/* Sidebar — stacks below the article on mobile, sticky on desktop */}
        <aside className="tw:w-full tw:lg:w-80 tw:xl:w-96 tw:flex-shrink-0">
          <div className="tw:lg:sticky tw:lg:top-28 tw:space-y-6!">
            {/* Related articles — plain hoverable list, no card chrome */}
            {relatedFiltered.length > 0 && (
              <div>
                <SectionHeadingBar>
                  <h3 className="tw:font-extrabold! tw:text-dark-purple tw:text-base">Related Guides</h3>
                </SectionHeadingBar>
                <div className="tw:space-y-1!">
                  {relatedFiltered.map((r) => {
                    const rc = r.articleCategory?.[0];
                    return (
                      <Link
                        key={r.id}
                        to={`/travel-guides/${rc?.slug || "general-travel-advice"}/${r.slug}`}
                        className="tw:block tw:px-3! tw:py-2.5! tw:rounded-lg tw:hover:bg-gray-50! tw:transition-colors tw:group"
                      >
                        <p className="tw:text-base tw:font-semibold tw:text-gray-800 tw:group-hover:text-primary tw:transition-colors tw:leading-snug tw:line-clamp-2">
                          {r.title}
                        </p>
                        {r.readingTime && (
                          <p className="tw:text-sm tw:text-gray-400 tw:mt-0.5!">{r.readingTime} min read</p>
                        )}
                      </Link>
                    );
                  })}
                </div>
                <Link to="/travel-guides" className="tw:block tw:text-sm tw:text-primary tw:font-semibold tw:mt-2! tw:px-3! tw:hover:underline">
                  View all guides →
                </Link>
              </div>
            )}

            {/* Visa CTA */}
            <div className="tw:bg-primary/5 tw:border tw:border-primary/20 tw:rounded-2xl tw:p-5!">
              <h3 className="tw:font-bold tw:text-dark-purple tw:mb-2!">Visa Information</h3>
              <p className="tw:text-gray-600 tw:text-sm tw:mb-3!">
                Check visa requirements for your destination country.
              </p>
              <Link
                to="/visa-information"
                className="tw:block tw:text-center tw:bg-dark-purple! tw:text-white! tw:text-sm tw:font-medium tw:px-4! tw:py-2! tw:rounded-lg tw:hover:bg-[#000080]! tw:transition-colors"
              >
                Check Visa Requirements
              </Link>
            </div>

            {/* Flight search CTA */}
            <div className="tw:bg-white tw:rounded-2xl tw:border tw:border-gray-100 tw:p-5!">
              <h3 className="tw:font-bold tw:text-dark-purple tw:mb-2!">Find Cheap Flights</h3>
              <p className="tw:text-gray-600 tw:text-sm tw:mb-3!">
                Search and compare flights to your next destination.
              </p>
              <Link
                to="/search/flight"
                className="tw:block tw:text-center tw:bg-primary! tw:text-dark-purple! tw:text-sm tw:font-semibold tw:px-4! tw:py-2! tw:rounded-lg tw:hover:bg-[#6cc0e3]! tw:transition-colors"
              >
                Search Flights
              </Link>
            </div>

            {/* Popular guides — plain hoverable list, no card chrome (same
                pattern as the Travel Guides hub's "Browse Topics") */}
            <div>
              <SectionHeadingBar>
                <h3 className="tw:font-extrabold! tw:text-dark-purple tw:text-base">Popular Guides</h3>
              </SectionHeadingBar>
              <div className="tw:space-y-0.5!">
                {POPULAR_GUIDES.map((g) => (
                  <Link
                    key={g.slug}
                    to={`/travel-guides/${g.slug}`}
                    className="tw:flex tw:items-center tw:gap-2.5! tw:px-3! tw:py-2! tw:rounded-lg tw:text-sm tw:text-gray-600! tw:hover:bg-gray-50! tw:hover:text-dark-purple! tw:transition-colors"
                  >
                    <CategoryIcon slug={g.slug} className="tw:w-4 tw:h-4 tw:text-primary tw:flex-shrink-0" />
                    <span>{g.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </article>

      <Footer />
    </>
  );
};

export default ArticlePage;
