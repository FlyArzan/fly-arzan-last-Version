import { useTranslation } from "react-i18next";

const PrivacyPolicysec1 = ({ content }) => {
  const { t } = useTranslation();

  // Use CMS content if available
  const hasCmsContent =
    content && content.sections && content.sections.length > 0;

  // Render CMS-based content
  if (hasCmsContent) {
    return (
      <section className="PrivacyPolicysec1-sec">
        <div className="container">
          <div className="PrivacyPolicysec1-main">
            <div className="PrivacyPolicysec1-tital">
              <h2>Privacy Policy</h2>
              {content.lastUpdated && (
                <p className="last-updated">
                  Last Updated: {content.lastUpdated}
                </p>
              )}
              {content.introduction && <p>{content.introduction}</p>}

              {content.sections.map((section, index) => (
                <div key={index}>
                  <h3>{section.heading}</h3>
                  {section.content && <p>{section.content}</p>}
                  {section.bulletPoints && section.bulletPoints.length > 0 && (
                    <ul>
                      {section.bulletPoints.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Fallback to translation-based content
  return (
    <section className="PrivacyPolicysec1-sec">
      <div className="container">
        <div className="PrivacyPolicysec1-main">
          <div className="PrivacyPolicysec1-tital">
            <h2>{t("PrivacyPolicypage.heading1")}</h2>
            <p>{t("PrivacyPolicypage.para")}</p>

            <h3>{t("PrivacyPolicypage.heading")}</h3>
            <p>{t("PrivacyPolicypage.text1")}</p>
            <h3>{t("PrivacyPolicypage.text2")}</h3>
            <p>{t("PrivacyPolicypage.text3")}</p>
            <h3>{t("PrivacyPolicypage.text4")}</h3>

            <ul>
              <li>{t("PrivacyPolicypage.text5")}</li>
              <li>{t("PrivacyPolicypage.text6")}</li>
              <li>{t("PrivacyPolicypage.text7")}</li>
            </ul>

            <h3>{t("PrivacyPolicypage.text8")}</h3>
            <p>{t("PrivacyPolicypage.text9")}</p>

            <ul>
              <li>{t("PrivacyPolicypage.text10")}</li>
              <li>{t("PrivacyPolicypage.text11")}</li>
              <li>{t("PrivacyPolicypage.text12")}</li>
            </ul>

            <p>{t("PrivacyPolicypage.text13")}</p>
            <h3>{t("PrivacyPolicypage.text14")}</h3>
            <p>{t("PrivacyPolicypage.text15")}</p>

            <ul>
              <li>{t("PrivacyPolicypage.text16")}</li>
              <li>{t("PrivacyPolicypage.text17")}</li>
              <li>{t("PrivacyPolicypage.text18")}</li>
            </ul>

            <p>{t("PrivacyPolicypage.text19")}</p>
            <h3>{t("PrivacyPolicypage.text20")}</h3>
            <p>{t("PrivacyPolicypage.text21")}</p>

            <ul>
              <li>{t("PrivacyPolicypage.text22")}</li>
              <li>{t("PrivacyPolicypage.text23")}</li>
              <li>{t("PrivacyPolicypage.text24")}</li>
            </ul>
            <h3>{t("PrivacyPolicypage.text25")}</h3>
            <p>{t("PrivacyPolicypage.text26")}</p>

            <ul>
              <li>{t("PrivacyPolicypage.text27")}</li>
              <li>{t("PrivacyPolicypage.text28")}</li>
              <li>{t("PrivacyPolicypage.text29")}</li>
            </ul>

            <p>{t("PrivacyPolicypage.text30")}</p>
            <h3>{t("PrivacyPolicypage.text31")}</h3>
            <p>{t("PrivacyPolicypage.text32")}</p>

            <ul>
              <li>{t("PrivacyPolicypage.text33")}</li>
              <li>{t("PrivacyPolicypage.text34")}</li>
              <li>{t("PrivacyPolicypage.text35")}</li>
            </ul>

            <h3>{t("PrivacyPolicypage.text36")}</h3>
            <p>{t("PrivacyPolicypage.text37")}</p>

            <h3>{t("PrivacyPolicypage.text38")}</h3>
            <p>{t("PrivacyPolicypage.text39")}</p>

            <h3>{t("PrivacyPolicypage.text40")}</h3>

            <h3>{t("PrivacyPolicypage.text41")}</h3>

            <p>{t("PrivacyPolicypage.text42")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicysec1;
