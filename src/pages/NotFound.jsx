import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Home, Plane, Search } from "lucide-react";
import Header from "../header-footer/Header";
import Footer from "../header-footer/Footer";

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>404 — Page not found | FlyArzan</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="tw:min-h-screen tw:flex tw:flex-col tw:bg-linear-to-b tw:from-[#f0f9fd] tw:via-slate-50 tw:to-white">
        <Header />
        <main
          className="tw:flex tw:flex-1 tw:flex-col tw:min-h-0 tw:w-full tw:pt-16 tw:md:pt-[92px] tw:pb-10"
          aria-labelledby="not-found-title"
        >
          <div className="tw:flex tw:flex-1 tw:flex-col tw:items-center tw:justify-center tw:w-full tw:min-h-0 tw:px-4 tw:py-6">
            <div className="tw:relative tw:w-full tw:max-w-lg tw:mx-auto tw:text-center">
              <p
                className="tw:pointer-events-none tw:select-none tw:absolute tw:-top-6 tw:left-1/2 tw:-translate-x-1/2 tw:text-[7rem] tw:sm:text-[8.5rem] tw:font-black tw:leading-none tw:text-primary/12"
                aria-hidden
              >
                404
              </p>

              <div className="tw:relative tw:rounded-2xl tw:bg-white/90 tw:backdrop-blur-sm tw:border tw:border-primary/15 tw:shadow-[0_20px_50px_-20px_rgba(0,0,87,0.15)] tw:px-8 tw:py-10 tw:sm:px-10 tw:sm:py-12 tw:text-center">
                <div className="tw:mx-auto tw:mb-5 tw:flex tw:h-14 tw:w-14 tw:items-center tw:justify-center tw:rounded-2xl tw:bg-primary/10 tw:text-primary">
                  <Plane className="tw:h-7 tw:w-7" strokeWidth={1.75} aria-hidden />
                </div>

                <p className="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-primary tw:mb-2">
                  Page not found
                </p>
                <h1
                  id="not-found-title"
                  className="tw:text-2xl tw:sm:text-3xl tw:font-bold tw:text-dark-purple tw:mb-3 tw:leading-snug"
                >
                  We couldn&apos;t find that destination
                </h1>
                <p className="tw:text-secondary tw:text-[15px] tw:leading-relaxed tw:mb-8 tw:max-w-sm tw:mx-auto">
                  The link may be broken or the page may have moved. Try a fresh
                  search or return to the homepage.
                </p>

                <div className="tw:flex tw:flex-col tw:sm:flex-row tw:items-stretch tw:sm:items-center tw:justify-center tw:gap-3">
                  <Link
                    to="/"
                    className="tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:rounded-xl tw:bg-primary tw:px-5 tw:py-3 tw:text-sm tw:font-semibold tw:text-white tw:shadow-md tw:shadow-primary/25 tw:transition-colors hover:tw:bg-primary/90"
                  >
                    <Home className="tw:h-4 tw:w-4" aria-hidden />
                    Back to home
                  </Link>
                  <Link
                    to="/search/flight"
                    className="tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:rounded-xl tw:border-2 tw:border-primary tw:bg-white tw:px-5 tw:py-3 tw:text-sm tw:font-semibold tw:text-primary tw:transition-colors hover:tw:bg-primary/5"
                  >
                    <Search className="tw:h-4 tw:w-4" aria-hidden />
                    Search flights
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default NotFound;
