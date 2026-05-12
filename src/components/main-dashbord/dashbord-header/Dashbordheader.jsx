import React from "react";
import admindp from "../../../assets/Images/admin-dp.png";
import Drophead from "../../drop-dwon/Drophead";
import logo from "../../../assets/Images/logo.png";
const Dashbordheader = () => {


  return (
    <>
      <header className="Dashbordheader">
        <div className="main-Dashbordheader">
          <div className="Dashbordheader-logo">
            <img src={logo} alt="Fly Arzan" />
          </div>
          <div className="Dashbordheader-box">
            <div className="Dashbordheader-tital">
              <h2>Dashboard</h2>
    
            </div>

            <div className="Dashbordheader-Admin-box">
              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="22" viewBox="0 0 19 22" fill="none">
                <path d="M0.965965 12.5682V12.3492C0.998213 11.7002 1.20554 11.072 1.56597 10.5312C2.1688 9.88328 2.58366 9.08329 2.76597 8.21725C2.76597 7.55125 2.76597 6.87525 2.82397 6.20825C3.12097 2.99925 6.29297 0.78125 9.42697 0.78125H9.50496C12.639 0.78125 15.811 2.99925 16.122 6.20825C16.18 6.87425 16.122 7.55025 16.171 8.21725C16.3543 9.08454 16.767 9.88675 17.366 10.5402C17.7292 11.0763 17.9368 11.7024 17.966 12.3492V12.5583C17.9868 13.4314 17.6865 14.2818 17.122 14.9482C16.3673 15.736 15.3526 16.2231 14.266 16.3193C11.0701 16.662 7.8468 16.662 4.65097 16.3193C3.56769 16.2174 2.55668 15.731 1.80097 14.9482C1.24473 14.2816 0.948187 13.4363 0.965965 12.5682V12.5682Z" stroke="#50ADD8" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M7.02094 19.6328C7.52501 20.2621 8.25701 20.6671 9.05793 20.7598C9.86143 20.8537 10.6697 20.6286 11.3089 20.1328C11.5039 19.9888 11.68 19.8208 11.8329 19.6328" stroke="#50ADD8" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div className="Dashbordheader-Admin-dp-box">
                <div className="Dashbordheader-Admin-dp">
                  <img src={admindp} alt="Administrator profile" />
                </div>
                <div className="Dashbordheader-Admin-id">
                  <Drophead />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Dashbordheader;
