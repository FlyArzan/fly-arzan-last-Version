import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search, ArrowRight, Plane, FileText } from "lucide-react";
import Header from "../header-footer/Header";
import Footer from "../header-footer/Footer";
import CategoryIcon from "../components/travel/CategoryIcon";
import {
  useArticles,
  useArticleCategories,
  useFeaturedArticles,
  useHighlightedArticles,
} from "../hooks/useArticles";

// Full-width, thin, no-shadow section heading used across the wide content
// sections (All Articles, Highlights) so every section reads as
// clearly separated instead of a plain line of bold text.
const SectionHeadingBar = ({ children, right }) => (
  <div className="tw:bg-white tw:rounded-xl tw:border tw:border-gray-100 tw:min-h-[52px]! tw:px-4! tw:py-2! tw:mb-4! tw:flex tw:items-center tw:justify-between tw:gap-3! tw:flex-wrap">
    {children}
    {right}
  </div>
);

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

const ArticleListCard = ({ article }) => {
  const cat = article.articleCategory?.[0];
  return (
    <Link
      to={`/travel-guides/${cat?.slug || "general-travel-advice"}/${article.slug}`}
      className="tw:flex tw:gap-4! tw:py-5! tw:border-b tw:border-gray-100 tw:last:border-0 tw:group tw:items-start"
    >
      {article.featuredImage ? (
        <img
          src={article.featuredImage}
          alt={article.imageAlt || article.title}
          className="tw:w-56! tw:h-44! tw:object-cover! tw:rounded-xl! tw:flex-shrink-0! tw:group-hover:scale-105 tw:transition-transform tw:duration-300"
          loading="lazy"
        />
      ) : (
        <div className="tw:w-56! tw:h-44! tw:bg-primary/10 tw:text-dark-purple tw:rounded-xl! tw:flex-shrink-0! tw:flex tw:items-center tw:justify-center">
          <CategoryIcon slug={cat?.slug} className="tw:w-8 tw:h-8" />
        </div>
      )}
      <div className="tw:flex-1 tw:min-w-0">
        {cat && (
          <span className="tw:text-xs tw:font-semibold tw:text-primary tw:uppercase tw:tracking-wide tw:mb-1! tw:block">
            {cat.name}
          </span>
        )}
        <h3 className="tw:font-semibold tw:text-dark-purple tw:text-lg tw:leading-snug tw:mb-1.5! tw:group-hover:text-primary tw:transition-colors tw:line-clamp-2!">
          {article.title}
        </h3>
        {article.shortSummary && (
          <p className="tw:text-gray-500 tw:text-base tw:line-clamp-2! tw:mb-2! tw:leading-relaxed">
            {article.shortSummary}
          </p>
        )}
        <div className="tw:flex tw:items-center tw:flex-wrap tw:gap-1.5! tw:text-xs tw:text-gray-400">
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
      <ArrowRight className="tw:w-5 tw:h-5 tw:text-gray-300 tw:group-hover:text-primary tw:transition-colors tw:hidden tw:sm:block tw:flex-shrink-0 tw:mt-1!" />
    </Link>
  );
};

