import ProgressBar from "../ProgressBar/ProgressBar";
import { useTranslation } from "react-i18next";

const Aboutsec1 = ({ content }) => {
  const tasks = [
    { task: "Flight Booking", percentage: 90 },
    { task: "Hotel Booking", percentage: 70 },
    { task: "Rent Car Booking", percentage: 85 },
  ];
  const { t } = useTranslation();

  // Use CMS content if available, fallback to translations
  const title = content?.title || t("AboutUs.Who_We_Are");
  const paragraphs = content?.paragraphs || [
    t("AboutUs.text1"),
    t("AboutUs.text2"),
    t("AboutUs.text3"),
    t("AboutUs.text4"),
    t("AboutUs.text5"),
  ];

  return (
    <section className="Aboutsec1-sec">
      <div className="container">
        <div className="Aboutsec1-main">
          <div className="Aboutsec1-tital">
            <h2>{title}</h2>
            {paragraphs.map((text, index) => (
              <p key={index}>{text}</p>
            ))}
          </div>
          <div className="Aboutsec1-bar-box">
            {tasks.map((item, index) => (
              <div className="Aboutsec1-bar-card" key={index}>
                <ProgressBar task={item.task} percentage={item.percentage} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Aboutsec1;
