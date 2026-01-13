import { useTranslation } from "react-i18next";
import { usePublicCmsPage } from "@/hooks/useCms";

const Airportcomponet = () => {
  const { t } = useTranslation();
  const { data: cmsData, isLoading } = usePublicCmsPage("airport_info");
  const content = cmsData?.content;

  return (
    <>
      <section className="PrivacyPolicysec1-sec top-margin">
        <div className="container">
          <div className="PrivacyPolicysec1-main">
            <div className="PrivacyPolicysec1-tital">
              <h2>{cmsData?.title || "Airport Information"}</h2>
              
              {isLoading ? (
                <p>{t("common.loading", "Loading...")}</p>
              ) : (
                <>
                  {/* Hero Section */}
                  {content?.hero?.title && <h3>{content.hero.title}</h3>}
                  {content?.hero?.subtitle && <p>{content.hero.subtitle}</p>}

                  {/* Introduction */}
                  {content?.introduction && <p>{content.introduction}</p>}

                  {/* Content Sections */}
                  {content?.sections && content.sections.length > 0 && (
                    <>
                      {content.sections.map((section, index) => (
                        <div key={index}>
                          {section.title && <h3>{section.title}</h3>}
                          {section.content && <p>{section.content}</p>}
                        </div>
                      ))}
                    </>
                  )}

                  {/* Travel Tips */}
                  {content?.tips && content.tips.length > 0 && (
                    <>
                      <h3>Travel Tips</h3>
                      <ul>
                        {content.tips.map((tip, index) => (
                          <li key={index}>{tip}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {/* Fallback message if no content */}
                  {(!content || ((!content.sections || content.sections.length === 0) && (!content.tips || content.tips.length === 0))) && !isLoading && (
                    <p>No airport information available at this time.</p>
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

export default Airportcomponet;
