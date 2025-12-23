import { useState } from "react";
import { useTranslation } from "react-i18next";

const Contactsec1 = ({ content }) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    companyName: "",
    phone: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    // Prevent default submission
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        // Reset form
        setFormData({
          fullName: "",
          email: "",
          companyName: "",
          phone: "",
          message: ""
        });
      } else {
        alert(data.error || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Use CMS content if available
  const contactInfo = content?.contactInfo || [];
  // socialLinks could be used in the future to dynamically render social icons
  const formSettings = content?.formSettings || {};

  // Get contact info by type
  const getContactByType = (type) => contactInfo.find((c) => c.type === type);
  const emailInfo = getContactByType("email");
  const addressInfo = getContactByType("address");

  return (
    <>
      <section className="Contactsec1-sec">
        <div className="container">
          <div className="Contactsec1-main">
            <div className="Contactsec1-box">
              <div className="Contactsec1-box-tital">
                <h2>{emailInfo?.label || t("ContactUspage.para1")}</h2>
                <p>{emailInfo?.value || t("ContactUspage.para2")}</p>
              </div>

              <div className="Contactsec1-box-tital">
                <h2>{addressInfo?.label || t("ContactUspage.para4")}</h2>
                <p>{addressInfo?.value || t("ContactUspage.para6")}</p>
              </div>

              <div className="Contactsec1-box-tital">
                <h2>{t("ContactUspage.para7")}</h2>
                <p>
                  {content?.address?.city
                    ? `${content.address.city}, ${content.address.country}`
                    : t("ContactUspage.para8")}
                </p>
              </div>

              <div className="Social-Media-box">
                {/* <h2>{ t(`ContactUspage.para10`)}</h2> */}
                <div className="Social-Media-icon">
                  <a
                    href="
https://www.facebook.com/profile.php?id=61571147600625
"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 48 48"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_454_2165)">
                        <path
                          d="M48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 35.9789 8.77641 45.908 20.25 47.7084V30.9375H14.1562V24H20.25V18.7125C20.25 12.6975 23.8331 9.375 29.3152 9.375C31.9402 9.375 34.6875 9.84375 34.6875 9.84375V15.75H31.6613C28.68 15.75 27.75 17.6002 27.75 19.5V24H34.4062L33.3422 30.9375H27.75V47.7084C39.2236 45.908 48 35.9789 48 24Z"
                          fill="#1A1A1A"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_454_2165">
                          <rect width="48" height="48" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </a>
                  <a
                    href="https://x.com/flyArzan"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      id="Capa_1"
                      enable-background="new 0 0 1227 1227"
                      viewBox="0 0 1227 1227"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g>
                        <path d="m613.5 0c-338.815 0-613.5 274.685-613.5 613.5s274.685 613.5 613.5 613.5 613.5-274.685 613.5-613.5-274.685-613.5-613.5-613.5z" />
                        <path
                          d="m680.617 557.98 262.632-305.288h-62.235l-228.044 265.078-182.137-265.078h-210.074l275.427 400.844-275.427 320.142h62.239l240.82-279.931 192.35 279.931h210.074l-285.641-415.698zm-335.194-258.435h95.595l440.024 629.411h-95.595z"
                          fill="#fff"
                        />
                      </g>
                      <g />
                      <g />
                      <g />
                      <g />
                      <g />
                      <g />
                      <g />
                      <g />
                      <g />
                      <g />
                      <g />
                      <g />
                      <g />
                      <g />
                      <g />
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com/flyarzan/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="49"
                      height="48"
                      viewBox="0 0 49 48"
                      fill="none"
                    >
                      <path
                        d="M24.6846 4.32187C31.0971 4.32187 31.8564 4.35 34.3783 4.4625C36.7221 4.56562 37.9877 4.95938 38.8314 5.2875C39.9471 5.71875 40.7533 6.24375 41.5877 7.07812C42.4314 7.92188 42.9471 8.71875 43.3783 9.83438C43.7064 10.6781 44.1002 11.9531 44.2033 14.2875C44.3158 16.8187 44.3439 17.5781 44.3439 23.9813C44.3439 30.3938 44.3158 31.1531 44.2033 33.675C44.1002 36.0188 43.7064 37.2844 43.3783 38.1281C42.9471 39.2438 42.4221 40.05 41.5877 40.8844C40.7439 41.7281 39.9471 42.2438 38.8314 42.675C37.9877 43.0031 36.7127 43.3969 34.3783 43.5C31.8471 43.6125 31.0877 43.6406 24.6846 43.6406C18.2721 43.6406 17.5127 43.6125 14.9908 43.5C12.6471 43.3969 11.3814 43.0031 10.5377 42.675C9.42207 42.2438 8.61582 41.7188 7.78145 40.8844C6.9377 40.0406 6.42207 39.2438 5.99082 38.1281C5.6627 37.2844 5.26895 36.0094 5.16582 33.675C5.05332 31.1438 5.0252 30.3844 5.0252 23.9813C5.0252 17.5688 5.05332 16.8094 5.16582 14.2875C5.26895 11.9437 5.6627 10.6781 5.99082 9.83438C6.42207 8.71875 6.94707 7.9125 7.78145 7.07812C8.6252 6.23438 9.42207 5.71875 10.5377 5.2875C11.3814 4.95938 12.6564 4.56562 14.9908 4.4625C17.5127 4.35 18.2721 4.32187 24.6846 4.32187ZM24.6846 0C18.1689 0 17.3533 0.028125 14.7939 0.140625C12.2439 0.253125 10.4908 0.665625 8.97207 1.25625C7.3877 1.875 6.04707 2.69062 4.71582 4.03125C3.3752 5.3625 2.55957 6.70313 1.94082 8.27813C1.3502 9.80625 0.937695 11.55 0.825195 14.1C0.712695 16.6687 0.68457 17.4844 0.68457 24C0.68457 30.5156 0.712695 31.3313 0.825195 33.8906C0.937695 36.4406 1.3502 38.1938 1.94082 39.7125C2.55957 41.2969 3.3752 42.6375 4.71582 43.9688C6.04707 45.3 7.3877 46.125 8.9627 46.7344C10.4908 47.325 12.2346 47.7375 14.7846 47.85C17.3439 47.9625 18.1596 47.9906 24.6752 47.9906C31.1908 47.9906 32.0064 47.9625 34.5658 47.85C37.1158 47.7375 38.8689 47.325 40.3877 46.7344C41.9627 46.125 43.3033 45.3 44.6346 43.9688C45.9658 42.6375 46.7908 41.2969 47.4002 39.7219C47.9908 38.1938 48.4033 36.45 48.5158 33.9C48.6283 31.3406 48.6564 30.525 48.6564 24.0094C48.6564 17.4938 48.6283 16.6781 48.5158 14.1188C48.4033 11.5688 47.9908 9.81563 47.4002 8.29688C46.8096 6.70312 45.9939 5.3625 44.6533 4.03125C43.3221 2.7 41.9814 1.875 40.4064 1.26562C38.8783 0.675 37.1346 0.2625 34.5846 0.15C32.0158 0.028125 31.2002 0 24.6846 0Z"
                        fill="#1A1A1A"
                      />
                      <path
                        d="M24.6855 11.6719C17.8793 11.6719 12.3574 17.1938 12.3574 24C12.3574 30.8062 17.8793 36.3281 24.6855 36.3281C31.4918 36.3281 37.0137 30.8062 37.0137 24C37.0137 17.1938 31.4918 11.6719 24.6855 11.6719ZM24.6855 31.9969C20.2699 31.9969 16.6887 28.4156 16.6887 24C16.6887 19.5844 20.2699 16.0031 24.6855 16.0031C29.1012 16.0031 32.6824 19.5844 32.6824 24C32.6824 28.4156 29.1012 31.9969 24.6855 31.9969Z"
                        fill="#1A1A1A"
                      />
                      <path
                        d="M40.3773 11.1867C40.3773 12.7805 39.0836 14.0649 37.4992 14.0649C35.9055 14.0649 34.6211 12.7711 34.6211 11.1867C34.6211 9.59297 35.9148 8.30859 37.4992 8.30859C39.0836 8.30859 40.3773 9.60235 40.3773 11.1867Z"
                        fill="#1A1A1A"
                      />
                    </svg>
                  </a>
                  <a
                    href="www.linkedin.com/in/fly-arzan-75228135b"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="49"
                      height="48"
                      viewBox="0 0 49 48"
                      fill="none"
                    >
                      <path
                        d="M44.9762 0H4.07305C2.11367 0 0.529297 1.54688 0.529297 3.45938V44.5312C0.529297 46.4437 2.11367 48 4.07305 48H44.9762C46.9355 48 48.5293 46.4438 48.5293 44.5406V3.45938C48.5293 1.54688 46.9355 0 44.9762 0ZM14.7699 40.9031H7.64492V17.9906H14.7699V40.9031ZM11.2074 14.8688C8.91992 14.8688 7.07305 13.0219 7.07305 10.7437C7.07305 8.46562 8.91992 6.61875 11.2074 6.61875C13.4855 6.61875 15.3324 8.46562 15.3324 10.7437C15.3324 13.0125 13.4855 14.8688 11.2074 14.8688ZM41.4324 40.9031H34.3168V29.7656C34.3168 27.1125 34.2699 23.6906 30.6137 23.6906C26.9105 23.6906 26.348 26.5875 26.348 29.5781V40.9031H19.2418V17.9906H26.0668V21.1219H26.1605C27.1074 19.3219 29.4324 17.4188 32.8918 17.4188C40.1012 17.4188 41.4324 22.1625 41.4324 28.3313V40.9031V40.9031Z"
                        fill="#1A1A1A"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="Contactsec1-form-box">
              <h2>{formSettings?.title || t("ContactUspage.titel1")}</h2>
              <p>{formSettings?.subtitle || t("ContactUspage.text1")}</p>

              {isSubmitted ? (
                <div className="Contactsec1-form" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '30px', gap: '10px' }}>
                  <div style={{ fontSize: '3rem', color: '#28a745', lineHeight: '1' }}>✓</div>
                  <h3>Thank You!</h3>
                  <p className="tw:p-0! tw:text-lg">Your message has been sent successfully.</p>
                  <p className="tw:p-0! tw:text-lg! tw:text-gray-500!">We will review your inquiry and get back to you shortly.</p>
                </div>
              ) : (
                <form className="Contactsec1-form" onSubmit={handleSubmit}>
                  <div className="Contactsec1-form-input">
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="Contactsec1-form-input">
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="Contactsec1-form-input">
                    <input
                      type="text"
                      name="companyName"
                      placeholder="Company Name"
                      value={formData.companyName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="Contactsec1-form-input">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="Contactsec1-form-input textarea-box">
                    <textarea
                      name="message"
                      placeholder="Message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  <div className="Submit-box">
                    <button type="submit" disabled={isLoading}>
                      {isLoading ? "Sending..." : t(`buttons.Submit`)}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contactsec1;
