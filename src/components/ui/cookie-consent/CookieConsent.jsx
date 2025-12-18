import { useState, useEffect } from "react";
import { Cookie, Shield } from "lucide-react";
import { getCookieConsent, saveCookieConsent } from "@/utils/cookieUtils";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if consent has already been given
    const existingConsent = getCookieConsent();
    if (!existingConsent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allEnabled = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    saveCookieConsent(allEnabled);
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    saveCookieConsent(onlyNecessary);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Main cookie banner - positioned bottom right */}
      <div className="tw:fixed tw:z-[9999] tw:transition-all tw:duration-300 tw:bottom-0 tw:left-0 tw:right-0 tw:md:bottom-4 tw:md:right-4 tw:md:left-auto tw:md:max-w-md">
        <div className="tw:bg-white tw:rounded-t-2xl tw:md:rounded-2xl tw:shadow-2xl tw:border tw:border-gray-100 tw:overflow-hidden">
          {/* Header */}
          <div className="tw:flex tw:items-center tw:justify-between tw:p-4 tw:border-b tw:border-gray-100">
            <div className="tw:flex tw:items-center tw:gap-3">
              <div className="tw:p-2 tw:bg-primary/10 tw:rounded-full">
                <Cookie className="tw:w-5 tw:h-5 tw:text-primary" />
              </div>
              <h3 className="tw:font-semibold tw:text-gray-900">
                We value your privacy
              </h3>
            </div>
          </div>

          {/* Content */}
          <div className="tw:p-4 tw:max-h-[60vh] tw:overflow-y-auto">
            <p className="tw:text-sm tw:text-gray-600 tw:leading-relaxed tw:mb-3">
              We use cookies to enhance your browsing experience, analyze site
              traffic, and personalize content. By clicking &quot;Accept
              All&quot;, you consent to our use of cookies.
            </p>
            <div className="tw:flex tw:items-center tw:gap-2 tw:text-xs tw:text-gray-500">
              <Shield className="tw:w-4 tw:h-4" />
              <span>
                Your data is protected and never sold to third parties.
              </span>
            </div>
          </div>

          {/* Footer with actions */}
          <div className="tw:p-4 tw:border-t tw:border-gray-100 tw:bg-gray-50">
            <div className="tw:flex tw:flex-col tw:sm:flex-row tw:gap-2">
              <button
                onClick={handleAcceptAll}
                className="tw:flex-1 tw:bg-primary tw:text-white tw:font-medium tw:py-2.5 tw:px-4 tw:rounded-lg tw:hover:bg-primary/90 tw:transition-colors"
              >
                Accept All
              </button>
              <button
                onClick={handleRejectAll}
                className="tw:flex-1 tw:bg-gray-200 tw:text-gray-700 tw:font-medium tw:py-2.5 tw:px-4 tw:rounded-lg tw:hover:bg-gray-300 tw:transition-colors"
              >
                Reject All
              </button>
            </div>

            <p className="tw:text-xs tw:text-gray-500 tw:text-center tw:mt-4!">
              Learn more in our{" "}
              <a
                href="/PrivacyPolicy"
                className="tw:text-primary tw:hover:underline"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookieConsent;
