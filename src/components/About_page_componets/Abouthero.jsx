import { useTranslation } from "react-i18next";

const Abouthero = ({ content }) => {
  const { t } = useTranslation();

  // Use CMS content if available, fallback to translations
  const heading = content?.heading || t("AboutUs.heading");
  const subheading = content?.subheading;

  return (
    <section className="Abouthero-sec top-margin">
      <div className="container">
        <div className="Abouthero-main">
          <h2>{heading}</h2>
          {subheading && <p>{subheading}</p>}
        </div>
      </div>
    </section>
  );
};

export default Abouthero;
