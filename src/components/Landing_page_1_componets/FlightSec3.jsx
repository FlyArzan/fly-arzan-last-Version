import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import { useArticles } from "../../hooks/useArticles";

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

const ArticleCard = ({ article }) => {
  const cat = article.articleCategory?.[0];
  const catSlug = cat?.slug || "general-travel-advice";
  return (
    <Link
      to={`/travel-guides/${catSlug}/${article.slug}`}
      className="tw:flex tw:flex-col tw:bg-white tw:rounded-2xl tw:overflow-hidden tw:shadow-sm tw:border tw:border-gray-100 tw:hover:shadow-md tw:hover:border-primary/40 tw:transition-all tw:group tw:h-full"
    >
      <div className="tw:w-full tw:h-52 tw:overflow-hidden tw:flex-shrink-0">
        {article.featuredImage ? (
          <img
            src={article.featuredImage}
            alt={article.imageAlt || article.title}
            className="tw:w-full tw:h-full tw:object-cover tw:group-hover:scale-105 tw:transition-transform tw:duration-300"
            loading="lazy"
          />
        ) : (
          <div className="tw:w-full tw:h-full tw:bg-gradient-to-br tw:from-primary/10 tw:to-[#3194c4]/10 tw:flex tw:items-center tw:justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="tw:w-12 tw:h-12 tw:text-primary/40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
          </div>
        )}
      </div>
      <div className="tw:flex tw:flex-col tw:flex-1 tw:p-5!">
        {cat && (
          <span className="tw:text-xs tw:font-bold tw:text-primary tw:uppercase tw:tracking-widest tw:mb-2! tw:block">
            {cat.name}
          </span>
        )}
        <h3 className="tw:font-bold tw:text-[#272727] tw:text-lg tw:leading-snug tw:mb-2! tw:group-hover:text-primary tw:transition-colors tw:line-clamp-2">
          {article.title}
        </h3>
        {article.shortSummary && (
          <p className="tw:text-gray-500 tw:text-base tw:line-clamp-3 tw:leading-relaxed tw:mb-3! tw:flex-1">
            {article.shortSummary}
          </p>
        )}
        <div className="tw:flex tw:items-center tw:justify-between tw:mt-auto!">
          <span className="tw:text-sm tw:text-gray-400">
            {article.publishedAt ? formatDate(article.publishedAt) : ""}
            {article.readingTime
              ? `${article.publishedAt ? " · " : ""}${article.readingTime} min read`
              : ""}
          </span>
          <span className="tw:inline-flex tw:items-center tw:gap-1! tw:text-sm tw:font-semibold tw:text-primary tw:group-hover:gap-1.5! tw:transition-all">
            Read more <ArrowRight className="tw:w-3.5 tw:h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
};

const SkeletonCard = () => (
  <div className="tw:bg-white tw:rounded-2xl tw:overflow-hidden tw:border tw:border-gray-100 tw:animate-pulse">
    <div className="tw:w-full tw:h-52 tw:bg-gray-100" />
    <div className="tw:p-5!">
      <div className="tw:h-3 tw:bg-gray-100 tw:rounded tw:w-20 tw:mb-3!" />
      <div className="tw:h-5 tw:bg-gray-100 tw:rounded tw:w-full tw:mb-2!" />
      <div className="tw:h-5 tw:bg-gray-100 tw:rounded tw:w-3/4 tw:mb-4!" />
      <div className="tw:h-4 tw:bg-gray-100 tw:rounded tw:w-full tw:mb-2!" />
      <div className="tw:h-4 tw:bg-gray-100 tw:rounded tw:w-5/6" />
    </div>
  </div>
);

// Custom slider arrow. react-slick clones this and injects `onClick` plus a
// `className` that contains "slick-disabled" when there's nothing more to
// scroll to — we read that to disable/dim the button. currentSlide/slideCount
// are injected too; we deliberately don't forward them to the DOM <button>.
const SlideArrow = ({ direction, onClick, className, side }) => {
  const disabled = (className || "").includes("slick-disabled");
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "Previous articles" : "Next articles"}
      onClick={onClick}
      disabled={disabled}
      className={`tw:absolute tw:top-1/2 tw:-translate-y-1/2 tw:z-10 tw:flex tw:items-center tw:justify-center tw:w-10 tw:h-10 tw:rounded-full tw:bg-white tw:shadow-md tw:border tw:border-gray-100 tw:text-dark-purple tw:transition-all tw:hover:bg-primary! tw:hover:text-white! tw:hover:border-primary! ${
        disabled ? "tw:opacity-0! tw:pointer-events-none!" : "tw:opacity-100"
      } ${side === "left" ? "tw:-left-3 tw:md:-left-5" : "tw:-right-3 tw:md:-right-5"}`}
    >
      <Icon className="tw:w-5 tw:h-5" />
    </button>
  );
};

