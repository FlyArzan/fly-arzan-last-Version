import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "../header-footer/Header";
import Footer from "../header-footer/Footer";
import {
  useArticles,
  useArticleCategories,
  useFeaturedArticles,
} from "../hooks/useArticles";

const CATEGORY_ICONS = {
  "travel-news": "📰",
  "travel-blogs": "✍️",
  "travel-tips": "💡",
  "travel-feedback": "💬",
  "travel-guidelines": "📋",
  "airport-guides": "🏢",
  "destination-guides": "🗺️",
  "flight-booking-tips": "✈️",
  "baggage-information": "🧳",
  "travel-restrictions": "🚨",
  "visa-travel-documents": "📄",
  "general-travel-advice": "ℹ️",
};

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

const ArticleListCard = ({ article, categorySlug }) => {
  const cat = article.articleCategory?.[0];
  const catSlug =
    categorySlug && categorySlug !== "all"
      ? categorySlug
      : cat?.slug || "general-travel-advice";
  return (
    <Link
      to={`/travel-guides/${catSlug}/${article.slug}`}
      className="tw:flex tw:gap-4 tw:bg-white tw:rounded-2xl tw:p-4 tw:border tw:border-gray-100 tw:shadow-sm tw:hover:shadow-md tw:hover:border-blue-100 tw:transition-all tw:group tw:items-start"
    >
      {article.featuredImage ? (
        <img
          src={article.featuredImage}
          alt={article.imageAlt || article.title}
          className="tw:w-28 tw:h-20 tw:object-cover tw:rounded-xl tw:flex-shrink-0 tw:group-hover:scale-105 tw:transition-transform tw:duration-300"
          loading="lazy"
        />
      ) : (
        <div className="tw:w-28 tw:h-20 tw:bg-gradient-to-br tw:from-blue-50 tw:to-indigo-100 tw:rounded-xl tw:flex-shrink-0 tw:flex tw:items-center tw:justify-center tw:text-3xl">
          {CATEGORY_ICONS[catSlug] || "✈️"}
        </div>
      )}
      <div className="tw:flex-1 tw:min-w-0">
        {cat && (
          <span className="tw:text-xs tw:font-semibold tw:text-blue-600 tw:uppercase tw:tracking-wide tw:mb-1 tw:block">
            {cat.name}
          </span>
        )}
        <h3 className="tw:font-semibold tw:text-gray-900 tw:text-base tw:leading-snug tw:mb-1.5 tw:group-hover:text-blue-600 tw:transition-colors tw:line-clamp-2">
          {article.title}
        </h3>
        {article.shortSummary && (
          <p className="tw:text-gray-500 tw:text-sm tw:line-clamp-2 tw:mb-2 tw:leading-relaxed">
            {article.shortSummary}
          </p>
        )}
        <div className="tw:flex tw:items-center tw:flex-wrap tw:gap-1.5 tw:text-xs tw:text-gray-400">
          {article.authorName && <span>{article.authorName}</span>}
          {article.readingTime && (
            <>
              {article.authorName && <span>·</span>}
              <span>{article.readingTime} min read</span>
            </>
          )}
          {article.publishedAt && (
            <>
              <span>·</span>
              <span>{formatDate(article.publishedAt)}</span>
            </>
          )}
        </div>
      </div>
      <span className="tw:text-gray-300 tw:group-hover:text-blue-400 tw:transition-colors tw:text-lg tw:hidden tw:sm:block tw:flex-shrink-0 tw:mt-1">
        →
      </span>
    </Link>
  );
};

