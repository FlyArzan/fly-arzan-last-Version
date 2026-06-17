import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Search,
  ArrowRight,
  Star,
  Flame,
  Plane,
  FileText,
  Filter,
  X,
} from "lucide-react";
import Header from "../header-footer/Header";
import Footer from "../header-footer/Footer";
import CategoryIcon from "../components/travel/CategoryIcon";
import {
  useArticles,
  useArticleCategories,
  useFeaturedArticles,
} from "../hooks/useArticles";

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
      className="tw:flex tw:gap-4! tw:bg-white tw:rounded-2xl tw:p-4! tw:border tw:border-gray-100 tw:shadow-sm tw:hover:shadow-md tw:hover:border-primary/40 tw:transition-all tw:group tw:items-start"
    >
      {article.featuredImage ? (
        <img
          src={article.featuredImage}
          alt={article.imageAlt || article.title}
          className="tw:w-28 tw:h-20 tw:object-cover tw:rounded-xl tw:flex-shrink-0 tw:group-hover:scale-105 tw:transition-transform tw:duration-300"
          loading="lazy"
        />
      ) : (
        <div className="tw:w-28 tw:h-20 tw:bg-primary/10 tw:text-dark-purple tw:rounded-xl tw:flex-shrink-0 tw:flex tw:items-center tw:justify-center">
          <CategoryIcon slug={cat?.slug} className="tw:w-7 tw:h-7" />
        </div>
      )}
      <div className="tw:flex-1 tw:min-w-0">
        {cat && (
          <span className="tw:text-xs tw:font-semibold tw:text-primary tw:uppercase tw:tracking-wide tw:mb-1! tw:block">
            {cat.name}
          </span>
        )}
        <h3 className="tw:font-semibold tw:text-dark-purple tw:text-base tw:leading-snug tw:mb-1.5! tw:group-hover:text-primary tw:transition-colors tw:line-clamp-2">
          {article.title}
        </h3>
        {article.shortSummary && (
          <p className="tw:text-gray-500 tw:text-sm tw:line-clamp-2 tw:mb-2! tw:leading-relaxed">
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

const FeaturedCard = ({ article }) => {
  const cat = article.articleCategory?.[0];
  return (
    <Link
      to={`/travel-guides/${cat?.slug || "general-travel-advice"}/${article.slug}`}
      className="tw:flex tw:flex-col tw:bg-white tw:rounded-2xl tw:overflow-hidden tw:border tw:border-gray-100 tw:shadow-sm tw:hover:shadow-md tw:hover:border-primary/40 tw:transition-all tw:group"
    >
      {article.featuredImage ? (
        <img
          src={article.featuredImage}
          alt={article.imageAlt || article.title}
          width="400"
          height="200"
          loading="lazy"
          className="tw:w-full tw:h-44 tw:object-cover tw:group-hover:scale-105 tw:transition-transform tw:duration-300"
        />
      ) : (
        <div className="tw:w-full tw:h-44 tw:bg-primary/10 tw:text-dark-purple tw:flex tw:items-center tw:justify-center">
          <CategoryIcon slug={cat?.slug} className="tw:w-12 tw:h-12" />
        </div>
      )}
      <div className="tw:flex tw:flex-col tw:flex-1 tw:p-5!">
        {cat && (
          <span className="tw:text-xs tw:font-semibold tw:text-primary tw:uppercase tw:tracking-wide tw:mb-2! tw:block">
            {cat.name}
          </span>
        )}
        <h3 className="tw:font-bold tw:text-dark-purple tw:text-lg tw:leading-snug tw:mb-2! tw:group-hover:text-primary tw:transition-colors tw:line-clamp-2">
          {article.title}
        </h3>
        {article.shortSummary && (
          <p className="tw:text-gray-500 tw:text-sm tw:line-clamp-2 tw:mb-3! tw:leading-relaxed tw:flex-1">
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

const SidebarArticleCard = ({ article }) => {
  const cat = article.articleCategory?.[0];
  return (
    <Link
      to={`/travel-guides/${cat?.slug || "general-travel-advice"}/${article.slug}`}
      className="tw:flex tw:gap-3! tw:py-3! tw:border-b tw:border-gray-100 tw:last:border-0 tw:group tw:items-start"
    >
      {article.featuredImage ? (
        <img
          src={article.featuredImage}
          alt={article.imageAlt || article.title}
          className="tw:w-14 tw:h-10 tw:object-cover tw:rounded-lg tw:flex-shrink-0"
          loading="lazy"
        />
      ) : (
        <div className="tw:w-14 tw:h-10 tw:bg-primary/10 tw:text-dark-purple tw:rounded-lg tw:flex-shrink-0 tw:flex tw:items-center tw:justify-center">
          <CategoryIcon slug={cat?.slug} className="tw:w-4 tw:h-4" />
        </div>
      )}
      <div className="tw:min-w-0">
        <p className="tw:text-sm tw:font-medium tw:text-gray-800 tw:line-clamp-2 tw:group-hover:text-primary tw:transition-colors tw:leading-snug">
          {article.title}
        </p>
        {article.readingTime && (
          <p className="tw:text-xs tw:text-gray-400 tw:mt-0.5!">
            {article.readingTime} min read
          </p>
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
  const [filterOpen, setFilterOpen] = useState(false);
  const navigate = useNavigate();

  // Lock background scroll while the mobile filter drawer is open.
  useEffect(() => {
    document.body.style.overflow = filterOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [filterOpen]);

  const { data: categories = [] } = useArticleCategories();
  const { data: featured = [] } = useFeaturedArticles();
  const { data, isLoading } = useArticles({
    category: activeCat !== "all" ? activeCat : undefined,
    page,
    limit: LIMIT,
  });

  const articles = data?.articles || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / LIMIT);

  const handleCatFilter = (slug) => {
    setActiveCat(slug);
    setPage(0);
    setFilterOpen(false);
  };

  const activeLabel =
    activeCat === "all"
      ? "All Articles"
      : categories.find((c) => c.slug === activeCat)?.name || "All Articles";

  // Row styling for items inside the mobile filter drawer.
  const drawerItem = (active) =>
    `tw:w-full tw:flex tw:items-center tw:justify-between tw:px-3! tw:py-2.5! tw:rounded-lg tw:text-sm tw:text-left tw:transition-colors ${
      active
        ? "tw:bg-primary/10! tw:text-dark-purple! tw:font-semibold"
        : "tw:text-gray-600! tw:hover:bg-gray-50! tw:hover:text-gray-900!"
    }`;

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const q = searchInput.trim();
    if (q) {
      navigate(`/travel-guides/all?search=${encodeURIComponent(q)}`);
    }
  };

  const pillClass = (active) =>
    `tw:px-4! tw:py-2! tw:rounded-full tw:text-sm tw:font-medium tw:border tw:transition-all ${
      active
        ? "tw:bg-dark-purple! tw:text-white! tw:border-dark-purple tw:shadow-sm"
        : "tw:bg-white! tw:text-gray-600! tw:border-gray-200 tw:hover:border-primary tw:hover:text-primary!"
    }`;

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

      {/* Hero — navy brand gradient; top padding clears the fixed header */}
      <section className="tw:bg-gradient-to-br tw:from-dark-purple tw:to-[#1a2a7a] tw:text-white tw:pt-28! tw:md:pt-36! tw:pb-16! tw:px-4!">
        <div className="tw:max-w-3xl tw:mx-auto! tw:text-center">
          <h1 className="tw:text-4xl tw:md:text-5xl tw:font-bold tw:mb-4! tw:leading-tight">
            Travel Guides &amp; Useful Travel Information
          </h1>
          <p className="tw:text-white/75 tw:text-lg tw:max-w-2xl tw:mx-auto! tw:mb-8! tw:leading-relaxed">
            {PAGE_DESCRIPTION}
          </p>
          <form
            onSubmit={handleHeroSearch}
            className="tw:flex tw:gap-2! tw:max-w-lg tw:mx-auto!"
          >
            <div className="tw:relative tw:flex-1">
              <Search className="tw:absolute tw:left-4 tw:top-1/2 tw:-translate-y-1/2 tw:w-4 tw:h-4 tw:text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search travel guides, airport information, visa tips…"
                style={{ color: "#111827", backgroundColor: "#ffffff" }}
                className="tw:w-full tw:pl-11! tw:pr-4! tw:py-3! tw:rounded-xl tw:bg-white! tw:text-gray-900! tw:placeholder:text-gray-400 tw:text-sm tw:outline-none tw:border tw:border-transparent tw:focus:border-primary tw:focus:ring-2 tw:focus:ring-primary/30 tw:shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="tw:px-6! tw:py-3! tw:bg-primary! tw:text-dark-purple! tw:font-semibold tw:rounded-xl tw:hover:bg-[#6cc0e3]! tw:transition-colors tw:text-sm tw:flex-shrink-0"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Subtle primary tint behind the whole content area so white cards pop */}
      <div className="tw:bg-[#f3fafd]!">

      {/* Featured Articles — highlighted cards below the hero */}
      {featured.length > 0 && (
        <section className="tw:max-w-7xl tw:mx-auto! tw:px-4! tw:sm:px-6! tw:pt-12!">
          <div className="tw:flex tw:items-center tw:gap-2! tw:mb-6!">
            <Star className="tw:w-6 tw:h-6 tw:text-primary tw:fill-primary" />
            <h2 className="tw:text-2xl tw:font-bold tw:text-dark-purple">Featured Articles</h2>
          </div>
          <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:lg:grid-cols-3 tw:gap-5!">
            {featured.slice(0, 6).map((a) => (
              <FeaturedCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}

      <main className="tw:max-w-7xl tw:mx-auto! tw:px-4! tw:sm:px-6! tw:py-12!">
        <div className="tw:flex tw:flex-col tw:lg:flex-row tw:gap-8!">

          {/* LEFT — 3/4 */}
          <div className="tw:flex-1 tw:min-w-0">

            {/* Category filter — pills on desktop */}
            <div className="tw:hidden tw:lg:flex tw:flex-wrap tw:gap-2! tw:mb-7!">
              <button onClick={() => handleCatFilter("all")} className={pillClass(activeCat === "all")}>
                All Articles
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCatFilter(cat.slug)}
                  className={`${pillClass(activeCat === cat.slug)} tw:inline-flex tw:items-center tw:gap-1.5!`}
                >
                  <CategoryIcon slug={cat.slug} className="tw:w-4 tw:h-4" />
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Category filter — compact bar + drawer trigger on mobile/tablet */}
            <div className="tw:flex tw:lg:hidden tw:items-center tw:justify-between tw:gap-3! tw:mb-5!">
              <h2 className="tw:text-lg tw:font-bold tw:text-dark-purple tw:truncate">
                {activeLabel}
              </h2>
              <button
                onClick={() => setFilterOpen(true)}
                className="tw:inline-flex tw:items-center tw:gap-2! tw:px-4! tw:py-2! tw:rounded-lg tw:border tw:border-gray-200 tw:bg-white! tw:text-sm tw:font-medium tw:text-dark-purple! tw:shadow-sm tw:flex-shrink-0"
              >
                <Filter className="tw:w-4 tw:h-4" />
                Filter
              </button>
            </div>

            {/* Results count */}
            {!isLoading && total > 0 && (
              <p className="tw:text-sm tw:text-gray-400 tw:mb-5!">
                Showing {articles.length} of {total}{" "}
                {total === 1 ? "article" : "articles"}
              </p>
            )}

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
              <div className="tw:flex tw:flex-col tw:gap-4!">
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

            {/* Category Grid — full section below article list */}
            {categories.length > 0 && (
              <section className="tw:mt-14! tw:pt-10! tw:border-t tw:border-gray-100">
                <div className="tw:flex tw:items-center tw:justify-between tw:mb-6!">
                  <h2 className="tw:text-2xl tw:font-bold tw:text-dark-purple">
                    Browse by Topic
                  </h2>
                </div>
                <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:lg:grid-cols-3 tw:gap-4!">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/travel-guides/${cat.slug}`}
                      className="tw:flex tw:flex-col tw:p-5! tw:bg-white tw:rounded-2xl tw:border tw:border-gray-100 tw:shadow-sm tw:hover:shadow-md tw:hover:border-primary/40 tw:transition-all tw:group"
                    >
                      <span className="tw:w-11 tw:h-11 tw:rounded-xl tw:bg-primary/10 tw:text-dark-purple tw:flex tw:items-center tw:justify-center tw:mb-3! tw:group-hover:bg-primary/20 tw:transition-colors">
                        <CategoryIcon slug={cat.slug} className="tw:w-5 tw:h-5" />
                      </span>
                      <span className="tw:font-semibold tw:text-dark-purple tw:text-sm tw:mb-1! tw:group-hover:text-primary tw:transition-colors">
                        {cat.name}
                      </span>
                      {cat.description && (
                        <span className="tw:text-gray-400 tw:text-xs tw:line-clamp-2 tw:leading-relaxed">
                          {cat.description}
                        </span>
                      )}
                      {cat.articleCount > 0 && (
                        <span className="tw:mt-2! tw:text-xs tw:text-primary tw:font-medium">
                          {cat.articleCount}{" "}
                          {cat.articleCount === 1 ? "article" : "articles"}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT — 1/4 sidebar */}
          <aside className="tw:lg:w-72 tw:xl:w-80 tw:flex-shrink-0 tw:space-y-6!">

            {/* Popular Reads */}
            {featured.length > 0 && (
              <div className="tw:bg-white tw:rounded-2xl tw:border tw:border-gray-100 tw:shadow-sm tw:p-5!">
                <h2 className="tw:text-base tw:font-bold tw:text-dark-purple tw:mb-4! tw:flex tw:items-center tw:gap-2!">
                  <Flame className="tw:w-4 tw:h-4 tw:text-primary" /> Popular Reads
                </h2>
                {featured.slice(0, 4).map((a) => (
                  <SidebarArticleCard key={a.id} article={a} />
                ))}
              </div>
            )}

            {/* Browse Topics */}
            {categories.length > 0 && (
              <div className="tw:bg-white tw:rounded-2xl tw:border tw:border-gray-100 tw:shadow-sm tw:p-5!">
                <h2 className="tw:text-base tw:font-bold tw:text-dark-purple tw:mb-3!">
                  Browse Topics
                </h2>
                <div className="tw:space-y-0.5!">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCatFilter(cat.slug)}
                      className={`tw:w-full tw:flex tw:items-center tw:justify-between tw:px-3! tw:py-2! tw:rounded-lg tw:text-sm tw:transition-colors tw:text-left ${
                        activeCat === cat.slug
                          ? "tw:bg-primary/10! tw:text-dark-purple! tw:font-medium"
                          : "tw:text-gray-600! tw:hover:bg-gray-50! tw:hover:text-gray-900!"
                      }`}
                    >
                      <span className="tw:flex tw:items-center tw:gap-2!">
                        <CategoryIcon slug={cat.slug} className="tw:w-4 tw:h-4" />
                        <span>{cat.name}</span>
                      </span>
                      {cat.articleCount > 0 && (
                        <span className="tw:text-xs tw:bg-gray-100 tw:text-gray-500 tw:rounded-full tw:px-2! tw:py-0.5! tw:flex-shrink-0">
                          {cat.articleCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Flight CTA */}
            <div className="tw:bg-gradient-to-br tw:from-dark-purple tw:to-[#1a2a7a] tw:rounded-2xl tw:p-5! tw:text-white">
              <span className="tw:inline-flex tw:w-11 tw:h-11 tw:rounded-xl tw:bg-white/10 tw:items-center tw:justify-center tw:mb-3!">
                <Plane className="tw:w-5 tw:h-5 tw:text-primary" />
              </span>
              <h2 className="tw:text-base tw:font-bold tw:mb-2!">
                Find Cheap Flights
              </h2>
              <p className="tw:text-white/70 tw:text-sm tw:mb-4! tw:leading-relaxed">
                Compare flights from hundreds of airlines and find the best
                travel deals.
              </p>
              <Link
                to="/search/flight"
                className="tw:block tw:text-center tw:bg-primary! tw:text-dark-purple! tw:font-semibold tw:rounded-xl tw:px-4! tw:py-2.5! tw:text-sm tw:hover:bg-[#6cc0e3]! tw:transition-colors"
              >
                Search Flights
              </Link>
            </div>

            {/* Visa CTA */}
            <div className="tw:bg-white tw:rounded-2xl tw:border tw:border-gray-100 tw:shadow-sm tw:p-5!">
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

      {/* Mobile filter drawer — slides in from the right */}
      {filterOpen && (
        <div className="tw:fixed tw:inset-0 tw:z-[60] tw:lg:hidden">
          <div
            className="tw:absolute tw:inset-0 tw:bg-black/40"
            onClick={() => setFilterOpen(false)}
          />
          <div className="tw:absolute tw:right-0 tw:top-0 tw:h-full tw:w-80 tw:max-w-[85%] tw:bg-white! tw:shadow-2xl tw:flex tw:flex-col tw:animate-in tw:slide-in-from-right tw:duration-300 tw:ease-out">
            <div className="tw:flex tw:items-center tw:justify-between tw:px-5! tw:py-4! tw:border-b tw:border-gray-100">
              <h3 className="tw:font-bold tw:text-dark-purple tw:flex tw:items-center tw:gap-2!">
                <Filter className="tw:w-4 tw:h-4 tw:text-primary" />
                Filter by Topic
              </h3>
              <button
                onClick={() => setFilterOpen(false)}
                aria-label="Close filter"
                className="tw:text-gray-400! tw:hover:text-gray-700!"
              >
                <X className="tw:w-5 tw:h-5" />
              </button>
            </div>
            <div className="tw:flex-1 tw:overflow-y-auto tw:p-3! tw:space-y-0.5!">
              <button
                onClick={() => handleCatFilter("all")}
                className={drawerItem(activeCat === "all")}
              >
                <span className="tw:flex tw:items-center tw:gap-2.5!">
                  <Star className="tw:w-4 tw:h-4 tw:text-primary" />
                  <span>All Articles</span>
                </span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCatFilter(cat.slug)}
                  className={drawerItem(activeCat === cat.slug)}
                >
                  <span className="tw:flex tw:items-center tw:gap-2.5!">
                    <CategoryIcon slug={cat.slug} className="tw:w-4 tw:h-4" />
                    <span>{cat.name}</span>
                  </span>
                  {cat.articleCount > 0 && (
                    <span className="tw:text-xs tw:bg-gray-100 tw:text-gray-500 tw:rounded-full tw:px-2! tw:py-0.5! tw:flex-shrink-0">
                      {cat.articleCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default TravelGuidesHub;
