import { useTranslation } from "react-i18next";

const Contacthero = ({ content }) => {
  const { t } = useTranslation();

  // Use CMS content if available, fallback to translations
  const title = content?.title || t("ContactUspage.heading");
  const subtitle = content?.subtitle;

  return (
    <section className="Abouthero-sec top-margin">
      <div className="container">
        <div className="Abouthero-main">
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
    </section>
  );
};

export default Contacthero;