const SidebarArticleCard = ({ article }) => {
  const cat = article.articleCategory?.[0];
  return (
    <Link
      to={`/travel-guides/${cat?.slug || "general-travel-advice"}/${article.slug}`}
      className="tw:flex tw:gap-3 tw:py-3 tw:border-b tw:border-gray-100 tw:last:border-0 tw:group tw:items-start"
    >
      {article.featuredImage ? (
        <img
          src={article.featuredImage}
          alt={article.imageAlt || article.title}
          className="tw:w-14 tw:h-10 tw:object-cover tw:rounded-lg tw:flex-shrink-0"
          loading="lazy"
        />
      ) : (
        <div className="tw:w-14 tw:h-10 tw:bg-gradient-to-br tw:from-blue-50 tw:to-indigo-100 tw:rounded-lg tw:flex-shrink-0 tw:flex tw:items-center tw:justify-center tw:text-lg">
          {CATEGORY_ICONS[cat?.slug] || "✈️"}
        </div>
      )}
      <div className="tw:min-w-0">
        <p className="tw:text-sm tw:font-medium tw:text-gray-800 tw:line-clamp-2 tw:group-hover:text-blue-600 tw:transition-colors tw:leading-snug">
          {article.title}
        </p>
        {article.readingTime && (
          <p className="tw:text-xs tw:text-gray-400 tw:mt-0.5">
            {article.readingTime} min read
          </p>
        )}
      </div>
    </Link>
  );
};

const LIMIT = 10;

const TravelGuidesCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );
  const page = parseInt(searchParams.get("page") || "0");
  const search = searchParams.get("search") || "";

  const { data: categories = [] } = useArticleCategories();
  const { data: featured = [] } = useFeaturedArticles();
  const isAll = !category || category === "all";
  const catMeta = isAll ? null : categories.find((c) => c.slug === category);

  const { data, isLoading } = useArticles({
    category: isAll ? undefined : category,
    page,
    limit: LIMIT,
    search,
  });

  const articles = data?.articles || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / LIMIT);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ search: searchInput.trim(), page: 0 });
  };

  const handleCatNav = (slug) => {
    if (slug === "all") navigate("/travel-guides");
    else navigate(`/travel-guides/${slug}`);
  };

  const catName = isAll ? "All Articles" : catMeta?.name || category;
  const catDesc = catMeta?.description || "";
  const pageUrl = `https://flyarzan.com/travel-guides${isAll ? "" : `/${category}`}`;

  return (
    <>
      <Helmet>
        <title>{`${catName} | FlyArzan Travel Guides`}</title>
        <meta
          name="description"
          content={
            catDesc ||
            `Browse ${catName} on FlyArzan — your travel information hub.`
          }
        />
        <link rel="canonical" href={pageUrl} />
        <meta
          property="og:title"
          content={`${catName} | FlyArzan Travel Guides`}
        />
        <meta property="og:url" content={pageUrl} />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify({
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
                name: "Travel Guides",
                item: "https://flyarzan.com/travel-guides",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: catName,
                item: pageUrl,
              },
            ],
          })}
        </script>
      </Helmet>

      <Header />

      {/* Hero */}
      <section className="tw:bg-gradient-to-br tw:from-slate-700 tw:to-slate-900 tw:text-white tw:py-12 tw:px-4">
        <div className="tw:max-w-7xl tw:mx-auto tw:px-0 tw:sm:px-2">
          <nav className="tw:text-sm tw:text-slate-400 tw:mb-4 tw:flex tw:items-center tw:flex-wrap tw:gap-1">
            <Link to="/" className="tw:hover:text-white tw:transition-colors">
              Home
            </Link>
            <span className="tw:mx-1">›</span>
            <Link
              to="/travel-guides"
              className="tw:hover:text-white tw:transition-colors"
            >
              Travel Guides
            </Link>
            {!isAll && (
              <>
                <span className="tw:mx-1">›</span>
                <span className="tw:text-white">{catName}</span>
              </>
            )}
          </nav>
          <div className="tw:flex tw:items-center tw:gap-4">
            <span className="tw:text-4xl tw:flex-shrink-0">
              {CATEGORY_ICONS[category] || "📁"}
            </span>
            <div>
              <h1 className="tw:text-3xl tw:md:text-4xl tw:font-bold">
                {catName}
              </h1>
              {catDesc && (
                <p className="tw:text-slate-300 tw:mt-1 tw:text-sm tw:max-w-2xl">
                  {catDesc}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="tw:max-w-7xl tw:mx-auto tw:px-4 tw:sm:px-6 tw:py-10">
        <div className="tw:flex tw:flex-col tw:lg:flex-row tw:gap-8">

          {/* LEFT — 3/4 */}
          <div className="tw:flex-1 tw:min-w-0">

            {/* Category pills — navigate to different category pages */}
            <div className="tw:flex tw:flex-wrap tw:gap-2 tw:mb-6">
              <button
                onClick={() => handleCatNav("all")}
                className={`tw:px-4 tw:py-2 tw:rounded-full tw:text-sm tw:font-medium tw:border tw:transition-all ${
                  isAll
                    ? "tw:bg-blue-600 tw:text-white tw:border-blue-600 tw:shadow-sm"
                    : "tw:bg-white tw:text-gray-600 tw:border-gray-200 tw:hover:border-blue-300 tw:hover:text-blue-600"
                }`}
              >
                All Articles
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCatNav(cat.slug)}
                  className={`tw:px-4 tw:py-2 tw:rounded-full tw:text-sm tw:font-medium tw:border tw:transition-all tw:flex tw:items-center tw:gap-1.5 ${
                    category === cat.slug
                      ? "tw:bg-blue-600 tw:text-white tw:border-blue-600 tw:shadow-sm"
                      : "tw:bg-white tw:text-gray-600 tw:border-gray-200 tw:hover:border-blue-300 tw:hover:text-blue-600"
                  }`}
                >
                  <span>{CATEGORY_ICONS[cat.slug] || "📁"}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="tw:flex tw:gap-2 tw:mb-6">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={`Search ${catName.toLowerCase()}…`}
                className="tw:flex-1 tw:px-4 tw:py-2.5 tw:rounded-xl tw:border tw:border-gray-200 tw:bg-white tw:text-sm tw:outline-none tw:focus:border-blue-400 tw:transition-colors"
              />
              <button
                type="submit"
                className="tw:px-5 tw:py-2.5 tw:bg-blue-600 tw:text-white tw:rounded-xl tw:text-sm tw:font-medium tw:hover:bg-blue-700 tw:transition-colors"
              >
                Search
              </button>
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    setSearchParams({ page: 0 });
                  }}
                  className="tw:px-4 tw:py-2.5 tw:border tw:border-gray-200 tw:bg-white tw:rounded-xl tw:text-sm tw:text-gray-500 tw:hover:bg-gray-50 tw:transition-colors"
                >
                  Clear
                </button>
              )}
            </form>

            {/* Results count */}
            {!isLoading && (
              <p className="tw:text-sm tw:text-gray-400 tw:mb-5">
                {total} {total === 1 ? "article" : "articles"}
                {search && ` matching "${search}"`}
              </p>
            )}

            {/* Article list */}
            {isLoading ? (
              <div className="tw:flex tw:flex-col tw:gap-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="tw:h-24 tw:bg-gray-100 tw:rounded-2xl tw:animate-pulse"
                  />
                ))}
              </div>
            ) : articles.length === 0 ? (
              <div className="tw:text-center tw:py-20 tw:text-gray-400">
                <div className="tw:text-5xl tw:mb-4">
                  {CATEGORY_ICONS[category] || "📁"}
                </div>
                <p className="tw:text-lg tw:font-medium tw:text-gray-700">
                  No articles found
                </p>
                <p className="tw:text-sm tw:mt-1">
                  {search
                    ? "Try a different search term."
                    : "No articles in this category yet. Check back soon."}
                </p>
              </div>
            ) : (
              <div className="tw:flex tw:flex-col tw:gap-4">
                {articles.map((a) => (
                  <ArticleListCard
                    key={a.id}
                    article={a}
                    categorySlug={category}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="tw:flex tw:items-center tw:justify-center tw:gap-2 tw:mt-10">
                <button
                  disabled={page === 0}
                  onClick={() => setSearchParams({ search, page: page - 1 })}
                  className="tw:px-4 tw:py-2 tw:rounded-lg tw:border tw:border-gray-200 tw:bg-white tw:text-sm tw:text-gray-600 tw:hover:bg-gray-50 tw:disabled:opacity-40 tw:disabled:cursor-not-allowed tw:transition-colors"
                >
                  ← Previous
                </button>
                <span className="tw:px-4 tw:py-2 tw:text-sm tw:text-gray-500">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setSearchParams({ search, page: page + 1 })}
                  className="tw:px-4 tw:py-2 tw:rounded-lg tw:border tw:border-gray-200 tw:bg-white tw:text-sm tw:text-gray-600 tw:hover:bg-gray-50 tw:disabled:opacity-40 tw:disabled:cursor-not-allowed tw:transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </div>

          {/* RIGHT — 1/4 sidebar */}
          <aside className="tw:lg:w-72 tw:xl:w-80 tw:flex-shrink-0 tw:space-y-6">

            {/* About this category */}
            {!isAll && catMeta && catMeta.description && (
              <div className="tw:bg-white tw:rounded-2xl tw:border tw:border-gray-100 tw:shadow-sm tw:p-5">
                <h2 className="tw:text-base tw:font-bold tw:text-gray-900 tw:mb-2">
                  About this category
                </h2>
                <p className="tw:text-sm tw:text-gray-500 tw:leading-relaxed">
                  {catMeta.description}
                </p>
                {catMeta.articleCount > 0 && (
                  <p className="tw:mt-3 tw:text-sm tw:text-blue-600 tw:font-medium">
                    {catMeta.articleCount}{" "}
                    {catMeta.articleCount === 1 ? "article" : "articles"}{" "}
                    published
                  </p>
                )}
              </div>
            )}

            {/* Popular Reads */}
            {featured.length > 0 && (
              <div className="tw:bg-white tw:rounded-2xl tw:border tw:border-gray-100 tw:shadow-sm tw:p-5">
                <h2 className="tw:text-base tw:font-bold tw:text-gray-900 tw:mb-4 tw:flex tw:items-center tw:gap-2">
                  <span>🔥</span> Popular Reads
                </h2>
                {featured.slice(0, 4).map((a) => (
                  <SidebarArticleCard key={a.id} article={a} />
                ))}
              </div>
            )}

            {/* Other Topics */}
            {categories.length > 0 && (
              <div className="tw:bg-white tw:rounded-2xl tw:border tw:border-gray-100 tw:shadow-sm tw:p-5">
                <h2 className="tw:text-base tw:font-bold tw:text-gray-900 tw:mb-3">
                  Other Topics
                </h2>
                <div className="tw:space-y-0.5">
                  {categories
                    .filter((c) => c.slug !== category)
                    .map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/travel-guides/${cat.slug}`}
                        className="tw:flex tw:items-center tw:justify-between tw:px-3 tw:py-2 tw:rounded-lg tw:text-sm tw:text-gray-600 tw:hover:bg-gray-50 tw:hover:text-gray-900 tw:transition-colors"
                      >
                        <span className="tw:flex tw:items-center tw:gap-2">
                          <span>{CATEGORY_ICONS[cat.slug] || "📁"}</span>
                          <span>{cat.name}</span>
                        </span>
                        {cat.articleCount > 0 && (
                          <span className="tw:text-xs tw:bg-gray-100 tw:text-gray-500 tw:rounded-full tw:px-2 tw:py-0.5 tw:flex-shrink-0">
                            {cat.articleCount}
                          </span>
                        )}
                      </Link>
                    ))}
                </div>
              </div>
            )}

            {/* Flight CTA */}
            <div className="tw:bg-gradient-to-br tw:from-blue-600 tw:to-indigo-700 tw:rounded-2xl tw:p-5 tw:text-white">
              <div className="tw:text-3xl tw:mb-3">✈️</div>
              <h2 className="tw:text-base tw:font-bold tw:mb-2">
                Find Cheap Flights
              </h2>
              <p className="tw:text-blue-100 tw:text-sm tw:mb-4 tw:leading-relaxed">
                Compare flights from hundreds of airlines and find the best
                travel deals.
              </p>
              <Link
                to="/search/flight"
                className="tw:block tw:text-center tw:bg-white tw:text-blue-700 tw:font-semibold tw:rounded-xl tw:px-4 tw:py-2.5 tw:text-sm tw:hover:bg-blue-50 tw:transition-colors"
              >
                Search Flights
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default TravelGuidesCategory;
