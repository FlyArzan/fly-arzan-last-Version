import { useTranslation } from "react-i18next";

const FaqInnerhero = ({ content }) => {
  const { t } = useTranslation();

  // Use CMS content if available, fallback to translations
  const title = content?.title || t("Faqpage.heading");
  const subtitle = content?.subtitle;

  return (
    <section className="FaqInnerhero-sec top-margin">
      <div className="container">
        <div className="FaqInnerhero-main">
          <div className="FaqInnerhero-tital">
            <h2>{title}</h2>
            {subtitle && <p className="faq-subtitle">{subtitle}</p>}
          </div>
          <div className="FaqInnerhero-Search-box">
            <input type="text" placeholder={t("Faqpage.input")} />
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="26"
                viewBox="0 0 25 26"
                fill="none"
              >
                <g clipPath="url(#clip0_178_156)">
                  <path
                    d="M24.2011 23.5347L18.251 17.3464C19.7809 15.5277 20.6191 13.2395 20.6191 10.8574C20.6191 5.29181 16.091 0.763672 10.5254 0.763672C4.95978 0.763672 0.431641 5.29181 0.431641 10.8574C0.431641 16.423 4.95978 20.9512 10.5254 20.9512C12.6148 20.9512 14.6059 20.321 16.3082 19.1246L22.3035 25.3599C22.554 25.6202 22.8911 25.7637 23.2523 25.7637C23.5941 25.7637 23.9185 25.6333 24.1647 25.3963C24.6878 24.893 24.7045 24.0583 24.2011 23.5347ZM10.5254 3.39682C14.6392 3.39682 17.986 6.74356 17.986 10.8574C17.986 14.9713 14.6392 18.318 10.5254 18.318C6.41152 18.318 3.06479 14.9713 3.06479 10.8574C3.06479 6.74356 6.41152 3.39682 10.5254 3.39682Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_178_156">
                    <rect
                      width="25"
                      height="25"
                      fill="white"
                      transform="translate(0 0.763672)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqInnerhero;
