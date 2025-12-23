/**
 * Root Layout - Provides prefetched geo data to the entire app
 * Uses React Router v6 loader data for instant access (no loading state)
 */
import { Outlet, useLoaderData } from "react-router-dom";
import { createContext, useContext, useMemo } from "react";
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
      <Outlet />
    </PrefetchedDataContext.Provider>
  );
};

RootLayout.propTypes = {};

export default RootLayout;