const FlightSec3 = forwardRef((props, ref) => {
  const { t } = useTranslation();

  // Fetch up to 6 so there's always plenty to slide through as content grows.
  const { data, isLoading } = useArticles({ limit: 6 });
  const articles = data?.articles || [];

  // Loop the carousel whenever there's more than one card, so the arrows are
  // always visible and it reads as a slider even with only 3 articles.
  const sliderSettings = {
    dots: false,
    infinite: articles.length > 1,
    speed: 400,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipeToSlide: true,
    prevArrow: <SlideArrow direction="prev" side="left" />,
    nextArrow: <SlideArrow direction="next" side="right" />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, infinite: articles.length > 1 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1, infinite: articles.length > 1 },
      },
    ],
  };

  return (
    <section ref={ref} className="Sec3-sec" id="flight-article">
      <div className="container">
        <div className="tw:w-full">
          {/* Header row */}
          <div className="tw:flex tw:items-end tw:justify-between tw:flex-wrap tw:gap-4! tw:mb-8!">
            <div className="Sec3-tital tw:pb-0!">
              <h2>{t("Useful Articles")}</h2>
              <p
                style={{
                  color: "#6b7280",
                  fontFamily: "Rubik",
                  fontSize: "16px",
                  marginTop: "8px",
                }}
              >
                Travel tips, destination guides, visa advice and more — from our
                editorial team.
              </p>
            </div>
            <Link
              to="/travel-guides"
              className="tw:inline-flex tw:items-center tw:gap-1.5! tw:text-sm tw:font-semibold tw:text-primary! tw:hover:text-dark-purple! tw:transition-colors tw:flex-shrink-0"
            >
              View all articles <ArrowRight className="tw:w-4 tw:h-4" />
            </Link>
          </div>

          {/* Article slider — arrows on both sides, swipeable on touch. Cards
              keep the exact same design; only the layout changed from a static
              grid to a slider. */}
          {isLoading ? (
            <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:lg:grid-cols-3 tw:gap-6!">
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : articles.length > 0 ? (
            <div className="tw:relative tw:px-1!">
              <Slider {...sliderSettings} className="useful-articles-slider">
                {articles.map((a) => (
                  <div key={a.id} className="tw:h-full">
                    <div className="tw:h-full tw:px-3!">
                      <ArticleCard article={a} />
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          ) : (
            /* graceful empty state — only shown when API returns 0 articles */
            <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:lg:grid-cols-3 tw:gap-6!">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="tw:bg-white tw:rounded-2xl tw:border tw:border-dashed tw:border-gray-200 tw:h-72 tw:flex tw:items-center tw:justify-center"
                >
                  <span className="tw:text-gray-300 tw:text-sm">
                    Article coming soon
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Bottom CTA */}
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginTop: "40px",
            }}
          >
            <Link to="/travel-guides" className="Sec3-explore-btn">
              Explore All Travel Guides
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
});

export default FlightSec3;