// `compact` (used by the Highlights section) clamps the description to 2
// lines instead of 3 — everything else about the card stays identical, so it
// only looks smaller because Highlights sits in a narrower column.
const FeaturedCard = ({ article, compact = false }) => {
  const cat = article.articleCategory?.[0];
  return (
    <Link
      to={`/travel-guides/${cat?.slug || "general-travel-advice"}/${article.slug}`}
      className="tw:flex tw:flex-col tw:group"
    >
      {article.featuredImage ? (
        <img
          src={article.featuredImage}
          alt={article.imageAlt || article.title}
          width="400"
          height="200"
          loading="lazy"
          className="tw:w-full! tw:h-56! tw:object-cover! tw:rounded-2xl! tw:mb-3! tw:group-hover:scale-105 tw:transition-transform tw:duration-300"
        />
      ) : (
        <div className="tw:w-full! tw:h-56! tw:bg-primary/10 tw:text-dark-purple tw:rounded-2xl! tw:mb-3! tw:flex tw:items-center tw:justify-center">
          <CategoryIcon slug={cat?.slug} className="tw:w-12 tw:h-12" />
        </div>
      )}
      <div className="tw:flex tw:flex-col tw:flex-1">
        {cat && (
          <span className="tw:text-xs tw:font-semibold tw:text-primary tw:uppercase tw:tracking-wide tw:mb-2! tw:block">
            {cat.name}
          </span>
        )}
        <h3 className="tw:font-bold tw:text-dark-purple tw:text-xl tw:leading-snug tw:mb-2! tw:group-hover:text-primary tw:transition-colors tw:line-clamp-2!">
          {article.title}
        </h3>
        {article.shortSummary && (
          // line-clamp-N alone isn't reliable here: this paragraph is a flex
          // item (flex-1 pushed it to grow so "Read more" aligns across a
          // row), and -webkit-line-clamp inside a growing flex item lets an
          // extra line leak past the clip in some browsers. An explicit
          // maxHeight (N lines * leading-relaxed's 1.625 line-height) hard-
          // caps the box so the leak is physically impossible.
          <p
            className={`tw:text-gray-500 tw:text-base tw:mb-3! tw:leading-relaxed tw:overflow-hidden! ${compact ? "tw:line-clamp-2!" : "tw:line-clamp-3!"}`}
            style={{ maxHeight: compact ? "3.25em" : "4.875em" }}
          >
            {article.shortSummary}
          </p>
        )}
        <div className="tw:flex tw:items-center tw:flex-wrap tw:gap-1.5! tw:text-xs tw:text-gray-400 tw:mb-3!">
          {article.readingTime && <span>{article.readingTime} min read</span>}
          {article.readingTime && article.publishedAt && <span>·</span>}
          {article.publishedAt && <span>{formatDate(article.publishedAt)}</span>}
        </div>
        <span className="tw:inline-flex tw:items-center tw:gap-1! tw:text-sm tw:font-semibold tw:text-primary tw:mt-auto!">
          Read more <ArrowRight className="tw:w-4 tw:h-4 tw:group-hover:translate-x-0.5 tw:transition-transform" />
        </span>
      </div>
    </Link>
  );
};

// Matches FeaturedCard's shape (image + label + title + summary) so the
// swap from skeleton to real content doesn't shift layout.
const FeaturedCardSkeleton = () => (
  <div className="tw:animate-pulse">
    <div className="tw:w-full tw:h-56 tw:bg-gray-200/70 tw:rounded-2xl tw:mb-3!" />
    <div className="tw:h-3 tw:w-20 tw:bg-gray-200/70 tw:rounded tw:mb-2!" />
    <div className="tw:h-5 tw:w-full tw:bg-gray-200/70 tw:rounded tw:mb-2!" />
    <div className="tw:h-4 tw:w-full tw:bg-gray-200/70 tw:rounded tw:mb-1.5!" />
    <div className="tw:h-4 tw:w-2/3 tw:bg-gray-200/70 tw:rounded" />
  </div>
);

// Matches SidebarArticleCard's shape.
const SidebarCardSkeleton = () => (
  <div className="tw:animate-pulse">
    <div className="tw:w-full tw:h-32 tw:bg-gray-200/70 tw:rounded-xl! tw:mb-2.5!" />
    <div className="tw:h-4 tw:w-full tw:bg-gray-200/70 tw:rounded tw:mb-1.5!" />
    <div className="tw:h-3 tw:w-1/2 tw:bg-gray-200/70 tw:rounded" />
  </div>
);

