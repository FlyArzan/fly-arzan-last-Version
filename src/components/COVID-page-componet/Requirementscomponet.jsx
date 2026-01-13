import { useTranslation } from "react-i18next";
import { usePublicCmsPage } from "@/hooks/useCms";

const Requirementscomponet = () => {
  const { t } = useTranslation();
  const { data: cmsData, isLoading } = usePublicCmsPage("visa_requirements");
  const content = cmsData?.content;

  return (
    <>
      <section className="PrivacyPolicysec1-sec top-margin">
        <div className="container">
          <div className="PrivacyPolicysec1-main">
            <div className="PrivacyPolicysec1-tital">
              <h2>{cmsData?.title || "Visa Requirements"}</h2>
              
              {isLoading ? (
                <p>{t("common.loading", "Loading...")}</p>
              ) : (
                <>
                  {/* Hero Section */}
                  {content?.hero?.title && <h3>{content.hero.title}</h3>}
                  {content?.hero?.subtitle && <p>{content.hero.subtitle}</p>}

                  {/* Introduction */}
                  {content?.introduction && <p>{content.introduction}</p>}

                  {/* Countries */}
                  {content?.countries && content.countries.length > 0 && (
                    <>
                      {content.countries.map((country, index) => (
                        <div key={index} style={{ marginBottom: index < content.countries.length - 1 ? "40px" : "0" }}>
                          <h3 style={{ marginBottom: "12px" }}>
                            {country.flag && <span style={{ marginRight: "8px" }}>{country.flag}</span>}
                            {country.name}
                          </h3>
                          
                          {country.visaRequired !== undefined && (
                            <p style={{ 
                              fontSize: "16px", 
                              color: "#666", 
                              marginBottom: "8px",
                              fontWeight: "500"
                            }}>
                              <span style={{ 
                                color: country.visaRequired ? "#d32f2f" : "#2e7d32",
                                fontWeight: "600"
                              }}>
                                Visa Required:
                              </span> {country.visaRequired ? "Yes" : "No"}
                            </p>
                          )}
                          
                          {country.requirements && (
                            <div style={{ marginTop: "12px" }}>
                              <p style={{ 
                                fontSize: "15px", 
                                color: "#666",
                                lineHeight: "24px",
                                marginBottom: "8px"
                              }}>
                                <strong style={{ color: "#555" }}>Requirements:</strong> {country.requirements}
                              </p>
                            </div>
                          )}
                          
                          {country.processingTime && (
                            <p style={{ 
                              fontSize: "15px", 
                              color: "#666",
                              marginBottom: "6px"
                            }}>
                              <strong style={{ color: "#555" }}>Processing Time:</strong> {country.processingTime}
                            </p>
                          )}
                          
                          {country.validityPeriod && (
                            <p style={{ 
                              fontSize: "15px", 
                              color: "#666",
                              marginBottom: "6px"
                            }}>
                              <strong style={{ color: "#555" }}>Validity Period:</strong> {country.validityPeriod}
                            </p>
                          )}
                          
                          {country.notes && (
                            <div style={{ marginTop: "12px" }}>
                              <p style={{ 
                                fontSize: "15px", 
                                color: "#666",
                                lineHeight: "24px"
                              }}>
                                <strong style={{ color: "#555" }}>Additional Notes:</strong> {country.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  )}

                  {/* General Info */}
                  {content?.generalInfo && (
                    <>
                      <h3>General Information</h3>
                      <p>{content.generalInfo}</p>
                    </>
                  )}

                  {/* Fallback message if no content */}
                  {(!content || (!content.countries || content.countries.length === 0)) && !isLoading && (
                    <p>No visa requirements information available at this time.</p>
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

export default Requirementscomponet;
