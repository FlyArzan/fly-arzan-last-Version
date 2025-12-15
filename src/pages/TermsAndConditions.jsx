// Terms & Conditions page with CMS integration
import Header from "../header-footer/HeaderOld2";
import Footer from "../header-footer/Footer";
import FlightSec4 from "../components/Landing_page_1_componets/FlightSec4";
import { usePublicCmsPage } from "../hooks/useCms";
import { useTranslation } from "react-i18next";

const TermsAndConditions = () => {
  const { t } = useTranslation();
  const { data: cmsData, isLoading } = usePublicCmsPage("terms_and_conditions");
  const content = cmsData?.content;

  return (
    <>
      <Header />
      <section className="PrivacyPolicysec1-sec">
        <div className="container">
          <div className="PrivacyPolicysec1-main">
            <div className="PrivacyPolicysec1-tital">
              <h2>
                {cmsData?.title ||
                  t("TermsAndConditions.title", "Terms & Conditions")}
              </h2>

              {isLoading ? (
                <p>{t("common.loading", "Loading...")}</p>
              ) : content?.blocks?.length > 0 ? (
                // Render CMS content blocks
                content.blocks.map((block, index) => (
                  <div key={index}>
                    {block.heading && <h3>{block.heading}</h3>}
                    {block.text && <p>{block.text}</p>}
                    {block.list && (
                      <ul>
                        {block.list.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              ) : (
                // Default content if CMS is empty
                <>
                  <p>
                    Welcome to Fly Arzan. By accessing and using our website,
                    you agree to be bound by these Terms & Conditions. Please
                    read them carefully before using our services.
                  </p>

                  <h3>1. Service Description</h3>
                  <p>
                    Fly Arzan is a travel search engine that helps users compare
                    flight prices from various airlines and travel providers. We
                    do not sell tickets directly; instead, we redirect users to
                    third-party booking websites to complete their purchases.
                  </p>

                  <h3>2. User Responsibilities</h3>
                  <p>
                    Users are responsible for ensuring the accuracy of their
                    search queries and personal information. We are not liable
                    for any errors made during the booking process on
                    third-party websites.
                  </p>

                  <h3>3. Third-Party Services</h3>
                  <p>
                    When you click on a booking link, you will be redirected to
                    a third-party website. These websites have their own terms
                    and conditions, privacy policies, and booking procedures.
                    Fly Arzan is not responsible for the services, prices, or
                    policies of these third-party providers.
                  </p>

                  <h3>4. Price Accuracy</h3>
                  <p>
                    While we strive to display accurate and up-to-date prices,
                    flight prices can change frequently. The final price will be
                    confirmed on the booking provider&apos;s website. We are not
                    responsible for any price discrepancies between our website
                    and the booking provider.
                  </p>

                  <h3>5. Intellectual Property</h3>
                  <p>
                    All content on this website, including text, graphics,
                    logos, and software, is the property of Fly Arzan and is
                    protected by intellectual property laws. Unauthorized use of
                    any content is prohibited.
                  </p>

                  <h3>6. Limitation of Liability</h3>
                  <p>
                    Fly Arzan shall not be liable for any direct, indirect,
                    incidental, or consequential damages arising from the use of
                    our website or services. This includes, but is not limited
                    to, damages for loss of profits, data, or other intangible
                    losses.
                  </p>

                  <h3>7. Changes to Terms</h3>
                  <p>
                    We reserve the right to modify these Terms & Conditions at
                    any time. Changes will be effective immediately upon posting
                    on this page. Your continued use of the website constitutes
                    acceptance of the modified terms.
                  </p>

                  <h3>8. Contact Us</h3>
                  <p>
                    If you have any questions about these Terms & Conditions,
                    please contact us through our Contact page.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      <FlightSec4 />
      <Footer />
    </>
  );
};

export default TermsAndConditions;
