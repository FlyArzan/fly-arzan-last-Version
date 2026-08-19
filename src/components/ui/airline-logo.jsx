import { useState } from "react";
import PropTypes from "prop-types";
import { Plane } from "lucide-react";
import { getAirlineLogoUrl } from "@/lib/flight-utils";

/**
 * Airline logo with a real fallback.
 *
 * Logos are 905 committed PNGs in `public/logos/`, keyed by 2-letter airline
 * IATA code. `getAirlineLogoUrl` returns a path for ANY truthy code, so the
 * `url ? <img> : <placeholder>` check this replaces only ever caught a *missing
 * code* — a code with no matching PNG rendered the browser's broken-image icon.
 * Handling `onError` is the point of this component; it follows the same
 * pattern as FlagBadge in src/pages/VisaInformationHub.jsx.
 *
 * `fallback="code"` keeps the flight cards' existing look (IATA in a grey box);
 * `fallback="plane"` is the directory look — a muted plane glyph.
 */
const AirlineLogo = ({
  code,
  name,
  className = "",
  fallbackClassName = "",
  fallback = "code",
  alt,
}) => {
  // Tracking WHICH code failed (rather than a bare boolean) means the error
  // state resets by itself when the component is reused for another airline.
  const [failedCode, setFailedCode] = useState(null);

  const url = getAirlineLogoUrl(code);
  const broken = !url || failedCode === code;

  if (!broken) {
    return (
      <img
        src={url}
        alt={alt || `${name || code} airline logo`}
        loading="lazy"
        onError={() => setFailedCode(code)}
        className={className}
      />
    );
  }

  return (
    <div
      className={`tw:flex tw:items-center tw:justify-center tw:rounded ${
        fallback === "plane" ? "tw:bg-primary/5" : "tw:bg-gray-100"
      } ${fallbackClassName}`}
      role="img"
      aria-label={alt || `${name || code || "Airline"} logo unavailable`}
    >
      {fallback === "plane" ? (
        <Plane className="tw:w-10 tw:h-10 tw:text-primary/30" aria-hidden="true" />
      ) : (
        <span className="tw:text-sm tw:text-gray-500">{code}</span>
      )}
    </div>
  );
};

AirlineLogo.propTypes = {
  code: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string,
  fallbackClassName: PropTypes.string,
  fallback: PropTypes.oneOf(["code", "plane"]),
  alt: PropTypes.string,
};

export default AirlineLogo;
