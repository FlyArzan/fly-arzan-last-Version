/**
 * Time-based hero background paths (public /Pics).
 * If you change these arrays, update the FLYARZAN_HERO_LCP_PRELOAD block in index.html
 * so the preload URL matches the first paint.
 */

export const TIME_PERIODS = {
  day: {
    start: 6,
    end: 17,
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
    images: [
      "/Pics/Airline wing/Air line wings 5.jpg",
      "/Pics/Airline wing/Air line wings 7.jpg",
    ],
  },
  night: {
    start: 21,
    end: 5,
    images: ["/Pics/Airline wing/Air line wings 9.jpg"],
  },
};

export function getTimePeriod(hour) {
  if (hour >= TIME_PERIODS.day.start && hour <= TIME_PERIODS.day.end) {
    return "day";
  }
  if (
    hour >= TIME_PERIODS.evening.start &&
    hour <= TIME_PERIODS.evening.end
  ) {
    return "evening";
  }
  return "night";
}

export function getImageForPeriod(period, date = new Date()) {
  const images = TIME_PERIODS[period].images;
  const seed =
    date.getFullYear() * 10000 +
    (date.getMonth() + 1) * 100 +
    date.getDate();
  return images[seed % images.length];
}

export function getHeroBackgroundImageUrl(date = new Date()) {
  const hour = date.getHours();
  const period = getTimePeriod(hour);
  return getImageForPeriod(period, date);
}
