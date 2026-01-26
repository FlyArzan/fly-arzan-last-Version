import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePublicCmsPage } from "@/hooks/useCms";
import { FiInfo, FiList, FiMapPin, FiX } from "react-icons/fi";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@/components/ui/combobox";
import { useDebounceValue } from "usehooks-ts";

const AirportHubComponent = () => {
  const { t } = useTranslation();
  const { data: cmsData, isLoading } = usePublicCmsPage("airport_info");
  const content = cmsData?.content;
  const [query, setQuery] = useDebounceValue("", 300);
  const [selectedAirport, setSelectedAirport] = useState(null);

  // Filter airports based on search query
  const filteredAirports = query.trim()
    ? (content?.airports || []).filter((airport) => {
        const searchTerm = query.toLowerCase();
        return (
          airport.name?.toLowerCase().includes(searchTerm) ||
          airport.iataCode?.toLowerCase().includes(searchTerm) ||
          airport.city?.toLowerCase().includes(searchTerm) ||
          airport.country?.toLowerCase().includes(searchTerm)
        );
      })
    : [];

  const handleAirportSelect = (airport) => {
    if (airport) {
      setSelectedAirport(airport);
    }
  };

  const closeModal = () => {
    setSelectedAirport(null);
  };

  return (
    <>
      <section className="PrivacyPolicysec1-sec top-margin">
        <div className="container">
          <div className="PrivacyPolicysec1-main">
            <div className="PrivacyPolicysec1-tital">
              <h2>{cmsData?.title || "Airport Information Hub"}</h2>

              {isLoading ? (
                <p>{t("common.loading", "Loading...")}</p>
              ) : (
                <>
                  {/* Hero Section */}
                  {content?.hero?.title && <h3>{content.hero.title}</h3>}
                  {content?.hero?.subtitle && <p>{content.hero.subtitle}</p>}

                  {/* Search Combobox */}
                  <div style={{ marginTop: "24px", marginBottom: "32px" }}>
                    <Combobox
                      value={null}
                      onChange={handleAirportSelect}
                      onClose={() => setQuery("")}
                    >
                      <div className="tw:relative">
                        <ComboboxInput
                          displayValue={() => ""}
                          onChange={(event) => setQuery(event.target.value)}
                          placeholder="Search airports by name, city, or IATA code..."
                          className="tw:w-full tw:py-3 tw:px-4 tw:text-base tw:border tw:border-gray-300 tw:rounded-lg tw:outline-none tw:transition-colors focus:tw:border-blue-500 focus:tw:ring-2 focus:tw:ring-blue-200"
                        />
                        <ComboboxOptions className="tw:w-[var(--input-width)]">
                          {query.trim() === "" ? (
                            <div className="tw:p-3 tw:text-center tw:text-sm tw:text-gray-500">
                              Type to search airports...
                            </div>
                          ) : filteredAirports.length === 0 ? (
                            <div className="tw:p-3 tw:text-center tw:text-sm tw:text-gray-500">
                              No airports found.
                            </div>
                          ) : (
                            filteredAirports.map((airport, index) => (
                              <ComboboxOption key={index} value={airport}>
                                <div className="tw:flex tw:items-start tw:gap-3 tw:w-full">
                                  <FiMapPin className="tw:text-blue-500 tw:text-lg tw:shrink-0 tw:mt-1" />
                                  <div className="tw:flex tw:flex-col tw:flex-1">
                                    <div className="tw:font-semibold tw:text-gray-900">
                                      {airport.name}
                                      {airport.iataCode && (
                                        <span className="tw:text-blue-500 tw:ml-2">
                                          ({airport.iataCode})
                                        </span>
                                      )}
                                    </div>
                                    <div className="tw:text-sm tw:text-gray-600 tw:flex tw:items-center tw:gap-1.5">
                                      {airport.city}
                                      {airport.city && airport.country && ", "}
                                      {airport.country}
                                      {airport.flag && (
                                        <span className="tw:text-base">{airport.flag}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </ComboboxOption>
                            ))
                          )}
                        </ComboboxOptions>
                      </div>
                    </Combobox>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Custom Modal for Airport Details */}
      <Dialog
        open={!!selectedAirport}
        onClose={closeModal}
        className="tw:relative tw:z-[99999]"
      >
        <DialogBackdrop className="tw:fixed tw:inset-0 tw:bg-black/50" />
        <div className="tw:fixed tw:inset-0 tw:flex tw:items-center tw:justify-center tw:p-4">
          <DialogPanel className="tw:w-full tw:max-w-4xl tw:max-h-[95vh] tw:bg-white tw:rounded-lg tw:shadow-xl tw:flex tw:flex-col tw:overflow-hidden">
            {selectedAirport && (
              <>
                {/* Header with City/Country and Close Button */}
                <div className="tw:flex tw:items-center tw:justify-between tw:px-6 tw:py-2 tw:border-b tw:border-gray-200 tw:shrink-0">
                  <div className="tw:flex tw:items-center tw:gap-2">
                    <h3 className="tw:text-xl! tw:font-bold tw:text-gray-900 tw:m-0">
                      {selectedAirport.city}
                      {selectedAirport.city && selectedAirport.country && ", "}
                      {selectedAirport.country}
                    </h3>
                    {selectedAirport.flag && (
                      <span className="tw:text-xl">{selectedAirport.flag}</span>
                    )}
                  </div>
                  <button
                    onClick={closeModal}
                    className="tw:p-2 tw:rounded-full hover:tw:bg-gray-100 tw:transition-colors"
                    aria-label="Close"
                  >
                    <FiX className="tw:text-gray-600 tw:text-xl" />
                  </button>
                </div>

                {/* Scrollable Body */}
                <div className="tw:flex-1 tw:overflow-y-auto tw:px-6 tw:py-4">
                  {/* Airport Name & IATA Code */}
                  <p className="tw:text-xl tw:font-normal tw:text-gray-700 tw:mb-2!">
                    {selectedAirport.name}
                    {selectedAirport.iataCode && (
                      <span className="tw:text-gray-500">
                        {" "}({selectedAirport.iataCode})
                      </span>
                    )}
                  </p>

                  {/* Introduction */}
                  {selectedAirport.introduction && (
                    <p className="tw:text-base tw:text-gray-600 tw:mb-4!">
                      {selectedAirport.introduction}
                    </p>
                  )}

                  {/* Information Sections */}
                  {selectedAirport.sections && selectedAirport.sections.length > 0 && (
                    <div className="tw:mb-4">
                      <div className="tw:flex tw:items-center tw:gap-2 tw:mb-2">
                        <FiInfo className="tw:text-gray-600 tw:size-5" />
                        <h4 className="tw:text-xl! tw:font-semibold tw:text-gray-900 tw:m-0">
                          Information Sections
                        </h4>
                      </div>
                      {selectedAirport.sections.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="tw:mb-5">
                          {section.title && (
                            <p className="tw:text-base tw:font-semibold tw:text-gray-700 tw:mb-2">
                              {section.title}
                            </p>
                          )}
                          {section.content && (
                            <p className="tw:text-base tw:text-gray-600 tw:leading-relaxed">
                              {section.content}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Travel Tips */}
                  {selectedAirport.tips && selectedAirport.tips.length > 0 && (
                    <div>
                      <div className="tw:flex tw:items-center tw:gap-2 tw:mb-2">
                        <FiList className="tw:text-gray-600 tw:size-5" />
                        <h4 className="tw:text-xl! tw:font-semibold tw:text-gray-900 tw:m-0">
                          Travel Tips
                        </h4>
                      </div>
                      <ul className="tw:list-disc tw:pl-6 tw:m-0">
                        {selectedAirport.tips.map((tip, tipIndex) => (
                          <li
                            key={tipIndex}
                            className="tw:text-base tw:text-gray-600 tw:leading-relaxed tw:mb-2"
                          >
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default AirportHubComponent;
