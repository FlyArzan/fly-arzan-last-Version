import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePublicCmsPage } from "@/hooks/useCms";
import { FiSearch, FiX } from "react-icons/fi";

const AirportHubComponent = () => {
  const { t } = useTranslation();
  const { data: cmsData, isLoading } = usePublicCmsPage("airport_info");
  const content = cmsData?.content;
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const airportsPerPage = 15;

  // Filter airports based on search query
  const filteredAirports = (content?.airports || []).filter((airport) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      airport.name?.toLowerCase().includes(query) ||
      airport.iataCode?.toLowerCase().includes(query) ||
      airport.city?.toLowerCase().includes(query) ||
      airport.country?.toLowerCase().includes(query)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredAirports.length / airportsPerPage);
  const startIndex = (currentPage - 1) * airportsPerPage;
  const endIndex = startIndex + airportsPerPage;
  const currentAirports = filteredAirports.slice(startIndex, endIndex);

  // Reset to page 1 when search query changes
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
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

                  {/* Search Bar */}
                  <div style={{ marginTop: "24px", marginBottom: "32px", position: "relative" }}>
                    <div style={{ position: "relative" }}>
                      <FiSearch
                        style={{
                          position: "absolute",
                          left: "16px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#9ca3af",
                          fontSize: "20px",
                          pointerEvents: "none",
                        }}
                      />
                      <input
                        type="search"
                        placeholder="Search airports by name, city, or IATA code..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px 48px 12px 48px",
                          fontSize: "16px",
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          outline: "none",
                          transition: "border-color 0.3s",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#3B82F6")}
                        onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                      />
                      {searchQuery && (
                        <button
                          onClick={clearSearch}
                          style={{
                            position: "absolute",
                            right: "16px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#9ca3af",
                            fontSize: "20px",
                          }}
                          aria-label="Clear search"
                        >
                          <FiX />
                        </button>
                      )}
                    </div>
                    {searchQuery && (
                      <p style={{ marginTop: "8px", color: "#666", fontSize: "14px" }}>
                        Found {filteredAirports.length} airport{filteredAirports.length !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>

                  {/* Airports List */}
                  {currentAirports.length > 0 ? (
                    <>
                      {currentAirports.map((airport, index) => (
                        <div
                          key={index}
                          style={{
                            backgroundColor: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "12px",
                            padding: "24px",
                            marginBottom: "24px",
                            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          {/* City, Country & Flag */}
                          {(airport.city || airport.country) && (
                            <p
                              style={{
                                fontSize: "18px",
                                fontWeight: "700",
                                color: "#111827",
                                marginBottom: "8px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              {airport.city}
                              {airport.city && airport.country && ", "}
                              {airport.country}
                              {airport.flag && (
                                <span style={{ fontSize: "20px" }}>{airport.flag}</span>
                              )}
                            </p>
                          )}

                          {/* Airport Name & IATA Code */}
                          <p
                            style={{
                              fontSize: "20px",
                              fontWeight: "400",
                              color: "#374151",
                              marginBottom: "12px",
                            }}
                          >
                            {airport.name}
                            {airport.iataCode && (
                              <span style={{ color: "#6b7280" }}>
                                {" "}({airport.iataCode})
                              </span>
                            )}
                          </p>

                          {/* Introduction */}
                          {airport.introduction && (
                            <p
                              style={{
                                fontSize: "15px",
                                color: "#6b7280",
                                lineHeight: "1.6",
                                marginBottom: "20px",
                              }}
                            >
                              {airport.introduction}
                            </p>
                          )}

                          {/* Information Sections */}
                          {airport.sections && airport.sections.length > 0 && (
                            <div style={{ marginTop: "20px" }}>
                              <h4
                                style={{
                                  fontSize: "18px",
                                  fontWeight: "500",
                                  color: "#111827",
                                  marginBottom: "16px",
                                }}
                              >
                                Information Sections
                              </h4>
                              {airport.sections.map((section, sectionIndex) => (
                                <div
                                  key={sectionIndex}
                                  style={{ marginBottom: "16px" }}
                                >
                                  {section.title && (
                                    <p
                                      style={{
                                        fontSize: "16px",
                                        fontWeight: "600",
                                        color: "#374151",
                                        marginBottom: "6px",
                                      }}
                                    >
                                      {section.title}
                                    </p>
                                  )}
                                  {section.content && (
                                    <p
                                      style={{
                                        fontSize: "15px",
                                        color: "#6b7280",
                                        lineHeight: "1.6",
                                      }}
                                    >
                                      {section.content}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Travel Tips */}
                          {airport.tips && airport.tips.length > 0 && (
                            <div style={{ marginTop: "20px" }}>
                              <h4
                                style={{
                                  fontSize: "18px",
                                  fontWeight: "500",
                                  color: "#111827",
                                  marginBottom: "12px",
                                }}
                              >
                                Travel Tips
                              </h4>
                              <ul
                                style={{
                                  listStyleType: "disc",
                                  paddingLeft: "24px",
                                  margin: 0,
                                }}
                              >
                                {airport.tips.map((tip, tipIndex) => (
                                  <li
                                    key={tipIndex}
                                    style={{
                                      fontSize: "15px",
                                      color: "#6b7280",
                                      lineHeight: "1.6",
                                      marginBottom: "8px",
                                    }}
                                  >
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "8px",
                            marginTop: "32px",
                            marginBottom: "32px",
                          }}
                        >
                          <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            style={{
                              padding: "8px 16px",
                              fontSize: "14px",
                              fontWeight: "500",
                              color: currentPage === 1 ? "#9ca3af" : "#374151",
                              backgroundColor: "#fff",
                              border: "1px solid #e5e7eb",
                              borderRadius: "6px",
                              cursor: currentPage === 1 ? "not-allowed" : "pointer",
                              transition: "all 0.2s",
                            }}
                          >
                            Previous
                          </button>

                          <div style={{ display: "flex", gap: "4px" }}>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                              (page) => (
                                <button
                                  key={page}
                                  onClick={() => setCurrentPage(page)}
                                  style={{
                                    padding: "8px 12px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    color: currentPage === page ? "#fff" : "#374151",
                                    backgroundColor:
                                      currentPage === page ? "#3B82F6" : "#fff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                  }}
                                >
                                  {page}
                                </button>
                              )
                            )}
                          </div>

                          <button
                            onClick={() =>
                              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                            }
                            disabled={currentPage === totalPages}
                            style={{
                              padding: "8px 16px",
                              fontSize: "14px",
                              fontWeight: "500",
                              color:
                                currentPage === totalPages ? "#9ca3af" : "#374151",
                              backgroundColor: "#fff",
                              border: "1px solid #e5e7eb",
                              borderRadius: "6px",
                              cursor:
                                currentPage === totalPages ? "not-allowed" : "pointer",
                              transition: "all 0.2s",
                            }}
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "40px 20px",
                        backgroundColor: "#f9fafb",
                        borderRadius: "12px",
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <p style={{ color: "#6b7280", fontSize: "16px", margin: 0 }}>
                        {searchQuery
                          ? "No airports found matching your search."
                          : "No airport information available at this time."}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AirportHubComponent;
