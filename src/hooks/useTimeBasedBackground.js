import { useState, useEffect } from "react";

/**
 * Time-based background image selector
 * Day mode: 06:00 – 17:59 (bright images)
 * Evening mode: 18:00 – 20:59 (dim/soft images)
 * Night mode: 21:00 – 05:59 (dark images)
 */

// Map image numbers to time periods
// Images in /public/Pics/Airline wing/
// Categorized by actual image brightness:
// - DAY: 1, 2, 3, 4, 6, 8, 10, 11 (bright blue sky, clouds)
// - EVENING: 5, 7 (sunset/dusk colors)
// - NIGHT: 9 (dark with city lights below)
const TIME_PERIODS = {
  day: {
    start: 6,
    end: 17,
    // Bright daylight images (blue sky, clouds)
    images: [
      "/Pics/Airline wing/Air line wings 1.jpg",
      "/Pics/Airline wing/Air line wings 2.jpg",
      "/Pics/Airline wing/Air line wings 3.jpg",
      "/Pics/Airline wing/Air line wings 4.jpg",
      "/Pics/Airline wing/Air line wings 6.jpg",
      "/Pics/Airline wing/Air line wings 8.jpg",
      "/Pics/Airline wing/Air line wings 10.jpg",
      "/Pics/Airline wing/Air line wings 11.jpg",
    ],
  },
  evening: {
    start: 18,
    end: 20,
    // Sunset/dusk images (warm orange/pink colors)
    images: [
      "/Pics/Airline wing/Air line wings 5.jpg",
      "/Pics/Airline wing/Air line wings 7.jpg",
    ],
  },
  night: {
    start: 21,
    end: 5,
    // Dark night images (dark sky, city lights)
    images: ["/Pics/Airline wing/Air line wings 9.jpg"],
  },
};

// Prefetch function removed - now always computing based on current time

/**
 * Get the current time period based on hour
 */
function getTimePeriod(hour) {
  if (hour >= TIME_PERIODS.day.start && hour <= TIME_PERIODS.day.end) {
    return "day";
  } else if (
    hour >= TIME_PERIODS.evening.start &&
    hour <= TIME_PERIODS.evening.end
  ) {
    return "evening";
  } else {
    return "night";
  }
}

/**
 * Get a random image from the time period's image array
 * Uses a seeded random based on the date to keep consistent throughout the day
 */
function getImageForPeriod(period) {
  const images = TIME_PERIODS[period].images;
  const today = new Date();
  // Use date as seed for consistent image throughout the day
  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();
  const index = seed % images.length;
  return images[index];
}

/**
 * Hook to get the appropriate background image based on user's local time
 * Uses prefetched data from rootLoader for instant access (no flash/delay)
 * @returns {Object} { backgroundImage, timePeriod, hour }
 */
export function useTimeBasedBackground() {
  const [backgroundData, setBackgroundData] = useState(() => {
    // Always compute based on current time (ignore cached data for now)
    const hour = new Date().getHours();
    const period = getTimePeriod(hour);
    const image = getImageForPeriod(period);

    return {
      backgroundImage: image,
      timePeriod: period,
      hour,
    };
  });

  useEffect(() => {
    // Update background when hour changes
    const checkTime = () => {
      const hour = new Date().getHours();
      const period = getTimePeriod(hour);
      const newImage = getImageForPeriod(period);

      setBackgroundData((prev) => {
        if (prev.timePeriod !== period) {
          return {
            backgroundImage: newImage,
            timePeriod: period,
            hour,
          };
        }
        return prev;
      });
    };

    // Check every minute for time period changes
    const interval = setInterval(checkTime, 60000);

    return () => clearInterval(interval);
  }, []);

  return backgroundData;
}

/**
 * Get background style object for inline styling
 */
export function getTimeBasedBackgroundStyle() {
  const hour = new Date().getHours();
  const period = getTimePeriod(hour);
  const image = getImageForPeriod(period);

  return {
    backgroundImage: `url(${image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };
}

export default useTimeBasedBackground;
