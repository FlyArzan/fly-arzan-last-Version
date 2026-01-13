import { usePublicCmsPage } from "@/hooks/useCms";

const COVIDcomponet = () => {
  const { data: cmsData, isLoading, error } = usePublicCmsPage("covid_19_info");
  const content = cmsData?.content;

  return (
    <section className="PrivacyPolicysec1-sec top-margin">
      <div className="container">
        <div className="PrivacyPolicysec1-main">
          <div className="PrivacyPolicysec1-tital">
            {isLoading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error loading COVID-19 information</p>
            ) : (
              <>
                <h2>{cmsData?.title || "COVID-19 Travel Information"}</h2>
                
                {/* Hero Section */}
                {content?.hero?.title && <h3>{content.hero.title}</h3>}
                {content?.hero?.subtitle && <p>{content.hero.subtitle}</p>}
                
                {/* Introduction */}
                {content?.introduction && <p>{content.introduction}</p>}
                
                {/* Guidelines */}
                {content?.guidelines && content.guidelines.length > 0 && (
                  <>
                    <h3>Travel Guidelines</h3>
                    {content.guidelines.map((guideline, index) => (
                      <div key={index}>
                        {guideline.title && <h3>{guideline.title}</h3>}
                        {guideline.description && <p>{guideline.description}</p>}
                      </div>
                    ))}
                  </>
                )}
                
                {/* Travel Restrictions */}
                {content?.travelRestrictions && (
                  <>
                    <h3>Travel Restrictions</h3>
                    <p>{content.travelRestrictions}</p>
                  </>
                )}
                
                {/* Health Requirements */}
                {content?.healthRequirements && (
                  <>
                    <h3>Health Requirements</h3>
                    <p>{content.healthRequirements}</p>
                  </>
                )}
                
                {/* Last Updated */}
                {content?.lastUpdated && (
                  <p style={{ paddingTop: "35px", fontStyle: "italic" }}>
                    Last Updated: {new Date(content.lastUpdated).toLocaleDateString()}
                  </p>
                )}
                
                {/* Fallback message if no content */}
                {(!content || Object.keys(content).length === 0) && !isLoading && (
                  <p>No COVID-19 information available at this time.</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default COVIDcomponet;
