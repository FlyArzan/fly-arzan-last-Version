/**
 * Root Layout - Provides prefetched geo data to the entire app
 * Uses React Router v6 loader data for instant access (no loading state)
 */
import { Outlet, useLoaderData } from "react-router-dom";
import { createContext, useContext, useMemo, Suspense } from "react";
import Scroll from "../ScrollToTop/Scroll";

// Context for prefetched data
const PrefetchedDataContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const usePrefetchedData = () => {
  const context = useContext(PrefetchedDataContext);
  if (!context) {
    throw new Error("usePrefetchedData must be used within RootLayout");
  }
  return context;
};

const RootLayout = () => {
  const loaderData = useLoaderData();

  const value = useMemo(
    () => ({
      // Geo data from IP detection
      geoData: loaderData?.geoData,
      // Pre-built regional settings (language, currency, country)
      regionalSettings: loaderData?.regionalSettings,
      // Nearest airport for departure input
      nearestAirport: loaderData?.nearestAirport,
      // Time-based background info
      timePeriod: loaderData?.timePeriod,
      backgroundImage: loaderData?.backgroundImage,
      hour: loaderData?.hour,
      // Whether user has manually set preferences
      isUserSet: loaderData?.isUserSet,
      // Any error that occurred during loading
      error: loaderData?.error,
    }),
    [loaderData]
  );

  return (
    <PrefetchedDataContext.Provider value={value}>
      <Scroll />
      <Suspense
        fallback={
          <div className="tw:flex tw:items-center tw:justify-center tw:min-h-screen">
            <div className="tw:w-10 tw:h-10 tw:rounded-full tw:border-4 tw:border-gray-200 tw:border-t-blue-500 tw:animate-spin" />
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </PrefetchedDataContext.Provider>
  );
};

RootLayout.propTypes = {};

export default RootLayout;