const SidebarArticleCard = ({ article }) => {
  const cat = article.articleCategory?.[0];
  return (
    <Link
      to={`/travel-guides/${cat?.slug || "general-travel-advice"}/${article.slug}`}
      className="tw:flex tw:flex-col tw:group"
    >
      {article.featuredImage ? (
        <img
          src={article.featuredImage}
          alt={article.imageAlt || article.title}
          className="tw:w-full! tw:h-32! tw:object-cover! tw:rounded-xl! tw:mb-2.5! tw:group-hover:scale-105 tw:transition-transform tw:duration-300"
          loading="lazy"
        />
      ) : (
        <div className="tw:w-full! tw:h-32! tw:bg-primary/10 tw:text-dark-purple tw:rounded-xl! tw:mb-2.5! tw:flex tw:items-center tw:justify-center">
          <CategoryIcon slug={cat?.slug} className="tw:w-7 tw:h-7" />
        </div>
      )}
      <p className="tw:text-sm tw:font-semibold tw:text-gray-800 tw:line-clamp-2! tw:group-hover:text-primary tw:transition-colors tw:leading-snug">
        {article.title}
      </p>
      {article.shortSummary && (
        <p className="tw:text-xs tw:text-gray-500 tw:line-clamp-2! tw:mt-1! tw:leading-relaxed">
          {article.shortSummary}
        </p>
      )}
      <div className="tw:flex tw:items-center tw:flex-wrap tw:gap-1! tw:text-xs tw:text-gray-400 tw:mt-1.5!">
        {article.authorName && <span>{article.authorName}</span>}
        {article.readingTime && (
          <>
            {article.authorName && <span>·</span>}
            <span>{article.readingTime} min read</span>
          </>
        )}
        {article.publishedAt && (
          <>
            {(article.authorName || article.readingTime) && <span>·</span>}
            <span>{formatDate(article.publishedAt)}</span>
          </>
        )}
      </div>
    </Link>
  );
};

const LIMIT = 10;

const PAGE_URL = "https://flyarzan.com/travel-guides";
const PAGE_DESCRIPTION =
  "Find helpful travel articles, visa information, airport guides, destination tips, baggage advice and flight booking guidance in one place.";

