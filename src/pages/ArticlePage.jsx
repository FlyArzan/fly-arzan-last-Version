import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "../header-footer/Header";
import Footer from "../header-footer/Footer";
import { useArticleBySlug, useFeaturedArticles } from "../hooks/useArticles";

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";

const ArticlePage = () => {
  const { category, slug } = useParams();
  const { data: article, isLoading, isError } = useArticleBySlug(slug);
  const { data: related = [] } = useFeaturedArticles();

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="tw:max-w-3xl tw:mx-auto tw:px-4 tw:py-16 tw:animate-pulse">
          <div className="tw:h-8 tw:bg-gray-200 tw:rounded tw:mb-4 tw:w-3/4" />
          <div className="tw:h-64 tw:bg-gray-100 tw:rounded-2xl tw:mb-6" />
          <div className="tw:space-y-3">
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
        <Header />
        <div className="tw:max-w-3xl tw:mx-auto tw:px-4 tw:py-20 tw:text-center">
          <h1 className="tw:text-2xl tw:font-bold tw:text-gray-900 tw:mb-3">Article Not Found</h1>
          <p className="tw:text-gray-500 tw:mb-6">This article may have been moved or removed.</p>
          <Link to="/travel-guides" className="tw:text-blue-600 tw:hover:underline">
            ← Back to Travel Guides
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const articleCategory = article.articleCategory?.[0];
  const catSlug = category || articleCategory?.slug || "general-travel-advice";
  const pageUrl = `https://flyarzan.com/travel-guides/${catSlug}/${article.slug}`;
  const faqs = Array.isArray(article.faqs) ? article.faqs : [];
  const relatedFiltered = related.filter((r) => r.slug !== article.slug).slice(0, 3);

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

      <article className="tw:max-w-7xl tw:mx-auto tw:px-4 tw:py-10 tw:flex tw:gap-10">
        {/* Main content */}
        <div className="tw:flex-1 tw:min-w-0">
          {/* Breadcrumb */}
          <nav className="tw:text-sm tw:text-gray-400 tw:mb-6 tw:flex tw:flex-wrap tw:gap-1 tw:items-center">
            <Link to="/" className="tw:hover:text-blue-600">Home</Link>
            <span>›</span>
            <Link to="/travel-guides" className="tw:hover:text-blue-600">Travel Guides</Link>
            {articleCategory && (
              <>
                <span>›</span>
                <Link to={`/travel-guides/${catSlug}`} className="tw:hover:text-blue-600">{articleCategory.name}</Link>
              </>
            )}
            <span>›</span>
            <span className="tw:text-gray-600 tw:truncate tw:max-w-xs">{article.title}</span>
          </nav>

          {/* Header */}
          {articleCategory && (
            <span className="tw:inline-block tw:bg-blue-50 tw:text-blue-700 tw:text-xs tw:font-semibold tw:px-2.5 tw:py-1 tw:rounded-full tw:mb-4">
              {articleCategory.name}
            </span>
          )}
          <h1 className="tw:text-3xl tw:md:text-4xl tw:font-bold tw:text-gray-900 tw:leading-tight tw:mb-4">
            {article.title}
          </h1>
          {article.shortSummary && (
            <p className="tw:text-lg tw:text-gray-600 tw:mb-5 tw:leading-relaxed">{article.shortSummary}</p>
          )}

          <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-4 tw:text-sm tw:text-gray-400 tw:mb-6 tw:pb-6 tw:border-b tw:border-gray-100">
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
              className="tw:w-full tw:max-h-96 tw:object-cover tw:rounded-2xl tw:mb-8"
            />
          )}

          {/* Article body */}
          <div
            className="tw:prose tw:prose-gray tw:max-w-none tw:text-gray-700 tw:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />

          {/* FAQs */}
          {faqs.length > 0 && (
            <section className="tw:mt-10">
              <h2 className="tw:text-2xl tw:font-bold tw:text-gray-900 tw:mb-5">Frequently Asked Questions</h2>
              <div className="tw:space-y-4">
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
            </section>
          )}

          {/* Disclaimer */}
          <div className="tw:mt-10 tw:p-4 tw:bg-amber-50 tw:border tw:border-amber-200 tw:rounded-xl tw:text-sm tw:text-amber-800">
            <strong>Disclaimer:</strong> Travel information can change at any time. FlyArzan provides this content as a general travel guide only. Always confirm the latest requirements with official sources before booking or travelling.
          </div>

          {/* CTA */}
          <div className="tw:mt-8 tw:p-6 tw:bg-blue-600 tw:rounded-2xl tw:text-white tw:text-center">
            <p className="tw:font-semibold tw:text-lg tw:mb-2">Ready to Book Your Flight?</p>
            <p className="tw:text-blue-100 tw:text-sm tw:mb-4">Search and compare flights on FlyArzan for the best deals.</p>
            <Link
              to="/search/flight"
              className="tw:inline-block tw:bg-white tw:text-blue-700 tw:font-semibold tw:px-6 tw:py-2.5 tw:rounded-xl tw:text-sm tw:hover:bg-blue-50 tw:transition-colors"
            >
              Search Flights
            </Link>
          </div>
        </div>

        {/* Sidebar — desktop only */}
        <aside className="tw:hidden tw:lg:block tw:w-72 tw:flex-shrink-0">
          <div className="tw:sticky tw:top-24 tw:space-y-6">
            {/* Related articles */}
            {relatedFiltered.length > 0 && (
              <div className="tw:bg-white tw:rounded-2xl tw:border tw:border-gray-100 tw:p-5">
                <h3 className="tw:font-semibold tw:text-gray-900 tw:mb-4">Related Guides</h3>
                <div className="tw:space-y-4">
                  {relatedFiltered.map((r) => {
                    const rc = r.articleCategory?.[0];
                    return (
                      <Link
                        key={r.id}
                        to={`/travel-guides/${rc?.slug || "general-travel-advice"}/${r.slug}`}
                        className="tw:block tw:group"
                      >
                        <p className="tw:text-sm tw:font-medium tw:text-gray-900 tw:group-hover:text-blue-600 tw:transition-colors tw:line-clamp-2">
                          {r.title}
                        </p>
                        {r.readingTime && (
                          <p className="tw:text-xs tw:text-gray-400 tw:mt-0.5">{r.readingTime} min read</p>
                        )}
                      </Link>
                    );
                  })}
                </div>
                <Link to="/travel-guides" className="tw:block tw:text-xs tw:text-blue-600 tw:mt-4 tw:hover:underline">
                  View all guides →
                </Link>
              </div>
            )}

            {/* Visa CTA */}
            <div className="tw:bg-indigo-50 tw:rounded-2xl tw:p-5">
              <h3 className="tw:font-semibold tw:text-indigo-900 tw:mb-2">Visa Information</h3>
              <p className="tw:text-indigo-700 tw:text-sm tw:mb-3">
                Check visa requirements for your destination country.
              </p>
              <Link
                to="/visa-information"
                className="tw:block tw:text-center tw:bg-indigo-600 tw:text-white tw:text-sm tw:font-medium tw:px-4 tw:py-2 tw:rounded-lg tw:hover:bg-indigo-700 tw:transition-colors"
              >
                Check Visa Requirements
              </Link>
            </div>

            {/* Flight search CTA */}
            <div className="tw:bg-blue-50 tw:rounded-2xl tw:p-5">
              <h3 className="tw:font-semibold tw:text-blue-900 tw:mb-2">Find Cheap Flights</h3>
              <p className="tw:text-blue-700 tw:text-sm tw:mb-3">
                Search and compare flights to your next destination.
              </p>
              <Link
                to="/"
                className="tw:block tw:text-center tw:bg-blue-600 tw:text-white tw:text-sm tw:font-medium tw:px-4 tw:py-2 tw:rounded-lg tw:hover:bg-blue-700 tw:transition-colors"
              >
                Search Flights
              </Link>
            </div>
          </div>
        </aside>
      </article>

      <Footer />
    </>
  );
};

export default ArticlePage;
