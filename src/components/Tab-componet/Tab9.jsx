import React, { useContext, useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import flylogo from "../../assets/Images/HotelsInner1.png";
import DropMoreFilters from "../drop-dwon/DropMoreFilters";
import { Link } from "react-router-dom";
import DropSort from "../drop-dwon/DropSort";
import DropPrice from "../drop-dwon/DropPrice";
import Propertytype from "../drop-dwon/Propertytype";
import DropLocation from "../drop-dwon/DropLocation";
import DropmainFrequently from "../drop-dwon/DropmainFrequently";
import DropAmenities from "../drop-dwon/DropAmenities";
import DropStar from "../drop-dwon/DropStar";

import { useGet } from "../../utils/ApiMethod";
import { HotelContext } from "../../context/HotelContext";
import Map from "../google_component/Map";
import DropSuppliers from "../drop-dwon/DropSuppliers";
import DropPolicies from "../drop-dwon/DropPolicies";
import DropCarfeatures from "../drop-dwon/DropCarfeatures";
import DropBrand from "../drop-dwon/DropBrand";
import ProgressBar from "../ProgressBar/ProgressBar";
import DropMoreFilter from "../drop-dwon/DropMoreFilter";
import { useTranslation } from "react-i18next";
import DropMoreFilterHotel from "../drop-dwon/DropMoreFilterHotel";

const RatingStars = ({ rating }) => {

  
  
  return (
    <div className="Suggested-Hotels-rateing">
      {Array(5)
        .fill(null)
        .map((_, index) => (
          <svg
            key={index}
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="#FFC700"
          >
            <path d="M6.56457 1.44072C6.86392 0.519411 8.16733 0.519412 8.46668 1.44072L9.4149 4.35902C9.54877 4.77105 9.93272 5.05001 10.366 5.05001H13.4344C14.4032 5.05001 14.8059 6.28962 14.0222 6.85902L11.5398 8.66263C11.1893 8.91728 11.0426 9.36864 11.1765 9.78067L12.1247 12.699C12.4241 13.6203 11.3696 14.3864 10.5859 13.817L8.10341 12.0134C7.75292 11.7587 7.27833 11.7587 6.92784 12.0134L4.44538 13.817C3.66167 14.3864 2.60719 13.6203 2.90654 12.699L3.85476 9.78067C3.98863 9.36864 3.84197 8.91728 3.49149 8.66263L1.00903 6.85902C0.225316 6.28962 0.628092 5.05001 1.59681 5.05001H4.6653C5.09853 5.05001 5.48248 4.77105 5.61635 4.35902L6.56457 1.44072Z" />
          </svg>
        ))}
    </div>
  );
};

const Tab9 = () => {
  const { contextHotelData } = useContext(HotelContext);
  const [moreFil, setMoreFil] = useState(false);
  const [progress, setProgress] = useState(100);

  const [hotelIds, setHotelIds] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [locationFilter, setLocationFilter] = useState({});
  const [mapShow, setMapShow] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const { t } = useTranslation();
  const hotelsDataCusArr = [
    {
      id: 1,
      name: "The George Hotel by Saffron Dubai Creek",
      address: "Baniyas Rd, Deira, Dubai, United Arab Emirates, 3944",
      rating: 5.0,
      imgSrc: flylogo,
    },

    {
      id: 2,
      name: "The George Hotel by Saffron Dubai Creek",
      address: "Baniyas Rd, Deira, Dubai, United Arab Emirates, 3944",
      rating: 5.0,
      imgSrc: flylogo,
    },

    {
      id: 3,
      name: "The George Hotel by Saffron Dubai Creek",
      address: "Baniyas Rd, Deira, Dubai, United Arab Emirates, 3944",
      rating: 5.0,
      imgSrc: flylogo,
    },

    {
      id: 4,
      name: "The George Hotel by Saffron Dubai Creek",
      address: "Baniyas Rd, Deira, Dubai, United Arab Emirates, 3944",
      rating: 5.0,
      imgSrc: flylogo,
    },

    {
      id: 5,
      name: "The George Hotel by Saffron Dubai Creek",
      address: "Baniyas Rd, Deira, Dubai, United Arab Emirates, 3944",
      rating: 5.0,
      imgSrc: flylogo,
    },
    // Add more hotels here
  ];
  // Fetch hotels by city
  const { data: hotelsByCityData } = useGet(
    contextHotelData?.iataCode
      ? `/v1/reference-data/locations/hotels/by-city?cityCode=${contextHotelData?.iataCode}`
      : null,
    true
  );

  // Fetch hotels by geolocation if latitude/longitude is available
  const { data: hotelsByGeoData } = useGet(
    contextHotelData?.selectCityGeoCode?.latitude &&
      contextHotelData?.selectCityGeoCode?.longitude &&
      locationFilter?.radius
      ? `/v1/reference-data/locations/hotels/by-geocode?latitude=${contextHotelData?.selectCityGeoCode?.latitude}&longitude=${contextHotelData?.selectCityGeoCode.longitude}&radius=${locationFilter?.radius}&radiusUnit=MILE`
      : null,
    true
  );

  // Combine hotel IDs from city API
  useEffect(() => {
    if (hotelsByCityData?.data) {
      const ids = hotelsByCityData?.data?.map((hotel) => hotel?.hotelId);
      setHotelIds([...new Set(ids)]?.slice(0, 30)); // Remove duplicates and limit to 30 IDs
    }
  }, [hotelsByCityData]);

  // Update `hotelIds` when locationFilter changes
  useEffect(() => {
    setHotelIds([]); // Reset before updating
    if (locationFilter && hotelsByGeoData?.data?.length > 0) {
      const ids = hotelsByGeoData?.data?.map((hotel) => hotel?.hotelId);
      setHotelIds([...new Set(ids)]?.slice(0, 30));
    }
  }, [locationFilter, hotelsByGeoData]);

  // Fetch hotel offers when `hotelIds` are available
  const {
    data: hotelOffersData,
    error: HotelApiErr,
    refetch,
  } = useGet(
    hotelIds?.length > 0
      ? `/v3/shopping/hotel-offers?hotelIds=${hotelIds.join(",")}&checkInDate=${
          contextHotelData?.checkIn
        }&checkOutDate=${contextHotelData?.checkOut}&adults=${
          contextHotelData?.persons?.adults || 1
        }&children=${contextHotelData?.persons?.childrens || 0}&roomQuantity=${
          contextHotelData?.rooms||1
        }`
      : null,
    true
  );

  //  Refetch hotel offers whenever `hotelIds` updates
  useEffect(() => {
    if (hotelIds?.length > 0 && locationFilter?.radius) {
      refetch();
    }
  }, [hotelIds]);

  // Update hotels state when `hotelOffersData` is available
  useEffect(() => {
    if (hotelOffersData?.data?.length > 0) {
      setHotels(hotelOffersData?.data);
    } else {
      setHotels([]); // Ensure state is reset
    }
  }, [hotelOffersData]);

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };
  const handleFilSec = () => {
    setMoreFil(!moreFil);
    setOpenDropdown(false);
    toggleDropdown("moreFilter");
  };
  const toggleShowAll = () => {
    setShowAll(!showAll);

    if (showAll && faqSectionRef.current) {
      faqSectionRef.current.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
    }
  };
  const [showAll, setShowAll] = useState(false);
  
  return (
    <div className="Suggested-Tab-box">
      <Tabs>
        <div className="Suggested-Tab-head add-more-class">
          <div className="Nonstop-btn-box add-fliter">
            <div className="Sort-by-box">
              <p>{t(`HotelsInnerlabel.label1`)}</p>
              <DropSort
                isOpen={openDropdown === "sort"}
                onToggle={() => toggleDropdown("sort")}
              />
            </div>
            <div className="Sort-by-box">
            <p>{t(`HotelsInnerlabel.label2`)}</p>
              <DropPrice
                isOpen={openDropdown === "price"}
                onToggle={() => toggleDropdown("price")}
              />
            </div>
            <div className="Sort-by-box">
            <p>{t(`HotelsInnerlabel.label3`)}</p>
              <Propertytype
                isOpen={openDropdown === "property"}
                onToggle={() => toggleDropdown("property")}
              />
            </div>
            <div className="Sort-by-box">
            <p>{t(`HotelsInnerlabel.label4`)}</p>
              <DropAmenities
                isOpen={openDropdown === "amenities"}
                onToggle={() => toggleDropdown("amenities")}
              />
            </div>
            <div className="Sort-by-box">
            <p>{t(`HotelsInnerlabel.label5`)}</p>
              <DropStar
                isOpen={openDropdown === "star"}
                onToggle={() => toggleDropdown("star")}
              />
            </div>
            <div className="Sort-by-box">
            <p>{t(`HotelsInnerlabel.label6`)}</p>
              <DropLocation
                isOpen={openDropdown === "location"}
                onToggle={() => toggleDropdown("location")}
                value={setLocationFilter}
              />
            </div>

            {/* <div  className="Sort-by-box">
            <div onClick={() => setMoreFil(!moreFil)} className="Sort-by-box">
            <p>

              {moreFil ? "Hide Filters" : "More Filters"}
              
            </p>
            <DropLocationcar />
          </div>
            <div className="Sort-by-box">
              <p>Frequently Used Filters</p>
              <DropmainFrequently />
            </div>  
            <DropMoreFilters />
          </div> */}
            <div onClick={handleFilSec} className="Sort-by-box">
              <p className="moreFilter">
                {moreFil ? t("FlightsInner.Hide Filters") :t("FlightsInner.More Filters") }
              </p>
              {/* <DropLocationcar /> */}
            </div>

            {moreFil && (
              <div
                className="more-filter-popup"
                onClick={(e) => e.stopPropagation()}
              >
                <DropMoreFilterHotel setIsOpen={setMoreFil} open={moreFil} />
              </div>
            )}
          </div>
        </div>
        <div className="pograsbar car-section-progess">
          <div className="main-class-ProgressBar car-section-progess">
            <ProgressBar progress={progress} />
          </div>
        </div>
        <div className="Tab-body">
          <div className="Select-departing-main">
            <div className="View-Map-box">
              <div className="Select-departing-tital">
                <h2>
                {t(`HotelsInnerlabel.text`)}{" "}
                  {contextHotelData?.city?.toLowerCase() || "london"}
                </h2>
                <p> {t(`HotelsInnerlabel.para`)}</p>
              </div>
              <button onClick={() => setMapShow(!mapShow)}>
                {mapShow ? "Hide Map" : "View Map"}
              </button>
            </div>
            <div className="main-div-hotel-map">
              <div
                style={{
                  width: mapShow ? "70%" : "100%",
                  height: mapShow ? "60vh" : "",
                  overflowX: mapShow ? "auto" : "hidden",
                }}
                className="Select-departing-card-box"
              >
                {contextHotelData === null ? (
                  <>
                    {hotelsDataCusArr?.map((hotel) => (
                      <div
                        key={hotel.id}
                        className="Select-departing-card responsiv-box-card"
                      >
                        <div className="fly-box-1">
                          <img src={hotel.imgSrc} alt={hotel.name} />
                        </div>

                        <div className="Suggested-Hotels responsiv-box-hotels">
                          <h2>{hotel.name}</h2>
                          <p>{hotel.address}</p>
                          <div className="Suggested-Hotels-rateing-box">
                            <RatingStars rating={hotel.rating} />
                            <h3>{hotel.rating} Rating</h3>
                          </div>
                          <div className="fly-min-box">
                            <span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="21"
                                height="21"
                                viewBox="0 0 21 21"
                                fill="none"
                              >
                                <g clipPath="url(#clip0_170_675)">
                                  <path
                                    d="M14.7339 10.2018C15.7736 10.3235 16.7149 9.57924 16.8366 8.53942C16.9581 7.49991 16.214 6.55847 15.1742 6.43686C14.1346 6.31516 13.1932 7.05941 13.0718 8.09914C12.9498 9.13887 13.6943 10.0802 14.7339 10.2018Z"
                                    fill="#353978"
                                  />
                                  <path
                                    d="M6.47904 8.66027L9.29832 8.09728L9.90456 9.07229L7.7081 11.1609C8.04725 11.2466 8.37298 11.3742 8.67576 11.5411C8.82099 11.6211 8.95709 11.7136 9.08867 11.8029C9.30064 11.9469 9.5001 12.0855 9.69779 12.1397C9.85413 12.1827 10.059 12.1851 10.072 12.1859C10.3505 12.1835 10.5958 12.106 10.8462 11.9427C11.4975 11.5181 12.2969 11.0782 13.2883 11.0346C13.3615 11.0314 13.4354 11.0298 13.5081 11.0298C13.8261 11.0298 14.1371 11.061 14.4345 11.1216C14.2305 10.7959 10.5956 6.39107 10.5956 6.39107L10.4998 6.27647C10.2652 5.99768 9.87267 5.88105 9.51075 6.01368L6.08764 7.26922C5.75761 7.38991 5.55557 7.73629 5.62645 8.09154C5.70485 8.48396 6.08658 8.73859 6.47904 8.66027Z"
                                    fill="#353978"
                                  />
                                  <path
                                    d="M18.9404 13.0399C18.4738 13.2491 18.126 13.3344 17.7397 13.3344C17.5875 13.3344 17.4301 13.3208 17.2584 13.2927C16.6865 13.1907 16.2789 12.8605 15.8846 12.5411C15.6421 12.3447 15.4131 12.1591 15.1482 12.0225C14.6687 11.7739 14.092 11.6426 13.48 11.6426C13.4165 11.6426 13.3519 11.6441 13.2881 11.6469C12.4513 11.6836 11.7728 12.0559 11.1641 12.4527C10.8071 12.6856 10.3835 12.7974 9.99913 12.7974C9.88322 12.7974 9.64726 12.7719 9.49413 12.7278C9.20026 12.643 8.94829 12.4718 8.7046 12.3064C8.57944 12.2213 8.4612 12.1411 8.34175 12.0752C7.83025 11.7932 7.23958 11.6441 6.63368 11.6441H6.62138C5.77309 11.6469 5.00591 11.9071 4.40287 12.3963C3.56315 13.0778 3.00899 13.2693 2.85101 13.2963C2.85101 13.2963 2.7185 13.3309 2.43396 13.3309C1.88888 13.3309 1.43335 13.1524 0.976126 12.9535C0.654923 12.8138 0.352222 12.7337 0.0561523 12.7103C0.113558 12.7435 0.168514 12.7781 0.221823 12.8147C0.453897 12.9765 0.644912 13.1732 0.829549 13.3633C0.928393 13.465 1.0217 13.5612 1.12084 13.6524C1.509 14.0095 2.31011 14.4316 3.23215 14.4316C3.70002 14.4316 4.15272 14.3298 4.57754 14.1291C4.70253 14.0701 4.82423 13.9997 4.95302 13.9253C5.16672 13.802 5.3887 13.6777 5.63467 13.5948C5.94506 13.4903 6.42686 13.5249 6.42686 13.5249C6.92641 13.5568 7.3005 13.7929 7.57059 13.9949C8.39345 14.6105 9.1698 14.9009 10.0138 14.9091L10.0568 14.9094C10.6376 14.9094 11.1689 14.7975 11.6361 14.5767C11.8537 14.4738 12.0609 14.3225 12.2804 14.1622C12.6925 13.8612 13.1187 13.5498 13.6676 13.5283C13.7002 13.527 13.7334 13.5263 13.7671 13.5263C14.0677 13.5263 14.5202 13.5785 14.9694 13.8273C15.51 14.1277 16.1641 14.4347 16.9187 14.4347C17.0284 14.4347 17.1403 14.4283 17.2514 14.4158C17.946 14.3372 18.5331 14.081 18.9965 13.6546C19.0958 13.5632 19.1894 13.4667 19.2884 13.3647C19.4996 13.1471 19.7179 12.9221 19.9937 12.7513C20.0144 12.7384 20.0352 12.7259 20.0562 12.7138C19.7228 12.7435 19.3697 12.8474 18.9404 13.0399Z"
                                    fill="#353978"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_170_675">
                                    <rect
                                      width="20"
                                      height="20"
                                      fill="white"
                                      transform="translate(0.0561523 0.433594)"
                                    />
                                  </clipPath>
                                </defs>
                              </svg>
                              <p>Swimming Pool</p>
                            </span>
                            <span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="21"
                                height="20"
                                viewBox="0 0 21 20"
                                fill="none"
                              >
                                <g clipPath="url(#clip0_170_209)">
                                  <path
                                    d="M9.34204 0C8.95063 0 8.63333 0.319755 8.63333 0.714288H8.62775V6.42858C8.62775 6.82308 8.308 7.14288 7.91346 7.14288C7.51892 7.14288 7.19917 6.82308 7.19917 6.42858V0.714288H7.19358C7.19358 0.319755 6.87629 0 6.48492 0C6.0935 0 5.77621 0.319755 5.77621 0.714288H5.77063V6.42858C5.77063 6.82308 5.45088 7.14288 5.05633 7.14288C4.66179 7.14288 4.34204 6.82308 4.34204 6.42858V0.714288C4.34204 0.319755 4.02474 0 3.63333 0C3.24193 0 2.92463 0.319755 2.92463 0.714288H2.91347V7.85712C2.91347 8.73583 3.79506 9.49083 5.05633 9.82154V18.5714C5.05633 19.3604 5.69596 20 6.48492 20C7.27383 20 7.91346 19.3604 7.91346 18.5714V9.82154C9.17475 9.49083 10.0563 8.73583 10.0563 7.85712V0.714288H10.0508C10.0508 0.319755 9.73346 0 9.34204 0Z"
                                    fill="#353978"
                                  />
                                  <path
                                    d="M16.8422 0C14.278 0 12.1994 4.47712 12.1994 10C12.1994 10.485 12.2154 10.962 12.2465 11.4286H14.3422V18.5714C14.3422 19.3604 14.9818 20 15.7708 20C16.5597 20 17.1994 19.3604 17.1994 18.5714V0.0291295C17.0815 0.00982142 16.9624 0 16.8422 0Z"
                                    fill="#353978"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_170_209">
                                    <rect
                                      width="20"
                                      height="20"
                                      fill="white"
                                      transform="translate(0.0562134)"
                                    />
                                  </clipPath>
                                </defs>
                              </svg>
                              <p>Breakfast</p>
                            </span>
                          </div>
                        </div>

                        <div className="fly-Save-box">
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <g clipPath="url(#clip0_170_218)">
                                <path
                                  d="M7.59277 0.814453C3.44753 0.814453 0.0927734 4.16883 0.0927734 8.31445C0.0927734 12.4596 3.44715 15.8145 7.59277 15.8145C11.738 15.8145 15.0928 12.4601 15.0928 8.31445C15.0928 4.16927 11.7384 0.814453 7.59277 0.814453ZM7.59277 14.7679C4.03432 14.7679 1.13929 11.8729 1.13929 8.31445C1.13929 4.75597 4.03432 1.86097 7.59277 1.86097C11.1512 1.86097 14.0463 4.75597 14.0463 8.31445C14.0463 11.8729 11.1512 14.7679 7.59277 14.7679Z"
                                  fill="#135200"
                                />
                                <path
                                  d="M7.59296 7.06641C7.1487 7.06641 6.83279 7.25402 6.83279 7.53044V11.2917C6.83279 11.5287 7.1487 11.7656 7.59296 11.7656C8.01747 11.7656 8.36297 11.5287 8.36297 11.2917V7.53038C8.36297 7.25399 8.01747 7.06641 7.59296 7.06641Z"
                                  fill="#135200"
                                />
                                <path
                                  d="M7.59295 4.74609C7.13882 4.74609 6.78345 5.07188 6.78345 5.44702C6.78345 5.8222 7.13885 6.15785 7.59295 6.15785C8.03721 6.15785 8.39264 5.8222 8.39264 5.44702C8.39264 5.07188 8.03718 4.74609 7.59295 4.74609Z"
                                  fill="#135200"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_170_218">
                                  <rect
                                    width="15"
                                    height="15"
                                    fill="white"
                                    transform="translate(0.0927734 0.814453)"
                                  />
                                </clipPath>
                              </defs>
                            </svg>
                            {t(`buttons.Save`)} £ 35.00
                          </span>
<Link to="/">
                          <button>
                            <p>{t(`buttons.BookNow`)}</p>
                            <h3>
                              £ 35
                              {/* <div className="night">/night</div> */}
                            </h3>
                          </button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {hotels?.map((hotel) => (
                      <div
                        key={hotel.id}
                        className="Select-departing-card responsiv-box-card"
                      >
                        <div className="fly-box-1">
                          <img src={flylogo} alt={hotel.name} />
                        </div>

                        <div className="Suggested-Hotels responsiv-box-hotels">
                          <h2>{hotel?.hotel?.name}</h2>
                          <p>
                            Baniyas Rd, Deira, Dubai, United Arab Emirates, 3944
                          </p>
                          <div className="Suggested-Hotels-rateing-box">
                            <RatingStars rating={5.0} />
                            <h3>5.0 Rating</h3>
                          </div>
                          <div className="fly-min-box">
                            <span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="21"
                                height="21"
                                viewBox="0 0 21 21"
                                fill="none"
                              >
                                <g clipPath="url(#clip0_170_675)">
                                  <path
                                    d="M14.7339 10.2018C15.7736 10.3235 16.7149 9.57924 16.8366 8.53942C16.9581 7.49991 16.214 6.55847 15.1742 6.43686C14.1346 6.31516 13.1932 7.05941 13.0718 8.09914C12.9498 9.13887 13.6943 10.0802 14.7339 10.2018Z"
                                    fill="#353978"
                                  />
                                  <path
                                    d="M6.47904 8.66027L9.29832 8.09728L9.90456 9.07229L7.7081 11.1609C8.04725 11.2466 8.37298 11.3742 8.67576 11.5411C8.82099 11.6211 8.95709 11.7136 9.08867 11.8029C9.30064 11.9469 9.5001 12.0855 9.69779 12.1397C9.85413 12.1827 10.059 12.1851 10.072 12.1859C10.3505 12.1835 10.5958 12.106 10.8462 11.9427C11.4975 11.5181 12.2969 11.0782 13.2883 11.0346C13.3615 11.0314 13.4354 11.0298 13.5081 11.0298C13.8261 11.0298 14.1371 11.061 14.4345 11.1216C14.2305 10.7959 10.5956 6.39107 10.5956 6.39107L10.4998 6.27647C10.2652 5.99768 9.87267 5.88105 9.51075 6.01368L6.08764 7.26922C5.75761 7.38991 5.55557 7.73629 5.62645 8.09154C5.70485 8.48396 6.08658 8.73859 6.47904 8.66027Z"
                                    fill="#353978"
                                  />
                                  <path
                                    d="M18.9404 13.0399C18.4738 13.2491 18.126 13.3344 17.7397 13.3344C17.5875 13.3344 17.4301 13.3208 17.2584 13.2927C16.6865 13.1907 16.2789 12.8605 15.8846 12.5411C15.6421 12.3447 15.4131 12.1591 15.1482 12.0225C14.6687 11.7739 14.092 11.6426 13.48 11.6426C13.4165 11.6426 13.3519 11.6441 13.2881 11.6469C12.4513 11.6836 11.7728 12.0559 11.1641 12.4527C10.8071 12.6856 10.3835 12.7974 9.99913 12.7974C9.88322 12.7974 9.64726 12.7719 9.49413 12.7278C9.20026 12.643 8.94829 12.4718 8.7046 12.3064C8.57944 12.2213 8.4612 12.1411 8.34175 12.0752C7.83025 11.7932 7.23958 11.6441 6.63368 11.6441H6.62138C5.77309 11.6469 5.00591 11.9071 4.40287 12.3963C3.56315 13.0778 3.00899 13.2693 2.85101 13.2963C2.85101 13.2963 2.7185 13.3309 2.43396 13.3309C1.88888 13.3309 1.43335 13.1524 0.976126 12.9535C0.654923 12.8138 0.352222 12.7337 0.0561523 12.7103C0.113558 12.7435 0.168514 12.7781 0.221823 12.8147C0.453897 12.9765 0.644912 13.1732 0.829549 13.3633C0.928393 13.465 1.0217 13.5612 1.12084 13.6524C1.509 14.0095 2.31011 14.4316 3.23215 14.4316C3.70002 14.4316 4.15272 14.3298 4.57754 14.1291C4.70253 14.0701 4.82423 13.9997 4.95302 13.9253C5.16672 13.802 5.3887 13.6777 5.63467 13.5948C5.94506 13.4903 6.42686 13.5249 6.42686 13.5249C6.92641 13.5568 7.3005 13.7929 7.57059 13.9949C8.39345 14.6105 9.1698 14.9009 10.0138 14.9091L10.0568 14.9094C10.6376 14.9094 11.1689 14.7975 11.6361 14.5767C11.8537 14.4738 12.0609 14.3225 12.2804 14.1622C12.6925 13.8612 13.1187 13.5498 13.6676 13.5283C13.7002 13.527 13.7334 13.5263 13.7671 13.5263C14.0677 13.5263 14.5202 13.5785 14.9694 13.8273C15.51 14.1277 16.1641 14.4347 16.9187 14.4347C17.0284 14.4347 17.1403 14.4283 17.2514 14.4158C17.946 14.3372 18.5331 14.081 18.9965 13.6546C19.0958 13.5632 19.1894 13.4667 19.2884 13.3647C19.4996 13.1471 19.7179 12.9221 19.9937 12.7513C20.0144 12.7384 20.0352 12.7259 20.0562 12.7138C19.7228 12.7435 19.3697 12.8474 18.9404 13.0399Z"
                                    fill="#353978"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_170_675">
                                    <rect
                                      width="20"
                                      height="20"
                                      fill="white"
                                      transform="translate(0.0561523 0.433594)"
                                    />
                                  </clipPath>
                                </defs>
                              </svg>
                              <p>Swimming Pool</p>
                            </span>
                            <span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="21"
                                height="20"
                                viewBox="0 0 21 20"
                                fill="none"
                              >
                                <g clipPath="url(#clip0_170_209)">
                                  <path
                                    d="M9.34204 0C8.95063 0 8.63333 0.319755 8.63333 0.714288H8.62775V6.42858C8.62775 6.82308 8.308 7.14288 7.91346 7.14288C7.51892 7.14288 7.19917 6.82308 7.19917 6.42858V0.714288H7.19358C7.19358 0.319755 6.87629 0 6.48492 0C6.0935 0 5.77621 0.319755 5.77621 0.714288H5.77063V6.42858C5.77063 6.82308 5.45088 7.14288 5.05633 7.14288C4.66179 7.14288 4.34204 6.82308 4.34204 6.42858V0.714288C4.34204 0.319755 4.02474 0 3.63333 0C3.24193 0 2.92463 0.319755 2.92463 0.714288H2.91347V7.85712C2.91347 8.73583 3.79506 9.49083 5.05633 9.82154V18.5714C5.05633 19.3604 5.69596 20 6.48492 20C7.27383 20 7.91346 19.3604 7.91346 18.5714V9.82154C9.17475 9.49083 10.0563 8.73583 10.0563 7.85712V0.714288H10.0508C10.0508 0.319755 9.73346 0 9.34204 0Z"
                                    fill="#353978"
                                  />
                                  <path
                                    d="M16.8422 0C14.278 0 12.1994 4.47712 12.1994 10C12.1994 10.485 12.2154 10.962 12.2465 11.4286H14.3422V18.5714C14.3422 19.3604 14.9818 20 15.7708 20C16.5597 20 17.1994 19.3604 17.1994 18.5714V0.0291295C17.0815 0.00982142 16.9624 0 16.8422 0Z"
                                    fill="#353978"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_170_209">
                                    <rect
                                      width="20"
                                      height="20"
                                      fill="white"
                                      transform="translate(0.0562134)"
                                    />
                                  </clipPath>
                                </defs>
                              </svg>
                              <p>Breakfast</p>
                            </span>
                          </div>
                        </div>

                        <div className="fly-Save-box">
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <g clipPath="url(#clip0_170_218)">
                                <path
                                  d="M7.59277 0.814453C3.44753 0.814453 0.0927734 4.16883 0.0927734 8.31445C0.0927734 12.4596 3.44715 15.8145 7.59277 15.8145C11.738 15.8145 15.0928 12.4601 15.0928 8.31445C15.0928 4.16927 11.7384 0.814453 7.59277 0.814453ZM7.59277 14.7679C4.03432 14.7679 1.13929 11.8729 1.13929 8.31445C1.13929 4.75597 4.03432 1.86097 7.59277 1.86097C11.1512 1.86097 14.0463 4.75597 14.0463 8.31445C14.0463 11.8729 11.1512 14.7679 7.59277 14.7679Z"
                                  fill="#135200"
                                />
                                <path
                                  d="M7.59296 7.06641C7.1487 7.06641 6.83279 7.25402 6.83279 7.53044V11.2917C6.83279 11.5287 7.1487 11.7656 7.59296 11.7656C8.01747 11.7656 8.36297 11.5287 8.36297 11.2917V7.53038C8.36297 7.25399 8.01747 7.06641 7.59296 7.06641Z"
                                  fill="#135200"
                                />
                                <path
                                  d="M7.59295 4.74609C7.13882 4.74609 6.78345 5.07188 6.78345 5.44702C6.78345 5.8222 7.13885 6.15785 7.59295 6.15785C8.03721 6.15785 8.39264 5.8222 8.39264 5.44702C8.39264 5.07188 8.03718 4.74609 7.59295 4.74609Z"
                                  fill="#135200"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_170_218">
                                  <rect
                                    width="15"
                                    height="15"
                                    fill="white"
                                    transform="translate(0.0927734 0.814453)"
                                  />
                                </clipPath>
                              </defs>
                            </svg>
                            Save £ 35.00
                          </span>

                          <button>
                            <p>Book Now</p>
                            <h3>
                              {hotel?.offers[0]?.price?.currency}{" "}
                              {hotel?.offers[0]?.price?.total}
                              {/* <div className="night">/night</div> */}
                            </h3>
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}

<div className="Sec2-btn-box">
            <button onClick={toggleShowAll}>
              {showAll ? t("buttons.showLess") : t("buttons.more")}
            </button>
          </div>
              </div>

    
              {mapShow && (
                <div className="map-section-div">
                  <Map
                    hotelData={contextHotelData ? hotels : hotelsDataCusArr}
                    center={contextHotelData?.selectCityGeoCode}
                  />
                </div>
              )}
            </div>
          </div>
          {/* Add TabPanel for "Cheapest" tab */}
        </div>
      </Tabs>
    </div>
  );
};

export default Tab9;
