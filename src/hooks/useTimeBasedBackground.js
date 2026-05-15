import { useState, useEffect } from "react";
import {
  getHeroBackgroundImageUrl,
  getImageForPeriod,
  getTimePeriod,
} from "@/utils/timeBasedHeroImage";

/**
 * Time-based background image selector
 * Day mode: 06:00 – 17:59 (bright images)
 * Evening mode: 18:00 – 20:59 (dim/soft images)
 * Night mode: 21:00 – 05:59 (dark images)
 */

export function useTimeBasedBackground() {
  const [backgroundData, setBackgroundData] = useState(() => {
    const hour = new Date().getHours();
    const period = getTimePeriod(hour);
    const image = getHeroBackgroundImageUrl();

    return {
      backgroundImage: image,
      timePeriod: period,
      hour,
    };
  });

  useEffect(() => {
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

    const interval = setInterval(checkTime, 60000);

    return () => clearInterval(interval);
  }, []);

  return backgroundData;
}

export function getTimeBasedBackgroundStyle() {
  const image = getHeroBackgroundImageUrl();
  return {
    backgroundImage: `url(${image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };
}

export default useTimeBasedBackground;