const TravelGuidesHub = () => {
  const [activeCat, setActiveCat] = useState("all");
  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const { data: categories = [], isLoading: catLoading } = useArticleCategories();
  const { data: featured = [], isLoading: featuredLoading } = useFeaturedArticles();
  const { data: highlights = [], isLoading: highlightsLoading } = useHighlightedArticles();
  const { data, isLoading } = useArticles({
    category: activeCat !== "all" ? activeCat : undefined,
    page,
    limit: LIMIT,
  });

  const articles = data?.articles || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / LIMIT);

  // All the page's sections load from independent parallel queries. Letting
  // each one pop in whenever it happens to resolve causes the page to keep
  // reflowing during initial load. Instead, wait for everything at once (a
  // "Promise.all" over the hooks) and show matching skeletons meanwhile, so
  // the layout settles once instead of piece by piece. Once ready, it stays
  // ready — later filter/pagination-triggered reloads use the article list's
  // own local skeleton instead of hiding the whole page again.
  const initialLoading = catLoading || featuredLoading || highlightsLoading || isLoading;
  const [pageReady, setPageReady] = useState(false);
  useEffect(() => {
    if (!initialLoading) setPageReady(true);
  }, [initialLoading]);

  const handleCatFilter = (slug) => {
    setActiveCat(slug);
    setPage(0);
  };

  const activeLabel =
    activeCat === "all"
      ? "All Articles"
      : categories.find((c) => c.slug === activeCat)?.name || "All Articles";

  // Brand-aligned select (chevron drawn via inline SVG; explicit dark text so
  // the legacy cascade can't wash it out).
  const selectClass =
    "tw:h-9 tw:pl-3.5! tw:pr-8! tw:rounded-lg tw:border tw:border-gray-200 tw:bg-white! tw:text-sm tw:font-medium tw:outline-none tw:focus:border-primary tw:focus:ring-2 tw:focus:ring-primary/20 tw:appearance-none tw:bg-no-repeat tw:cursor-pointer";
  const selectStyle = {
    color: "#374151",
    backgroundColor: "#ffffff",
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
    backgroundPosition: "right 0.75rem center",
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const q = searchInput.trim();
    if (q) {
      navigate(`/travel-guides/all?search=${encodeURIComponent(q)}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>Travel Guides, Tips & Useful Travel Information | FlyArzan</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Travel Guides, Tips & Useful Travel Information | FlyArzan" />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "FlyArzan Travel Guides",
          description: PAGE_DESCRIPTION,
          url: PAGE_URL,
        })}</script>
      </Helmet>

      <Header />

      {/* Hero — soft brand banner (cyan→teal); top padding clears the fixed header */}
      <section className="tw:bg-gradient-to-br tw:from-[#3194c4] tw:to-[#1c6993] tw:text-white tw:pt-28! tw:md:pt-36! tw:pb-16! tw:px-4!">
        <div className="container tw:text-center">
          <h1 className="tw:text-4xl tw:md:text-5xl tw:font-bold tw:mb-4! tw:leading-tight">
            Travel Guides &amp; Useful Travel Information
          </h1>
          <p className="tw:text-white/75 tw:text-lg tw:max-w-2xl tw:mx-auto! tw:mb-8! tw:leading-relaxed">
            {PAGE_DESCRIPTION}
          </p>
          <form
            onSubmit={handleHeroSearch}
            className="tw:flex tw:gap-3! tw:max-w-4xl tw:mx-auto!"
          >
            <div className="tw:relative tw:flex-1">
              <Search className="tw:absolute tw:left-4 tw:top-1/2 tw:-translate-y-1/2 tw:w-5 tw:h-5 tw:text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search travel guides, airport information, visa tips…"
                style={{ color: "#111827", backgroundColor: "#ffffff" }}
                className="tw:w-full tw:pl-12! tw:pr-5! tw:py-4! tw:rounded-xl tw:bg-white! tw:text-gray-900! tw:placeholder:text-gray-400 tw:text-base tw:outline-none tw:border tw:border-transparent tw:focus:border-primary tw:focus:ring-2 tw:focus:ring-primary/30 tw:shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="tw:px-8! tw:py-4! tw:bg-dark-purple! tw:text-white! tw:font-semibold tw:rounded-xl tw:hover:bg-[#000080]! tw:transition-colors tw:text-base tw:flex-shrink-0"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Subtle primary tint behind the whole content area so white cards pop */}
      <div className="tw:bg-[#f3fafd]!">

      {/* Featured Articles — highlighted cards below the hero */}
      {!pageReady ? (
        <section className="container tw:pt-12!">
          <div className="tw:h-7 tw:w-48 tw:bg-gray-200/70 tw:rounded tw:mb-6! tw:animate-pulse" />
          <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:lg:grid-cols-3 tw:gap-5!">
            {[...Array(3)].map((_, i) => <FeaturedCardSkeleton key={i} />)}
          </div>
        </section>
      ) : (
        featured.length > 0 && (
          <section className="container tw:pt-12!">
            <div className="tw:flex tw:items-center tw:justify-between tw:gap-3! tw:flex-wrap tw:mb-6!">
              <div className="tw:flex tw:items-center tw:gap-2!">
                <h2 className="tw:text-2xl tw:font-extrabold! tw:text-dark-purple">Featured Articles</h2>
              </div>
              <Link
                to="/travel-guides/all"
                className="tw:inline-flex tw:items-center tw:gap-1.5! tw:text-sm tw:font-semibold tw:text-primary! tw:bg-white! tw:border tw:border-gray-200 tw:rounded-full tw:px-4! tw:py-2! tw:hover:border-primary/40 tw:hover:bg-gray-50! tw:transition-colors"
              >
                View All <ArrowRight className="tw:w-4 tw:h-4" />
              </Link>
            </div>
            <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:lg:grid-cols-3 tw:gap-5!">
              {featured.slice(0, 6).map((a) => (
                <FeaturedCard key={a.id} article={a} />
              ))}
            </div>
          </section>
        )
      )}

      <main className="container tw:py-12!">
        <div className="tw:flex tw:flex-col tw:lg:flex-row tw:gap-8!">

          {/* LEFT — 3/4 */}
          <div className="tw:flex-1 tw:min-w-0">

            {/* Section heading — thin white bar, no shadow: heading + count on
                the left, category filter on the right (top pills removed per
                feedback; the right-sidebar quick links remain) */}
            <SectionHeadingBar
              right={
                <div className="tw:relative">
                  <label htmlFor="cat-filter" className="tw:sr-only">
                    Filter by category
                  </label>
                  <select
                    id="cat-filter"
                    value={activeCat}
                    onChange={(e) => handleCatFilter(e.target.value)}
                    className={selectClass}
                    style={selectStyle}
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              }
            >
              <h2 className="tw:text-xl tw:font-bold! tw:text-dark-purple">
                {activeLabel}
                {!isLoading && total > 0 && (
                  <span className="tw:text-gray-400 tw:font-normal tw:text-base tw:ml-2!">
                    ({total})
                  </span>
                )}
              </h2>
            </SectionHeadingBar>

            {/* Article list */}
            {isLoading ? (
              <div className="tw:flex tw:flex-col tw:gap-4!">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="tw:h-24 tw:bg-gray-100 tw:rounded-2xl tw:animate-pulse"
                  />
                ))}
              </div>
            ) : articles.length === 0 ? (
              <div className="tw:text-center tw:py-20!">
                <Plane className="tw:w-12 tw:h-12 tw:text-gray-300 tw:mx-auto! tw:mb-4!" />
                <p className="tw:text-lg tw:font-medium tw:text-gray-700">
                  No articles found
                </p>
                <p className="tw:text-sm tw:text-gray-400 tw:mt-1!">
                  {activeCat !== "all"
                    ? "No articles in this category yet. Check back soon."
                    : "Travel articles coming soon."}
                </p>
                {activeCat !== "all" && (
                  <button
                    onClick={() => handleCatFilter("all")}
                    className="tw:mt-4! tw:text-primary tw:text-sm tw:font-medium tw:hover:underline"
                  >
                    View all articles
                  </button>
                )}
              </div>
            ) : (
              <div className="tw:flex tw:flex-col">
                {articles.map((a) => (
                  <ArticleListCard key={a.id} article={a} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="tw:flex tw:items-center tw:justify-center tw:gap-2! tw:mt-10!">
                <button
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                  className="tw:px-4! tw:py-2! tw:rounded-lg tw:border tw:border-gray-200 tw:bg-white! tw:text-sm tw:text-gray-600! tw:hover:bg-gray-50! tw:disabled:opacity-40 tw:disabled:cursor-not-allowed tw:transition-colors"
                >
                  ← Previous
                </button>
                <span className="tw:px-4! tw:py-2! tw:text-sm tw:text-gray-500">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(page + 1)}
                  className="tw:px-4! tw:py-2! tw:rounded-lg tw:border tw:border-gray-200 tw:bg-white! tw:text-sm tw:text-gray-600! tw:hover:bg-gray-50! tw:disabled:opacity-40 tw:disabled:cursor-not-allowed tw:transition-colors"
                >
                  Next →
                </button>
              </div>
            )}

            {/* Highlights — admin-curated (highlighted: true),
                same top-image/bottom-text style as Featured Articles.
                Replaces the old "Browse by Topic" grid, which duplicated the
                sidebar's "Browse Topics" list; category browsing now lives
                in exactly one place. Heading always renders (with an empty
                state when nothing's curated yet) instead of the section
                appearing/disappearing once data loads. */}
            <section className="tw:mt-10!">
              <SectionHeadingBar>
                <h2 className="tw:text-xl tw:font-extrabold! tw:text-dark-purple">
                  Highlights
                </h2>
              </SectionHeadingBar>
              {!pageReady ? (
                <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:lg:grid-cols-3 tw:gap-5!">
                  {[...Array(3)].map((_, i) => <FeaturedCardSkeleton key={i} />)}
                </div>
              ) : highlights.length > 0 ? (
                <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:lg:grid-cols-3 tw:gap-5!">
                  {highlights.slice(0, 6).map((a) => (
                    <FeaturedCard key={a.id} article={a} compact />
                  ))}
                </div>
              ) : (
                <p className="tw:text-sm tw:text-gray-400 tw:py-6! tw:text-center">
                  No articles curated here yet. Check back soon.
                </p>
              )}
            </section>
          </div>

          {/* RIGHT — narrower sidebar; the main column's images stay the
              visually dominant ones, sidebar is a compact companion */}
          <aside className="tw:lg:w-72 tw:xl:w-80 tw:flex-shrink-0 tw:space-y-8!">

            {/* Popular Reads — plain image + text, no card chrome */}
            {!pageReady ? (
              <div>
                <SectionHeadingBar>
                  <h2 className="tw:text-base tw:font-extrabold! tw:text-dark-purple">
                    Popular Reads
                  </h2>
                </SectionHeadingBar>
                <div className="tw:space-y-5!">
                  {[...Array(6)].map((_, i) => <SidebarCardSkeleton key={i} />)}
                </div>
              </div>
            ) : (
              featured.length > 0 && (
                <div>
                  <SectionHeadingBar>
                    <h2 className="tw:text-base tw:font-extrabold! tw:text-dark-purple">
                      Popular Reads
                    </h2>
                  </SectionHeadingBar>
                  <div className="tw:space-y-5!">
                    {featured.slice(0, 6).map((a) => (
                      <SidebarArticleCard key={a.id} article={a} />
                    ))}
                  </div>
                </div>
              )
            )}

            {/* Browse Topics — plain hoverable list, no card chrome */}
            {!pageReady ? (
              <div>
                <SectionHeadingBar>
                  <h2 className="tw:text-base tw:font-bold! tw:text-dark-purple">
                    Browse Topics
                  </h2>
                </SectionHeadingBar>
                <div className="tw:space-y-2! tw:animate-pulse">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="tw:h-9 tw:bg-gray-200/70 tw:rounded-lg" />
                  ))}
                </div>
              </div>
            ) : (
              categories.length > 0 && (
              <div>
                <SectionHeadingBar>
                  <h2 className="tw:text-base tw:font-bold! tw:text-dark-purple">
                    Browse Topics
                  </h2>
                </SectionHeadingBar>
                <div className="tw:space-y-0.5!">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCatFilter(cat.slug)}
                      className={`tw:w-full tw:flex tw:items-center tw:justify-between tw:px-3! tw:py-2! tw:rounded-lg tw:text-sm tw:transition-colors tw:text-left ${
                        activeCat === cat.slug
                          ? "tw:bg-primary/10! tw:text-dark-purple! tw:font-medium"
                          : "tw:text-gray-600! tw:hover:bg-white! tw:hover:text-dark-purple!"
                      }`}
                    >
                      <span className="tw:flex tw:items-center tw:gap-2!">
                        <CategoryIcon slug={cat.slug} className="tw:w-4 tw:h-4" />
                        <span>{cat.name}</span>
                      </span>
                      {cat.articleCount > 0 && (
                        <span className="tw:text-xs tw:bg-primary! tw:text-white! tw:font-bold tw:rounded-full tw:px-2! tw:py-0.5! tw:flex-shrink-0">
                          {cat.articleCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              )
            )}

            {/* Flight CTA */}
            <div className="tw:bg-gradient-to-br tw:from-[#3194c4] tw:to-[#1c6993] tw:rounded-2xl tw:p-5! tw:text-white">
              <span className="tw:inline-flex tw:w-11 tw:h-11 tw:rounded-xl tw:bg-white/15 tw:items-center tw:justify-center tw:mb-3!">
                <Plane className="tw:w-5 tw:h-5 tw:text-white" />
              </span>
              <h2 className="tw:text-base tw:font-bold tw:mb-2!">
                Find Cheap Flights
              </h2>
              <p className="tw:text-white/80 tw:text-sm tw:mb-4! tw:leading-relaxed">
                Compare flights from hundreds of airlines and find the best
                travel deals.
              </p>
              <Link
                to="/"
                className="tw:block tw:text-center tw:bg-white! tw:text-[#1c6993]! tw:font-semibold tw:rounded-xl tw:px-4! tw:py-2.5! tw:text-sm tw:hover:bg-white/90! tw:transition-colors"
              >
                Search Flights
              </Link>
            </div>

            {/* Visa CTA */}
            <div className="tw:bg-white tw:rounded-2xl tw:border tw:border-gray-100 tw:p-5!">
              <span className="tw:inline-flex tw:w-11 tw:h-11 tw:rounded-xl tw:bg-primary/10 tw:items-center tw:justify-center tw:mb-3!">
                <FileText className="tw:w-5 tw:h-5 tw:text-dark-purple" />
              </span>
              <h2 className="tw:text-base tw:font-bold tw:text-dark-purple tw:mb-2!">
                Visa Information
              </h2>
              <p className="tw:text-gray-500 tw:text-sm tw:mb-4! tw:leading-relaxed">
                Check visa requirements, entry rules and travel advisories for
                every country.
              </p>
              <Link
                to="/visa-information"
                className="tw:block tw:text-center tw:bg-dark-purple! tw:text-white! tw:font-semibold tw:rounded-xl tw:px-4! tw:py-2.5! tw:text-sm tw:hover:bg-[#000080]! tw:transition-colors"
              >
                Check Visa Requirements
              </Link>
            </div>
          </aside>
        </div>
      </main>
      </div>

      <Footer />
    </>
  );
};

export default TravelGuidesHub;
