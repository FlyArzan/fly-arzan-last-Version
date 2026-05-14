import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css"; // Import react-tabs CSS
import Drop1 from "../drop-dwon/Drop1";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGet } from "../../utils/ApiMethod";
import { format } from "date-fns"; // Import date formatting function
import { debounce } from "lodash";
import { FlightContext } from "../../context/FlightContext";
import Flightsvg from "../svg/Flightsvg";
import { useTranslation } from "react-i18next";

const Tab1 = ({ upperHeadingShow = true }) => {
  const { t, i18n } = useTranslation();

  const { contextData, setContextData } = useContext(FlightContext);

  const [activeButton, setActiveButton] = useState(
    contextData?.type || "One Way",
  );
  const [selectedTab, setSelectedTab] = useState(
    contextData?.type == "Return"
      ? 1
      : contextData?.type == "Multi City"
        ? 2
        : 0,
  );

  const [titleChange, setTitleChange] = useState(
    contextData?.titleChange || false,
  );
  const [flyingFrom, setFlyingFrom] = useState(
    contextData?.fromSearchVal || "",
  );

  const [searchFrom, setSearchFrom] = useState(""); // Stores input for API call
  const [flyingTo, setFlyingTo] = useState(contextData?.toSearchVal || "");

  const [searchTo, setSearchTo] = useState(""); // Stores input for API call
  const [fromSuggestions, setFromSuggestions] = useState([]);

  const [toSuggestions, setToSuggestions] = useState([]);

  const [cabin, setCabin] = useState(
    contextData?.cabin || "Cabin_Class_Adults",
  );

  const [DepartureDate, setDepartureDate] = useState(
    contextData?.departureDate || null,
  );
  const [ReturnDate, setReturnDate] = useState(contextData?.returnDate || null);
  const [flightGroups, setFlightGroups] = useState([
    {
      id: 1,
      flyingFrom: "",
      searchFrom: "",
      iataCodeflyingFrom: "",
      flyingTo: "",
      searchTo: "",
      iataCodeflyingTo: "",
    },
  ]);
  const [persons, setPersons] = useState({
    childrens: contextData?.children || 0,
    adults: contextData?.adults || 1,
  });
  const { data: suggestionFromData, refetch: FromSugFetch } = useGet(
    searchFrom
      ? `/v1/reference-data/locations?subType=CITY,AIRPORT&keyword=${searchFrom}`
      : null,
  );
  const { data: suggestionToData, refetch: ToSugFetch } = useGet(
    searchTo
      ? `/v1/reference-data/locations?subType=CITY,AIRPORT&keyword=${searchTo}`
      : null,
  );

  useEffect(() => {
    if (contextData?.flightGroups?.length > 0) {
      setFlightGroups(contextData.flightGroups);
    }
  }, [contextData]);
  useEffect(() => {
    if (setFlightGroups?.length > 0) {
      if (searchFrom.trim() !== "") {
        FromSugFetch();
      }
    }
  }, [searchFrom]);
  useEffect(() => {
    if (setFlightGroups?.length > 0) {
      if (searchTo.trim() !== "") {
        ToSugFetch();
      }
    }
  }, [searchTo]);
  const handleInputChangeDebounced = debounce(
    (value, setFlying, setSearch, fetchSuggestions) => {
      setFlying(value);
      setSearch(value);
      fetchSuggestions();
    },
    150, // 500ms delay
  );
  const handleInputChangeForGroups = useMemo(
    () =>
      debounce((value, type, id) => {
        setFlightGroups((prevGroups) =>
          prevGroups.map((group) =>
            group.id === id
              ? {
                  ...group,
                  [type]: value,
                  [`search${type.charAt(0).toUpperCase() + type.slice(1)}`]:
                    value, // Update search term
                }
              : group,
          ),
        );

        // Active search update karein
        if (type === "flyingFrom") {
          setSearchFrom(value); // ✅ Yeh zaroori hai taake `useEffect` trigger ho
        } else if (type === "flyingTo") {
          setSearchTo(value); // ✅ Yeh zaroori hai taake `useEffect` trigger ho
        }
      }, 150),
    [],
  );

  // Update state when data changes
  useEffect(() => {
    if (suggestionFromData?.data?.length > 0) {
      setFromSuggestions(suggestionFromData?.data);
    }
  }, [suggestionFromData]);

  useEffect(() => {
    if (suggestionToData?.data?.length > 0) {
      setToSuggestions(suggestionToData?.data);
    }
  }, [suggestionToData]);

  const handleClick = (buttonName) => {
    setFlyingFrom("");
    setSearchFrom("");
    setFlyingTo("");
    setSearchTo("");
    setFromSuggestions([]);
    setToSuggestions([]);
    setDepartureDate(null);
    setActiveButton(buttonName);
    setCabin("Cabin_Class_Adults");
    setFlightGroups([
      {
        id: 1,
        flyingFrom: "",
        searchFrom: "",
        iataCodeflyingFrom: "",
        flyingTo: "",
        searchTo: "",
        iataCodeflyingTo: "",
      },
    ]);
    setPersons({
      childrens: 0,
      adults: 0,
    });
  };
  const navigate = useNavigate();
  const routetoHotels = () => {
    navigate("/Hotels");
  };
  const routetoCars = () => {
    navigate("/Car");
  };
  // Function to add a new flight group
  const handleDateChange = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd"); // Convert to "2025-03-10" format
    setDepartureDate(formattedDate); // Store formatted date
  };
  const handleReturnDateChange = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd"); // Convert to "2025-03-10" format
    setReturnDate(formattedDate); // Store formatted date
  };
  const addFlightGroup = () => {
    if (flightGroups?.length !== 6) {
      setFlightGroups([
        ...flightGroups,
        {
          id: flightGroups.length + 1,
          flyingFrom: "",
          flyingTo: "",
          searchFrom: "",
          searchTo: "",
          DepartureDate: null,
        },
      ]);
    }
  };
  // Function to delete a specific flight group
  const deleteFlightGroup = (id) => {
    const updatedGroups = flightGroups?.filter((group) => group.id !== id);
    setFlightGroups(updatedGroups);
  };
  const handleInputChange = useMemo(() => handleInputChangeDebounced, []);
  const handleChange = (e, type, id) => {
    const value = e.target.value;
    if (!id) {
      if (type === "flyingFrom") {
        handleInputChange(value, setFlyingFrom, setSearchFrom, FromSugFetch);
      } else if (type === "flyingTo") {
        handleInputChange(value, setFlyingTo, setSearchTo, ToSugFetch);
      }
    } else {
      handleInputChangeForGroups(value, type, id);
    }
  };
  const handleSelectSuggestion = (iataCode, cityName, type, id) => {
    if (!id) {
      if (type === "flyingFrom") {
        setFlyingFrom(`${cityName} (${iataCode})`);
        setSearchFrom(""); // Clear API search term (prevents API from running)
        setFromSuggestions([]);
      } else if (type === "flyingTo") {
        setFlyingTo(`${cityName} (${iataCode})`);
        setSearchTo(""); // Clear API search term (prevents API from running)
        setToSuggestions([]);
      }
    } else {
      setFlightGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.id === id
            ? {
                ...group,
                [type]: `${cityName} (${iataCode})`,
                [`iataCode${type}`]: iataCode,
              }
            : group,
        ),
      );
    }
  };
  const handleSubmit = (type) => {
    if (!type) {
      const splitedFromCode = flyingFrom?.split("(")[1]?.replace(")", "");
      const splitedToCode = flyingTo?.split("(")[1]?.replace(")", "");

      if (splitedFromCode && splitedToCode && DepartureDate && cabin) {
        if (activeButton === "Return" && ReturnDate) {
          const data = {
            originLocationCode: splitedFromCode,
            destinationLocationCode: splitedToCode,
            departureDate: DepartureDate,
            returnDate: ReturnDate,
            type: activeButton,
            departureCountry: flyingFrom?.split("(")[0],
            fromSearchVal: flyingFrom,
            toSearchVal: flyingTo,
            cabin,
            adults: persons?.adults,
            children: persons?.childrens,
            titleChange,
          };
          setContextData(data);
          navigate("/FlightsInner");
        } else if (activeButton === "One Way") {
          const data = {
            originLocationCode: splitedFromCode,
            destinationLocationCode: splitedToCode,
            departureDate: DepartureDate,
            type: activeButton,
            departureCountry: flyingFrom?.split("(")[0],
            fromSearchVal: flyingFrom,
            toSearchVal: flyingTo,
            cabin,
            titleChange,
            adults: persons?.adults,
            children: persons?.childrens,
          };
          setContextData(data);
          navigate("/FlightsInner");
        }
      }
    } else {
      if (
        flightGroups.length > 0 &&
        flightGroups[0]?.iataCodeflyingFrom !== "" &&
        flightGroups[0]?.iataCodeflyingTo !== "" &&
        flightGroups[0]?.DepartureDate !== ""
      ) {
        const travelers = [];

        for (let i = 1; i <= persons?.adults; i++) {
          travelers?.push({ id: `${i}`, travelerType: "ADULT" });
        }

        for (let i = 1; i <= persons?.childrens; i++) {
          travelers?.push({
            id: `${i + persons?.adults}`, // Fixed: Use persons.adults instead of getSearchDetails.adults
            travelerType: "CHILD",
          });
        }

        const formattedData = {
          originDestinations: flightGroups.map((group) => ({
            id: group.id.toString(),
            originLocationCode: group.iataCodeflyingFrom,
            destinationLocationCode: group.iataCodeflyingTo,
            departureDateTimeRange: {
              date: group.DepartureDate,
            },
          })),
          travelers,
          flightGroups,
          type: "Multi City",
          departureCountry: flightGroups
            ?.map((from) => from.flyingFrom.split(" (")[0]) // "(" se split karke sirf city name le rahe hain
            .join(", "),
        };
        setContextData(formattedData);
        navigate("/FlightsInner");
      }
    }
  };

  return (
    <>
      <div className="Flights-Tab">
        {upperHeadingShow && (
          <div className="Flights-Tab-head">
            <ul>
              <li
                style={{ color: "#50ADD8", borderBottom: "1px solid #50ADD8" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <g clipPath="url(#clip0_93_901)">
                    <path
                      style={{ fill: "#50ADD8" }}
                      d="M15.5342 0.72115C14.9609 0.147869 14.0285 0.157449 13.4671 0.74242L10.3943 3.94448L2.89544 1.46283L1.32129 3.03701L7.57184 6.88559L4.40906 10.1813L2.38081 9.84833L0.958008 11.2711L3.93984 12.3155L4.98425 15.2974L6.40705 13.8746L6.07406 11.8463L9.36979 8.68357L13.2184 14.9341L14.7925 13.3599L12.3109 5.86105L15.5129 2.78825C16.0979 2.22686 16.1075 1.29446 15.5342 0.72115Z"
                      fill="#939393"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_93_901">
                      <rect
                        width="15"
                        height="15"
                        fill="white"
                        transform="translate(0.958008 0.297852)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                {t("upperSection.flights")}
              </li>
              <li onClick={routetoHotels}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <g clipPath="url(#clip0_93_907)">
                    <path
                      d="M7.52051 11.0791H9.39551V14.3604H7.52051V11.0791Z"
                      fill="#272727"
                      fill-opacity="0.5"
                    />
                    <path
                      d="M15.4223 14.2264H14.3509V3.51214C14.3509 3.19071 14.1366 2.97642 13.8152 2.97642H13.2794V0.833566C13.2794 0.512137 13.0652 0.297852 12.7437 0.297852H4.17229C3.85086 0.297852 3.63658 0.512137 3.63658 0.833566V2.97642H3.10086C2.77944 2.97642 2.56515 3.19071 2.56515 3.51214V14.2264H1.49372C1.17229 14.2264 0.958008 14.4407 0.958008 14.7621C0.958008 15.0836 1.17229 15.2979 1.49372 15.2979H6.31515V11.0121C6.31515 10.6907 6.52944 10.4764 6.85086 10.4764H10.0652C10.3866 10.4764 10.6009 10.6907 10.6009 11.0121V15.2979H15.4223C15.7437 15.2979 15.958 15.0836 15.958 14.7621C15.958 14.4407 15.7437 14.2264 15.4223 14.2264ZM11.6723 4.58357C11.9937 4.58357 12.208 4.79785 12.208 5.11928V6.19071C12.208 6.51214 11.9937 6.72642 11.6723 6.72642C11.3509 6.72642 11.1366 6.51214 11.1366 6.19071V5.11928C11.1366 4.79785 11.3509 4.58357 11.6723 4.58357ZM5.24372 12.6193C5.24372 12.9407 5.02944 13.155 4.70801 13.155C4.38658 13.155 4.17229 12.9407 4.17229 12.6193V11.5479C4.17229 11.2264 4.38658 11.0121 4.70801 11.0121C5.02944 11.0121 5.24372 11.2264 5.24372 11.5479V12.6193ZM5.77944 9.40499C5.77944 9.72642 5.56515 9.94071 5.24372 9.94071C4.92229 9.94071 4.70801 9.72642 4.70801 9.40499V8.33357C4.70801 8.01214 4.92229 7.79785 5.24372 7.79785C5.56515 7.79785 5.77944 8.01214 5.77944 8.33357V9.40499ZM5.77944 6.19071C5.77944 6.51214 5.56515 6.72642 5.24372 6.72642C4.92229 6.72642 4.70801 6.51214 4.70801 6.19071V5.11928C4.70801 4.79785 4.92229 4.58357 5.24372 4.58357C5.56515 4.58357 5.77944 4.79785 5.77944 5.11928V6.19071ZM6.31515 4.04785C5.99372 4.04785 5.77944 3.83357 5.77944 3.51214V2.44071C5.77944 2.11928 5.99372 1.90499 6.31515 1.90499C6.63658 1.90499 6.85086 2.11928 6.85086 2.44071V3.51214C6.85086 3.83357 6.63658 4.04785 6.31515 4.04785ZM7.92229 9.40499C7.92229 9.72642 7.70801 9.94071 7.38658 9.94071C7.06515 9.94071 6.85086 9.72642 6.85086 9.40499V8.33357C6.85086 8.01214 7.06515 7.79785 7.38658 7.79785C7.70801 7.79785 7.92229 8.01214 7.92229 8.33357V9.40499ZM7.92229 6.19071C7.92229 6.51214 7.70801 6.72642 7.38658 6.72642C7.06515 6.72642 6.85086 6.51214 6.85086 6.19071V5.11928C6.85086 4.79785 7.06515 4.58357 7.38658 4.58357C7.70801 4.58357 7.92229 4.79785 7.92229 5.11928V6.19071ZM8.45801 4.04785C8.13658 4.04785 7.92229 3.83357 7.92229 3.51214V2.44071C7.92229 2.11928 8.13658 1.90499 8.45801 1.90499C8.77944 1.90499 8.99372 2.11928 8.99372 2.44071V3.51214C8.99372 3.83357 8.77944 4.04785 8.45801 4.04785ZM10.0652 9.40499C10.0652 9.72642 9.85086 9.94071 9.52944 9.94071C9.20801 9.94071 8.99372 9.72642 8.99372 9.40499V8.33357C8.99372 8.01214 9.20801 7.79785 9.52944 7.79785C9.85086 7.79785 10.0652 8.01214 10.0652 8.33357V9.40499ZM10.0652 6.19071C10.0652 6.51214 9.85086 6.72642 9.52944 6.72642C9.20801 6.72642 8.99372 6.51214 8.99372 6.19071V5.11928C8.99372 4.79785 9.20801 4.58357 9.52944 4.58357C9.85086 4.58357 10.0652 4.79785 10.0652 5.11928V6.19071ZM10.6009 4.04785C10.2794 4.04785 10.0652 3.83357 10.0652 3.51214V2.44071C10.0652 2.11928 10.2794 1.90499 10.6009 1.90499C10.9223 1.90499 11.1366 2.11928 11.1366 2.44071V3.51214C11.1366 3.83357 10.9223 4.04785 10.6009 4.04785ZM11.1366 9.40499V8.33357C11.1366 8.01214 11.3509 7.79785 11.6723 7.79785C11.9937 7.79785 12.208 8.01214 12.208 8.33357V9.40499C12.208 9.72642 11.9937 9.94071 11.6723 9.94071C11.3509 9.94071 11.1366 9.72642 11.1366 9.40499ZM12.7437 12.6193C12.7437 12.9407 12.5294 13.155 12.208 13.155C11.8866 13.155 11.6723 12.9407 11.6723 12.6193V11.5479C11.6723 11.2264 11.8866 11.0121 12.208 11.0121C12.5294 11.0121 12.7437 11.2264 12.7437 11.5479V12.6193Z"
                      fill="#272727"
                      fill-opacity="0.5"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_93_907">
                      <rect
                        width="15"
                        height="15"
                        fill="white"
                        transform="translate(0.958008 0.297852)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                {t("upperSection.hotels")}
              </li>

              <li onClick={routetoCars}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <g clipPath="url(#clip0_93_912)">
                    <path
                      d="M15.872 5.77463C15.7986 5.68514 15.6892 5.63291 15.5743 5.63291H14.1145C13.7542 4.68271 13.2849 3.75172 12.7514 3.40029C10.9059 2.18623 6.01089 2.18623 4.16541 3.40029C3.63155 3.7521 3.16413 4.68425 2.80195 5.63291H1.34209C1.2261 5.63291 1.11702 5.68514 1.04443 5.77463C0.971455 5.86374 0.942266 5.98165 0.966078 6.09495L1.18231 7.1427C1.21918 7.3213 1.37665 7.44881 1.55832 7.44881H1.99079C1.5733 7.93044 1.37089 8.53689 1.3682 9.14373C1.36551 9.89344 1.65011 10.5709 2.17053 11.0503C2.17629 11.0553 2.18206 11.0587 2.18743 11.0637V12.5297C2.18743 12.8473 2.44553 13.1058 2.76354 13.1058H4.11011C4.42812 13.1058 4.68622 12.8473 4.68622 12.5297V11.9406H12.2298V12.5297C12.2298 12.8473 12.4879 13.1058 12.8059 13.1058H14.1525C14.4697 13.1058 14.7286 12.8473 14.7286 12.5297V11.0925C15.2809 10.5867 15.5447 9.89075 15.5482 9.19596C15.5505 8.56838 15.3389 7.93966 14.8968 7.44804H15.3581C15.5405 7.44804 15.698 7.32053 15.7341 7.14155L15.9507 6.09418C15.973 5.98165 15.945 5.86451 15.872 5.77463ZM4.79798 4.36239C6.26898 3.39414 10.647 3.39414 12.1173 4.36239C12.403 4.54982 12.7706 5.3076 13.1074 6.23552H3.80861C4.14467 5.30798 4.51223 4.55059 4.79798 4.36239ZM3.07503 9.28814C3.07503 8.6621 3.58277 8.15512 4.20843 8.15512C4.83485 8.15512 5.34183 8.6621 5.34183 9.28814C5.34183 9.91418 4.83485 10.4215 4.20843 10.4215C3.58277 10.4215 3.07503 9.91418 3.07503 9.28814ZM12.7226 10.4215C12.0969 10.4215 11.5892 9.91418 11.5892 9.28814C11.5892 8.6621 12.0969 8.15512 12.7226 8.15512C13.349 8.15512 13.856 8.6621 13.856 9.28814C13.856 9.91418 13.3482 10.4215 12.7226 10.4215Z"
                      fill="#272727"
                      fill-opacity="0.5"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_93_912">
                      <rect
                        width="15"
                        height="14.9996"
                        fill="white"
                        transform="translate(0.958008 0.297852)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                {t("upperSection.cars_Rentals")}
              </li>
            </ul>
          </div>
        )}

        <div className="Flights-Tab-body">
          <Tabs
            selectedIndex={selectedTab}
            onSelect={(index) => setSelectedTab(index)}
          >
            <div className="Flights-Tab-btn-box">
              <TabList>
                <Tab>
                  <button
                    className={activeButton === "One Way" ? "active" : ""}
                    onClick={() => handleClick("One Way")}
                  >
                    {t("upperSection.oneWay")}
                  </button>
                </Tab>
                <Tab>
                  <button
                    className={activeButton === "Return" ? "active" : ""}
                    onClick={() => handleClick("Return")}
                  >
                    {t("upperSection.return")}
                  </button>
                </Tab>
                <Tab>
                  <button
                    className={activeButton === "Multi City" ? "active" : ""}
                    onClick={() => handleClick("Multi City")}
                  >
                    {t("upperSection.multiCity")}
                  </button>
                </Tab>
              </TabList>
            </div>

            <TabPanel>
              <div className="Flights-Tab-form">
                <div className="Flights-Tab-input-group more-with">
                  <div className="Flights-Tab-input-group-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      viewBox="0 0 26 26"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_93_920)">
                        <path
                          d="M13.2549 0.647461C8.26243 0.647461 4.20081 4.70908 4.20081 9.70146C4.20081 15.8972 12.3033 24.9928 12.6483 25.377C12.9723 25.7379 13.538 25.7373 13.8615 25.377C14.2064 24.9928 22.3089 15.8972 22.3089 9.70146C22.3088 4.70908 18.2472 0.647461 13.2549 0.647461ZM13.2549 14.2568C10.743 14.2568 8.69958 12.2133 8.69958 9.70146C8.69958 7.18965 10.7431 5.14619 13.2549 5.14619C15.7666 5.14619 17.8101 7.1897 17.8101 9.70151C17.8101 12.2133 15.7666 14.2568 13.2549 14.2568Z"
                          fill="#353978"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_93_920">
                          <rect
                            width="25"
                            height="25"
                            fill="white"
                            transform="translate(0.754883 0.647461)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <div className="form__group field">
                    <input
                      type="input"
                      className="form__field"
                      placeholder="Name"
                      required=""
                      value={flyingFrom}
                      onChange={(e) => handleChange(e, "flyingFrom")}
                    />
                    <label for="name" className="form__label">
                      {t("upperSection.flying_from")}
                    </label>
                  </div>
                  {fromSuggestions?.length > 0 && flyingFrom && (
                    <ul className="suggestions">
                      {fromSuggestions?.map((airport, index) => (
                        <li
                          key={index}
                          onClick={() =>
                            handleSelectSuggestion(
                              airport.iataCode,
                              airport.name,
                              "flyingFrom",
                            )
                          }
                        >
                          <Flightsvg />
                          {airport.name} ({airport.iataCode})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="Flights-Tab-input-group more-with">
                  <div className="Flights-Tab-input-group-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      viewBox="0 0 26 26"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_93_920)">
                        <path
                          d="M13.2549 0.647461C8.26243 0.647461 4.20081 4.70908 4.20081 9.70146C4.20081 15.8972 12.3033 24.9928 12.6483 25.377C12.9723 25.7379 13.538 25.7373 13.8615 25.377C14.2064 24.9928 22.3089 15.8972 22.3089 9.70146C22.3088 4.70908 18.2472 0.647461 13.2549 0.647461ZM13.2549 14.2568C10.743 14.2568 8.69958 12.2133 8.69958 9.70146C8.69958 7.18965 10.7431 5.14619 13.2549 5.14619C15.7666 5.14619 17.8101 7.1897 17.8101 9.70151C17.8101 12.2133 15.7666 14.2568 13.2549 14.2568Z"
                          fill="#353978"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_93_920">
                          <rect
                            width="25"
                            height="25"
                            fill="white"
                            transform="translate(0.754883 0.647461)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <div className="form__group field">
                    <input
                      type="input"
                      className="form__field"
                      placeholder="Name"
                      required=""
                      onChange={(e) => handleChange(e, "flyingTo")}
                      value={flyingTo}
                    />
                    <label for="name" className="form__label">
                      {t("upperSection.flying_to")}
                    </label>
                  </div>
                  {toSuggestions?.length > 0 && flyingTo && (
                    <ul className="suggestions">
                      {toSuggestions?.map((airport, index) => (
                        <li
                          key={index}
                          onClick={() =>
                            handleSelectSuggestion(
                              airport.iataCode,
                              airport.name,
                              "flyingTo",
                            )
                          }
                        >
                          <Flightsvg />
                          {airport.name} ({airport.iataCode})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="Flights-Tab-input-group more-with">
                  <div className="Flights-Tab-input-group-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      viewBox="0 0 26 26"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_93_889)">
                        <path
                          d="M22.9492 5.35601H17.7409V4.31431C17.7409 3.16533 16.8066 2.23096 15.6576 2.23096H9.40759C8.25862 2.23096 7.32424 3.16528 7.32424 4.31431V5.35596H2.11594C0.966919 5.35601 0.0325928 6.29033 0.0325928 7.43931V10.5643C0.0325928 11.7133 0.966919 12.6477 2.11594 12.6477H10.4493V12.1268C10.4493 11.8389 10.6823 11.606 10.9701 11.606H14.0951C14.383 11.606 14.616 11.8389 14.616 12.1268V12.6477H22.9493C24.0983 12.6477 25.0326 11.7133 25.0326 10.5643V7.43931C25.0326 6.29033 24.0983 5.35601 22.9492 5.35601ZM15.6576 5.35601H9.40759V4.31431H15.6576V5.35601Z"
                          fill="#353978"
                        />
                        <path
                          d="M24.7437 13.2098C24.5662 13.1218 24.3541 13.1422 24.1974 13.2612C23.8271 13.5414 23.3958 13.6894 22.9492 13.6894H14.6159V15.2519C14.6159 15.5398 14.383 15.7728 14.0951 15.7728H10.9701C10.6822 15.7728 10.4492 15.5398 10.4492 15.2519V13.6894H2.11594C1.66936 13.6894 1.23806 13.5414 0.867749 13.2612C0.710571 13.1411 0.498999 13.1208 0.32146 13.2098C0.144507 13.2978 0.0325928 13.4783 0.0325928 13.6762V20.9811C0.0325928 22.1301 0.966919 23.0645 2.11594 23.0645H22.9493C24.0983 23.0645 25.0326 22.1302 25.0326 20.9811V13.6762C25.0326 13.4783 24.9207 13.2978 24.7437 13.2098Z"
                          fill="#353978"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_93_889">
                          <rect
                            width="25"
                            height="25"
                            fill="white"
                            transform="translate(0.0325928 0.147461)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <Drop1
                    setCabin={setCabin}
                    value={cabin}
                    persons={persons}
                    setPersons={setPersons}
                  />
                </div>

                {/* <div className="Flights-Tab-input-group">
                    <div className="Flights-Tab-input-group-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="26"
                        height="26"
                        viewBox="0 0 26 26"
                        fill="none"
                      >
                        <g clipPath="url(#clip0_93_920)">
                          <path
                            d="M13.2549 0.647461C8.26243 0.647461 4.20081 4.70908 4.20081 9.70146C4.20081 15.8972 12.3033 24.9928 12.6483 25.377C12.9723 25.7379 13.538 25.7373 13.8615 25.377C14.2064 24.9928 22.3089 15.8972 22.3089 9.70146C22.3088 4.70908 18.2472 0.647461 13.2549 0.647461ZM13.2549 14.2568C10.743 14.2568 8.69958 12.2133 8.69958 9.70146C8.69958 7.18965 10.7431 5.14619 13.2549 5.14619C15.7666 5.14619 17.8101 7.1897 17.8101 9.70151C17.8101 12.2133 15.7666 14.2568 13.2549 14.2568Z"
                            fill="#353978"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_93_920">
                            <rect
                              width="25"
                              height="25"
                              fill="white"
                              transform="translate(0.754883 0.647461)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    <div className="form__group field">
                      <input
                        type="number"
                        className="form__field"
                        placeholder="Name"
                        required=""
                        value={persons?.adults}
                        onChange={(e) =>
                          setPersons({ ...persons, adults: e.target.value })
                        }
                      />
                      <label for="name" className="form__label">
                        Adults
                      </label>
                    </div>
                  </div>

                  <div className="Flights-Tab-input-group">
                    <div className="Flights-Tab-input-group-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="26"
                        height="26"
                        viewBox="0 0 26 26"
                        fill="none"
                      >
                        <g clipPath="url(#clip0_93_920)">
                          <path
                            d="M13.2549 0.647461C8.26243 0.647461 4.20081 4.70908 4.20081 9.70146C4.20081 15.8972 12.3033 24.9928 12.6483 25.377C12.9723 25.7379 13.538 25.7373 13.8615 25.377C14.2064 24.9928 22.3089 15.8972 22.3089 9.70146C22.3088 4.70908 18.2472 0.647461 13.2549 0.647461ZM13.2549 14.2568C10.743 14.2568 8.69958 12.2133 8.69958 9.70146C8.69958 7.18965 10.7431 5.14619 13.2549 5.14619C15.7666 5.14619 17.8101 7.1897 17.8101 9.70151C17.8101 12.2133 15.7666 14.2568 13.2549 14.2568Z"
                            fill="#353978"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_93_920">
                            <rect
                              width="25"
                              height="25"
                              fill="white"
                              transform="translate(0.754883 0.647461)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    <div className="form__group field">
                      <input
                        type="number"
                        className="form__field"
                        placeholder="Name"
                        required=""
                        value={persons?.childrens}
                        onChange={(e) =>
                          setPersons({ ...persons, childrens: e.target.value })
                        }
                      />
                      <label for="name" className="form__label">
                        Childrens
                      </label>
                    </div>
                  </div> */}

                <div className="Flights-Tab-input-group  ">
                  <div className="Flights-Tab-input-group-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      viewBox="0 0 26 26"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_93_881)">
                        <path
                          d="M21.7922 1.61182H19.5863V3.8177C19.5863 4.25888 19.2186 4.55299 18.851 4.55299C18.4833 4.55299 18.1157 4.25888 18.1157 3.8177V1.61182H6.35099V3.8177C6.35099 4.25888 5.98334 4.55299 5.6157 4.55299C5.24805 4.55299 4.8804 4.25888 4.8804 3.8177V1.61182H2.67452C1.57158 1.61182 0.762756 2.5677 0.762756 3.8177V6.46476H24.2922V3.8177C24.2922 2.5677 22.9686 1.61182 21.7922 1.61182ZM0.762756 8.00888V21.4648C0.762756 22.7883 1.57158 23.6706 2.74805 23.6706H21.8657C23.0422 23.6706 24.3657 22.7148 24.3657 21.4648V8.00888H0.762756ZM7.30687 20.3618H5.54217C5.24805 20.3618 4.95393 20.1412 4.95393 19.7736V17.9353C4.95393 17.6412 5.17452 17.3471 5.54217 17.3471H7.3804C7.67452 17.3471 7.96864 17.5677 7.96864 17.9353V19.7736C7.89511 20.1412 7.67452 20.3618 7.30687 20.3618ZM7.30687 13.7442H5.54217C5.24805 13.7442 4.95393 13.5236 4.95393 13.1559V11.3177C4.95393 11.0236 5.17452 10.7295 5.54217 10.7295H7.3804C7.67452 10.7295 7.96864 10.9501 7.96864 11.3177V13.1559C7.89511 13.5236 7.67452 13.7442 7.30687 13.7442ZM13.1892 20.3618H11.351C11.0569 20.3618 10.7628 20.1412 10.7628 19.7736V17.9353C10.7628 17.6412 10.9833 17.3471 11.351 17.3471H13.1892C13.4833 17.3471 13.7775 17.5677 13.7775 17.9353V19.7736C13.7775 20.1412 13.5569 20.3618 13.1892 20.3618ZM13.1892 13.7442H11.351C11.0569 13.7442 10.7628 13.5236 10.7628 13.1559V11.3177C10.7628 11.0236 10.9833 10.7295 11.351 10.7295H13.1892C13.4833 10.7295 13.7775 10.9501 13.7775 11.3177V13.1559C13.7775 13.5236 13.5569 13.7442 13.1892 13.7442ZM19.0716 20.3618H17.2333C16.9392 20.3618 16.6451 20.1412 16.6451 19.7736V17.9353C16.6451 17.6412 16.8657 17.3471 17.2333 17.3471H19.0716C19.3657 17.3471 19.6598 17.5677 19.6598 17.9353V19.7736C19.6598 20.1412 19.4392 20.3618 19.0716 20.3618ZM19.0716 13.7442H17.2333C16.9392 13.7442 16.6451 13.5236 16.6451 13.1559V11.3177C16.6451 11.0236 16.8657 10.7295 17.2333 10.7295H19.0716C19.3657 10.7295 19.6598 10.9501 19.6598 11.3177V13.1559C19.6598 13.5236 19.4392 13.7442 19.0716 13.7442Z"
                          fill="#353978"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_93_881">
                          <rect
                            width="25"
                            height="25"
                            fill="white"
                            transform="translate(0.0274658 0.141113)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>

                  <div className="form__group field one-box-add">
                    <label
                      className={`form__label more-label-x ${
                        DepartureDate ? "hidden" : ""
                      }`}
                      htmlFor="date"
                    >
                      {t("upperSection.departure_date")}
                    </label>
                    <DatePicker
                      selected={DepartureDate ? new Date(DepartureDate) : null}
                      onChange={handleDateChange}
                      className="form__field more-short-withd"
                      calendarClassName="large-calendar"
                      placeholderText="Select Date"
                      minDate={new Date()} // Disables past dates
                    />
                  </div>
                </div>

                <div className="Flights-Tab-input-group ">
                  <div className="Flights-Tab-input-group-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      viewBox="0 0 26 26"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_93_881)">
                        <path
                          d="M21.7922 1.61182H19.5863V3.8177C19.5863 4.25888 19.2186 4.55299 18.851 4.55299C18.4833 4.55299 18.1157 4.25888 18.1157 3.8177V1.61182H6.35099V3.8177C6.35099 4.25888 5.98334 4.55299 5.6157 4.55299C5.24805 4.55299 4.8804 4.25888 4.8804 3.8177V1.61182H2.67452C1.57158 1.61182 0.762756 2.5677 0.762756 3.8177V6.46476H24.2922V3.8177C24.2922 2.5677 22.9686 1.61182 21.7922 1.61182ZM0.762756 8.00888V21.4648C0.762756 22.7883 1.57158 23.6706 2.74805 23.6706H21.8657C23.0422 23.6706 24.3657 22.7148 24.3657 21.4648V8.00888H0.762756ZM7.30687 20.3618H5.54217C5.24805 20.3618 4.95393 20.1412 4.95393 19.7736V17.9353C4.95393 17.6412 5.17452 17.3471 5.54217 17.3471H7.3804C7.67452 17.3471 7.96864 17.5677 7.96864 17.9353V19.7736C7.89511 20.1412 7.67452 20.3618 7.30687 20.3618ZM7.30687 13.7442H5.54217C5.24805 13.7442 4.95393 13.5236 4.95393 13.1559V11.3177C4.95393 11.0236 5.17452 10.7295 5.54217 10.7295H7.3804C7.67452 10.7295 7.96864 10.9501 7.96864 11.3177V13.1559C7.89511 13.5236 7.67452 13.7442 7.30687 13.7442ZM13.1892 20.3618H11.351C11.0569 20.3618 10.7628 20.1412 10.7628 19.7736V17.9353C10.7628 17.6412 10.9833 17.3471 11.351 17.3471H13.1892C13.4833 17.3471 13.7775 17.5677 13.7775 17.9353V19.7736C13.7775 20.1412 13.5569 20.3618 13.1892 20.3618ZM13.1892 13.7442H11.351C11.0569 13.7442 10.7628 13.5236 10.7628 13.1559V11.3177C10.7628 11.0236 10.9833 10.7295 11.351 10.7295H13.1892C13.4833 10.7295 13.7775 10.9501 13.7775 11.3177V13.1559C13.7775 13.5236 13.5569 13.7442 13.1892 13.7442ZM19.0716 20.3618H17.2333C16.9392 20.3618 16.6451 20.1412 16.6451 19.7736V17.9353C16.6451 17.6412 16.8657 17.3471 17.2333 17.3471H19.0716C19.3657 17.3471 19.6598 17.5677 19.6598 17.9353V19.7736C19.6598 20.1412 19.4392 20.3618 19.0716 20.3618ZM19.0716 13.7442H17.2333C16.9392 13.7442 16.6451 13.5236 16.6451 13.1559V11.3177C16.6451 11.0236 16.8657 10.7295 17.2333 10.7295H19.0716C19.3657 10.7295 19.6598 10.9501 19.6598 11.3177V13.1559C19.6598 13.5236 19.4392 13.7442 19.0716 13.7442Z"
                          fill="#353978"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_93_881">
                          <rect
                            width="25"
                            height="25"
                            fill="white"
                            transform="translate(0.0274658 0.141113)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>

                  <div className="form__group field one-box-add">
                    <label
                      className={`form__label more-label-x ${
                        DepartureDate ? "hidden" : ""
                      }`}
                      htmlFor="date"
                    >
                      {t("upperSection.return_date")}
                    </label>
                  </div>
                </div>

                <div className="Flights-Tab-btn-group">
                  <button onClick={() => handleSubmit()}>
                    {t("upperSection.start_journey")}
                  </button>
                </div>
              </div>
            </TabPanel>

            <TabPanel>
              <div className="Flights-Tab-form">
                {titleChange == true ? (
                  <>
                    <div className="Flights-Tab-input-group more-with">
                      <div className="Flights-Tab-input-group-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="26"
                          height="26"
                          viewBox="0 0 26 26"
                          fill="none"
                        >
                          <g clipPath="url(#clip0_93_920)">
                            <path
                              d="M13.2549 0.647461C8.26243 0.647461 4.20081 4.70908 4.20081 9.70146C4.20081 15.8972 12.3033 24.9928 12.6483 25.377C12.9723 25.7379 13.538 25.7373 13.8615 25.377C14.2064 24.9928 22.3089 15.8972 22.3089 9.70146C22.3088 4.70908 18.2472 0.647461 13.2549 0.647461ZM13.2549 14.2568C10.743 14.2568 8.69958 12.2133 8.69958 9.70146C8.69958 7.18965 10.7431 5.14619 13.2549 5.14619C15.7666 5.14619 17.8101 7.1897 17.8101 9.70151C17.8101 12.2133 15.7666 14.2568 13.2549 14.2568Z"
                              fill="#353978"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_93_920">
                              <rect
                                width="25"
                                height="25"
                                fill="white"
                                transform="translate(0.754883 0.647461)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                      <div className="form__group field">
                        <input
                          type="input"
                          className="form__field"
                          placeholder="Name"
                          required=""
                          value={flyingTo}
                          onChange={(e) => handleChange(e, "flyingTo")}
                        />
                        <label for="name" className="form__label">
                          {t("upperSection.flying_to")}
                        </label>
                      </div>
                      {toSuggestions?.length > 0 && flyingTo && (
                        <ul className="suggestions">
                          {toSuggestions?.map((airport, index) => (
                            <li
                              key={index}
                              onClick={() =>
                                handleSelectSuggestion(
                                  airport.iataCode,
                                  airport.name,
                                  "flyingTo",
                                )
                              }
                            >
                              <Flightsvg />
                              {airport.name} ({airport.iataCode})
                            </li>
                          ))}
                        </ul>
                      )}
                      <button
                        className="swich"
                        onClick={() => setTitleChange(!titleChange)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="21"
                          viewBox="0 0 20 21"
                          fill="none"
                        >
                          <g clipPath="url(#clip0_93_933)">
                            <path
                              d="M3.60785 8.97154C3.84043 9.20449 4.21973 9.20449 4.45232 8.97154L5.22473 8.19912C5.45769 7.96654 5.45769 7.58723 5.22473 7.35465L4.45232 6.58223H15.0806C16.0688 6.58223 16.8726 7.38601 16.8726 8.37421C16.8726 8.86813 17.2747 9.2702 17.7686 9.2702H18.3659C18.8598 9.2702 19.2619 8.86813 19.2619 8.37421C19.2619 6.06853 17.3863 4.19293 15.0806 4.19293H4.45232L5.22473 3.42051C5.45769 3.18793 5.45769 2.80863 5.22473 2.57604L4.45232 1.80362C4.21973 1.57067 3.84043 1.57067 3.60785 1.80362L0.23482 5.17628C0.118341 5.29313 0.118341 5.48203 0.23482 5.59889L3.60785 8.97154Z"
                              fill="#353978"
                            />
                            <path
                              d="M15.8015 11.9588C15.5689 11.7259 15.19 11.7259 14.957 11.9588L14.1846 12.7312C13.9512 12.9646 13.9508 13.3419 14.1846 13.5757L14.957 14.3481H4.32874C3.34054 14.3481 2.53677 13.5443 2.53677 12.5561C2.53677 12.0622 2.13469 11.6602 1.64078 11.6602H1.04345C0.549536 11.6602 0.147461 12.0622 0.147461 12.5561C0.147461 14.8618 2.02307 16.7374 4.32874 16.7374H14.957L14.1846 17.5098C13.9512 17.7433 13.9508 18.1205 14.1846 18.3543L14.957 19.1267C15.19 19.3597 15.5686 19.3597 15.8015 19.1267L19.1745 15.7541C19.291 15.6372 19.291 15.4483 19.1745 15.3315L15.8015 11.9588Z"
                              fill="#353978"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_93_933">
                              <rect
                                width="19.1144"
                                height="19.1144"
                                fill="white"
                                transform="translate(0.147461 0.908203)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      </button>
                    </div>
                    <div className="Flights-Tab-input-group more-with">
                      <div className="Flights-Tab-input-group-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="26"
                          height="26"
                          viewBox="0 0 26 26"
                          fill="none"
                        >
                          <g clipPath="url(#clip0_93_920)">
                            <path
                              d="M13.2549 0.647461C8.26243 0.647461 4.20081 4.70908 4.20081 9.70146C4.20081 15.8972 12.3033 24.9928 12.6483 25.377C12.9723 25.7379 13.538 25.7373 13.8615 25.377C14.2064 24.9928 22.3089 15.8972 22.3089 9.70146C22.3088 4.70908 18.2472 0.647461 13.2549 0.647461ZM13.2549 14.2568C10.743 14.2568 8.69958 12.2133 8.69958 9.70146C8.69958 7.18965 10.7431 5.14619 13.2549 5.14619C15.7666 5.14619 17.8101 7.1897 17.8101 9.70151C17.8101 12.2133 15.7666 14.2568 13.2549 14.2568Z"
                              fill="#353978"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_93_920">
                              <rect
                                width="25"
                                height="25"
                                fill="white"
                                transform="translate(0.754883 0.647461)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                      <div className="form__group field">
                        <input
                          type="input"
                          className="form__field"
                          placeholder="Name"
                          required=""
                          value={flyingFrom}
                          onChange={(e) => handleChange(e, "flyingFrom")}
                        />
                        <label for="name" className="form__label">
                          {t("upperSection.flying_from")}
                        </label>
                      </div>
                      {fromSuggestions?.length > 0 && flyingFrom && (
                        <ul className="suggestions">
                          {fromSuggestions?.map((airport, index) => (
                            <li
                              key={index}
                              onClick={() =>
                                handleSelectSuggestion(
                                  airport.iataCode,
                                  airport.name,
                                  "flyingFrom",
                                )
                              }
                            >
                              <Flightsvg />
                              {airport.name} ({airport.iataCode})
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="Flights-Tab-input-group more-with ">
                      <div className="Flights-Tab-input-group-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="26"
                          height="26"
                          viewBox="0 0 26 26"
                          fill="none"
                        >
                          <g clipPath="url(#clip0_93_920)">
                            <path
                              d="M13.2549 0.647461C8.26243 0.647461 4.20081 4.70908 4.20081 9.70146C4.20081 15.8972 12.3033 24.9928 12.6483 25.377C12.9723 25.7379 13.538 25.7373 13.8615 25.377C14.2064 24.9928 22.3089 15.8972 22.3089 9.70146C22.3088 4.70908 18.2472 0.647461 13.2549 0.647461ZM13.2549 14.2568C10.743 14.2568 8.69958 12.2133 8.69958 9.70146C8.69958 7.18965 10.7431 5.14619 13.2549 5.14619C15.7666 5.14619 17.8101 7.1897 17.8101 9.70151C17.8101 12.2133 15.7666 14.2568 13.2549 14.2568Z"
                              fill="#353978"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_93_920">
                              <rect
                                width="25"
                                height="25"
                                fill="white"
                                transform="translate(0.754883 0.647461)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                      <div className="form__group field">
                        <input
                          type="input"
                          className="form__field"
                          placeholder="Name"
                          required=""
                          value={flyingFrom}
                          onChange={(e) => handleChange(e, "flyingFrom")}
                        />
                        <label for="name" className="form__label">
                          {t("upperSection.flying_from")}
                        </label>
                      </div>
                      {fromSuggestions?.length > 0 && flyingFrom && (
                        <ul className="suggestions">
                          {fromSuggestions?.map((airport, index) => (
                            <li
                              key={index}
                              onClick={() =>
                                handleSelectSuggestion(
                                  airport.iataCode,
                                  airport.name,
                                  "flyingFrom",
                                )
                              }
                            >
                              <Flightsvg />
                              {airport.name} ({airport.iataCode})
                            </li>
                          ))}
                        </ul>
                      )}
                      <button
                        className="swich"
                        onClick={() => setTitleChange(!titleChange)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="21"
                          viewBox="0 0 20 21"
                          fill="none"
                        >
                          <g clipPath="url(#clip0_93_933)">
                            <path
                              d="M3.60785 8.97154C3.84043 9.20449 4.21973 9.20449 4.45232 8.97154L5.22473 8.19912C5.45769 7.96654 5.45769 7.58723 5.22473 7.35465L4.45232 6.58223H15.0806C16.0688 6.58223 16.8726 7.38601 16.8726 8.37421C16.8726 8.86813 17.2747 9.2702 17.7686 9.2702H18.3659C18.8598 9.2702 19.2619 8.86813 19.2619 8.37421C19.2619 6.06853 17.3863 4.19293 15.0806 4.19293H4.45232L5.22473 3.42051C5.45769 3.18793 5.45769 2.80863 5.22473 2.57604L4.45232 1.80362C4.21973 1.57067 3.84043 1.57067 3.60785 1.80362L0.23482 5.17628C0.118341 5.29313 0.118341 5.48203 0.23482 5.59889L3.60785 8.97154Z"
                              fill="#353978"
                            />
                            <path
                              d="M15.8015 11.9588C15.5689 11.7259 15.19 11.7259 14.957 11.9588L14.1846 12.7312C13.9512 12.9646 13.9508 13.3419 14.1846 13.5757L14.957 14.3481H4.32874C3.34054 14.3481 2.53677 13.5443 2.53677 12.5561C2.53677 12.0622 2.13469 11.6602 1.64078 11.6602H1.04345C0.549536 11.6602 0.147461 12.0622 0.147461 12.5561C0.147461 14.8618 2.02307 16.7374 4.32874 16.7374H14.957L14.1846 17.5098C13.9512 17.7433 13.9508 18.1205 14.1846 18.3543L14.957 19.1267C15.19 19.3597 15.5686 19.3597 15.8015 19.1267L19.1745 15.7541C19.291 15.6372 19.291 15.4483 19.1745 15.3315L15.8015 11.9588Z"
                              fill="#353978"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_93_933">
                              <rect
                                width="19.1144"
                                height="19.1144"
                                fill="white"
                                transform="translate(0.147461 0.908203)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      </button>
                    </div>
                    <div className="Flights-Tab-input-group more-with">
                      <div className="Flights-Tab-input-group-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="26"
                          height="26"
                          viewBox="0 0 26 26"
                          fill="none"
                        >
                          <g clipPath="url(#clip0_93_920)">
                            <path
                              d="M13.2549 0.647461C8.26243 0.647461 4.20081 4.70908 4.20081 9.70146C4.20081 15.8972 12.3033 24.9928 12.6483 25.377C12.9723 25.7379 13.538 25.7373 13.8615 25.377C14.2064 24.9928 22.3089 15.8972 22.3089 9.70146C22.3088 4.70908 18.2472 0.647461 13.2549 0.647461ZM13.2549 14.2568C10.743 14.2568 8.69958 12.2133 8.69958 9.70146C8.69958 7.18965 10.7431 5.14619 13.2549 5.14619C15.7666 5.14619 17.8101 7.1897 17.8101 9.70151C17.8101 12.2133 15.7666 14.2568 13.2549 14.2568Z"
                              fill="#353978"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_93_920">
                              <rect
                                width="25"
                                height="25"
                                fill="white"
                                transform="translate(0.754883 0.647461)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                      <div className="form__group field">
                        <input
                          type="input"
                          className="form__field"
                          placeholder="Name"
                          required=""
                          value={flyingTo}
                          onChange={(e) => handleChange(e, "flyingTo")}
                        />
                        <label for="name" className="form__label">
                          {t("upperSection.flying_to")}
                        </label>
                      </div>
                      {toSuggestions?.length > 0 && flyingTo && (
                        <ul className="suggestions">
                          {toSuggestions?.map((airport, index) => (
                            <li
                              key={index}
                              onClick={() =>
                                handleSelectSuggestion(
                                  airport.iataCode,
                                  airport.name,
                                  "flyingTo",
                                )
                              }
                            >
                              <Flightsvg />
                              {airport.name} ({airport.iataCode})
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </>
                )}

                <div className="Flights-Tab-input-group more-with">
                  <div className="Flights-Tab-input-group-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      viewBox="0 0 26 26"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_93_889)">
                        <path
                          d="M22.9492 5.35601H17.7409V4.31431C17.7409 3.16533 16.8066 2.23096 15.6576 2.23096H9.40759C8.25862 2.23096 7.32424 3.16528 7.32424 4.31431V5.35596H2.11594C0.966919 5.35601 0.0325928 6.29033 0.0325928 7.43931V10.5643C0.0325928 11.7133 0.966919 12.6477 2.11594 12.6477H10.4493V12.1268C10.4493 11.8389 10.6823 11.606 10.9701 11.606H14.0951C14.383 11.606 14.616 11.8389 14.616 12.1268V12.6477H22.9493C24.0983 12.6477 25.0326 11.7133 25.0326 10.5643V7.43931C25.0326 6.29033 24.0983 5.35601 22.9492 5.35601ZM15.6576 5.35601H9.40759V4.31431H15.6576V5.35601Z"
                          fill="#353978"
                        />
                        <path
                          d="M24.7437 13.2098C24.5662 13.1218 24.3541 13.1422 24.1974 13.2612C23.8271 13.5414 23.3958 13.6894 22.9492 13.6894H14.6159V15.2519C14.6159 15.5398 14.383 15.7728 14.0951 15.7728H10.9701C10.6822 15.7728 10.4492 15.5398 10.4492 15.2519V13.6894H2.11594C1.66936 13.6894 1.23806 13.5414 0.867749 13.2612C0.710571 13.1411 0.498999 13.1208 0.32146 13.2098C0.144507 13.2978 0.0325928 13.4783 0.0325928 13.6762V20.9811C0.0325928 22.1301 0.966919 23.0645 2.11594 23.0645H22.9493C24.0983 23.0645 25.0326 22.1302 25.0326 20.9811V13.6762C25.0326 13.4783 24.9207 13.2978 24.7437 13.2098Z"
                          fill="#353978"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_93_889">
                          <rect
                            width="25"
                            height="25"
                            fill="white"
                            transform="translate(0.0325928 0.147461)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>

                  <Drop1
                    setCabin={setCabin}
                    value={cabin}
                    persons={persons}
                    setPersons={setPersons}
                  />
                </div>

                {/* <div className="Flights-Tab-input-group">
                  <div className="Flights-Tab-input-group-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      viewBox="0 0 26 26"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_93_920)">
                        <path
                          d="M13.2549 0.647461C8.26243 0.647461 4.20081 4.70908 4.20081 9.70146C4.20081 15.8972 12.3033 24.9928 12.6483 25.377C12.9723 25.7379 13.538 25.7373 13.8615 25.377C14.2064 24.9928 22.3089 15.8972 22.3089 9.70146C22.3088 4.70908 18.2472 0.647461 13.2549 0.647461ZM13.2549 14.2568C10.743 14.2568 8.69958 12.2133 8.69958 9.70146C8.69958 7.18965 10.7431 5.14619 13.2549 5.14619C15.7666 5.14619 17.8101 7.1897 17.8101 9.70151C17.8101 12.2133 15.7666 14.2568 13.2549 14.2568Z"
                          fill="#353978"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_93_920">
                          <rect
                            width="25"
                            height="25"
                            fill="white"
                            transform="translate(0.754883 0.647461)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <div className="form__group field">
                    <input
                      type="number"
                      className="form__field"
                      placeholder="Name"
                      required=""
                      value={persons?.adults}
                      onChange={(e) =>
                        setPersons({ ...persons, adults: e.target.value })
                      }
                    />
                    <label for="name" className="form__label">
                      Adults
                    </label>
                  </div>
                </div>

                <div className="Flights-Tab-input-group">
                  <div className="Flights-Tab-input-group-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      viewBox="0 0 26 26"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_93_920)">
                        <path
                          d="M13.2549 0.647461C8.26243 0.647461 4.20081 4.70908 4.20081 9.70146C4.20081 15.8972 12.3033 24.9928 12.6483 25.377C12.9723 25.7379 13.538 25.7373 13.8615 25.377C14.2064 24.9928 22.3089 15.8972 22.3089 9.70146C22.3088 4.70908 18.2472 0.647461 13.2549 0.647461ZM13.2549 14.2568C10.743 14.2568 8.69958 12.2133 8.69958 9.70146C8.69958 7.18965 10.7431 5.14619 13.2549 5.14619C15.7666 5.14619 17.8101 7.1897 17.8101 9.70151C17.8101 12.2133 15.7666 14.2568 13.2549 14.2568Z"
                          fill="#353978"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_93_920">
                          <rect
                            width="25"
                            height="25"
                            fill="white"
                            transform="translate(0.754883 0.647461)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <div className="form__group field">
                    <input
                      type="number"
                      className="form__field"
                      placeholder="Name"
                      required=""
                      value={persons?.childrens}
                      onChange={(e) =>
                        setPersons({ ...persons, childrens: e.target.value })
                      }
                    />
                    <label for="name" className="form__label">
                      Childrens
                    </label>
                  </div>
                </div> */}

                <div className="Flights-Tab-input-group ">
                  <div className="Flights-Tab-input-group-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      viewBox="0 0 26 26"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_93_881)">
                        <path
                          d="M21.7922 1.61182H19.5863V3.8177C19.5863 4.25888 19.2186 4.55299 18.851 4.55299C18.4833 4.55299 18.1157 4.25888 18.1157 3.8177V1.61182H6.35099V3.8177C6.35099 4.25888 5.98334 4.55299 5.6157 4.55299C5.24805 4.55299 4.8804 4.25888 4.8804 3.8177V1.61182H2.67452C1.57158 1.61182 0.762756 2.5677 0.762756 3.8177V6.46476H24.2922V3.8177C24.2922 2.5677 22.9686 1.61182 21.7922 1.61182ZM0.762756 8.00888V21.4648C0.762756 22.7883 1.57158 23.6706 2.74805 23.6706H21.8657C23.0422 23.6706 24.3657 22.7148 24.3657 21.4648V8.00888H0.762756ZM7.30687 20.3618H5.54217C5.24805 20.3618 4.95393 20.1412 4.95393 19.7736V17.9353C4.95393 17.6412 5.17452 17.3471 5.54217 17.3471H7.3804C7.67452 17.3471 7.96864 17.5677 7.96864 17.9353V19.7736C7.89511 20.1412 7.67452 20.3618 7.30687 20.3618ZM7.30687 13.7442H5.54217C5.24805 13.7442 4.95393 13.5236 4.95393 13.1559V11.3177C4.95393 11.0236 5.17452 10.7295 5.54217 10.7295H7.3804C7.67452 10.7295 7.96864 10.9501 7.96864 11.3177V13.1559C7.89511 13.5236 7.67452 13.7442 7.30687 13.7442ZM13.1892 20.3618H11.351C11.0569 20.3618 10.7628 20.1412 10.7628 19.7736V17.9353C10.7628 17.6412 10.9833 17.3471 11.351 17.3471H13.1892C13.4833 17.3471 13.7775 17.5677 13.7775 17.9353V19.7736C13.7775 20.1412 13.5569 20.3618 13.1892 20.3618ZM13.1892 13.7442H11.351C11.0569 13.7442 10.7628 13.5236 10.7628 13.1559V11.3177C10.7628 11.0236 10.9833 10.7295 11.351 10.7295H13.1892C13.4833 10.7295 13.7775 10.9501 13.7775 11.3177V13.1559C13.7775 13.5236 13.5569 13.7442 13.1892 13.7442ZM19.0716 20.3618H17.2333C16.9392 20.3618 16.6451 20.1412 16.6451 19.7736V17.9353C16.6451 17.6412 16.8657 17.3471 17.2333 17.3471H19.0716C19.3657 17.3471 19.6598 17.5677 19.6598 17.9353V19.7736C19.6598 20.1412 19.4392 20.3618 19.0716 20.3618ZM19.0716 13.7442H17.2333C16.9392 13.7442 16.6451 13.5236 16.6451 13.1559V11.3177C16.6451 11.0236 16.8657 10.7295 17.2333 10.7295H19.0716C19.3657 10.7295 19.6598 10.9501 19.6598 11.3177V13.1559C19.6598 13.5236 19.4392 13.7442 19.0716 13.7442Z"
                          fill="#353978"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_93_881">
                          <rect
                            width="25"
                            height="25"
                            fill="white"
                            transform="translate(0.0274658 0.141113)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>

                  <div className="form__group field one-box-add">
                    <label
                      className={`form__label more-label-x ${
                        DepartureDate ? "hidden" : ""
                      }`}
                      htmlFor="date"
                    >
                      {t("upperSection.departure_date")}
                    </label>
                    <DatePicker
                      selected={DepartureDate ? new Date(DepartureDate) : null}
                      onChange={handleDateChange}
                      className="form__field more-short-withd"
                      calendarClassName="large-calendar"
                      placeholderText="Select Date"
                      minDate={new Date()} // Disables past dates
                    />
                  </div>
                </div>

                <div className="Flights-Tab-input-group ">
                  <div className="Flights-Tab-input-group-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      viewBox="0 0 26 26"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_93_881)">
                        <path
                          d="M21.7922 1.61182H19.5863V3.8177C19.5863 4.25888 19.2186 4.55299 18.851 4.55299C18.4833 4.55299 18.1157 4.25888 18.1157 3.8177V1.61182H6.35099V3.8177C6.35099 4.25888 5.98334 4.55299 5.6157 4.55299C5.24805 4.55299 4.8804 4.25888 4.8804 3.8177V1.61182H2.67452C1.57158 1.61182 0.762756 2.5677 0.762756 3.8177V6.46476H24.2922V3.8177C24.2922 2.5677 22.9686 1.61182 21.7922 1.61182ZM0.762756 8.00888V21.4648C0.762756 22.7883 1.57158 23.6706 2.74805 23.6706H21.8657C23.0422 23.6706 24.3657 22.7148 24.3657 21.4648V8.00888H0.762756ZM7.30687 20.3618H5.54217C5.24805 20.3618 4.95393 20.1412 4.95393 19.7736V17.9353C4.95393 17.6412 5.17452 17.3471 5.54217 17.3471H7.3804C7.67452 17.3471 7.96864 17.5677 7.96864 17.9353V19.7736C7.89511 20.1412 7.67452 20.3618 7.30687 20.3618ZM7.30687 13.7442H5.54217C5.24805 13.7442 4.95393 13.5236 4.95393 13.1559V11.3177C4.95393 11.0236 5.17452 10.7295 5.54217 10.7295H7.3804C7.67452 10.7295 7.96864 10.9501 7.96864 11.3177V13.1559C7.89511 13.5236 7.67452 13.7442 7.30687 13.7442ZM13.1892 20.3618H11.351C11.0569 20.3618 10.7628 20.1412 10.7628 19.7736V17.9353C10.7628 17.6412 10.9833 17.3471 11.351 17.3471H13.1892C13.4833 17.3471 13.7775 17.5677 13.7775 17.9353V19.7736C13.7775 20.1412 13.5569 20.3618 13.1892 20.3618ZM13.1892 13.7442H11.351C11.0569 13.7442 10.7628 13.5236 10.7628 13.1559V11.3177C10.7628 11.0236 10.9833 10.7295 11.351 10.7295H13.1892C13.4833 10.7295 13.7775 10.9501 13.7775 11.3177V13.1559C13.7775 13.5236 13.5569 13.7442 13.1892 13.7442ZM19.0716 20.3618H17.2333C16.9392 20.3618 16.6451 20.1412 16.6451 19.7736V17.9353C16.6451 17.6412 16.8657 17.3471 17.2333 17.3471H19.0716C19.3657 17.3471 19.6598 17.5677 19.6598 17.9353V19.7736C19.6598 20.1412 19.4392 20.3618 19.0716 20.3618ZM19.0716 13.7442H17.2333C16.9392 13.7442 16.6451 13.5236 16.6451 13.1559V11.3177C16.6451 11.0236 16.8657 10.7295 17.2333 10.7295H19.0716C19.3657 10.7295 19.6598 10.9501 19.6598 11.3177V13.1559C19.6598 13.5236 19.4392 13.7442 19.0716 13.7442Z"
                          fill="#353978"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_93_881">
                          <rect
                            width="25"
                            height="25"
                            fill="white"
                            transform="translate(0.0274658 0.141113)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>

                  <div className="form__group field one-box-add">
                    <label
                      className={`form__label more-label-x ${
                        DepartureDate ? "hidden" : ""
                      }`}
                      htmlFor="date"
                    >
                      {t("upperSection.return_date")}
                    </label>
                    <DatePicker
                      selected={ReturnDate ? new Date(ReturnDate) : null}
                      onChange={handleReturnDateChange}
                      className="form__field more-short-withd"
                      calendarClassName="large-calendar"
                      placeholderText="Select Date"
                      minDate={new Date()} // Disables past dates
                    />
                  </div>
                </div>

                <div className="Flights-Tab-btn-group">
                  <button onClick={() => handleSubmit()}>
                    {t("upperSection.start_journey")}
                  </button>
                </div>
              </div>
            </TabPanel>

            <TabPanel>
              <div className="Flights-Tab-form add-mian-box-add">
                {/* <div className="Flights-Tab-form"> */}
                {flightGroups?.map((group) => {
                  const filteredFromSuggestions =
                    group.flyingFrom?.trim() !== ""
                      ? fromSuggestions?.filter((airport) =>
                          airport.name
                            .toLowerCase()
                            .includes(group.flyingFrom.toLowerCase()),
                        )
                      : [];

                  const filteredToSuggestions =
                    group.flyingTo?.trim() !== ""
                      ? toSuggestions?.filter((airport) =>
                          airport.name
                            .toLowerCase()
                            .includes(group.flyingTo.toLowerCase()),
                        )
                      : [];

                  return (
                    <div key={group.id} className="Flights-Tab-form-main">
                      {/* Flying From */}
                      <div className="Flights-Tab-input-group more-with">
                        <div className="Flights-Tab-input-group-icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="26"
                            height="26"
                            viewBox="0 0 26 26"
                            fill="none"
                          >
                            <g clipPath="url(#clip0_93_920)">
                              <path
                                d="M13.2549 0.647461C8.26243 0.647461 4.20081 4.70908 4.20081 9.70146C4.20081 15.8972 12.3033 24.9928 12.6483 25.377C12.9723 25.7379 13.538 25.7373 13.8615 25.377C14.2064 24.9928 22.3089 15.8972 22.3089 9.70146C22.3088 4.70908 18.2472 0.647461 13.2549 0.647461ZM13.2549 14.2568C10.743 14.2568 8.69958 12.2133 8.69958 9.70146C8.69958 7.18965 10.7431 5.14619 13.2549 5.14619C15.7666 5.14619 17.8101 7.1897 17.8101 9.70151C17.8101 12.2133 15.7666 14.2568 13.2549 14.2568Z"
                                fill="#353978"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_93_920">
                                <rect
                                  width="25"
                                  height="25"
                                  fill="white"
                                  transform="translate(0.754883 0.647461)"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                        <div className="form__group field">
                          <input
                            type="text"
                            className="form__field"
                            placeholder="Flying From"
                            required
                            value={group.flyingFrom}
                            onChange={(e) =>
                              handleChange(e, "flyingFrom", group.id)
                            }
                          />
                          <label htmlFor="flyingFrom" className="form__label">
                            {t("upperSection.flying_from")}
                          </label>
                        </div>
                        {filteredFromSuggestions?.length > 0 && (
                          <ul className="suggestions">
                            {filteredFromSuggestions?.map((airport, index) => (
                              <li
                                key={index}
                                onClick={() =>
                                  handleSelectSuggestion(
                                    airport.iataCode,
                                    airport.name,
                                    "flyingFrom",
                                    group.id,
                                  )
                                }
                              >
                                <Flightsvg />
                                {airport.name} ({airport.iataCode})
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* Flying To */}
                      <div className="Flights-Tab-input-group more-with">
                        <div className="Flights-Tab-input-group-icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="26"
                            height="26"
                            viewBox="0 0 26 26"
                            fill="none"
                          >
                            <g clipPath="url(#clip0_93_920)">
                              <path
                                d="M13.2549 0.647461C8.26243 0.647461 4.20081 4.70908 4.20081 9.70146C4.20081 15.8972 12.3033 24.9928 12.6483 25.377C12.9723 25.7379 13.538 25.7373 13.8615 25.377C14.2064 24.9928 22.3089 15.8972 22.3089 9.70146C22.3088 4.70908 18.2472 0.647461 13.2549 0.647461ZM13.2549 14.2568C10.743 14.2568 8.69958 12.2133 8.69958 9.70146C8.69958 7.18965 10.7431 5.14619 13.2549 5.14619C15.7666 5.14619 17.8101 7.1897 17.8101 9.70151C17.8101 12.2133 15.7666 14.2568 13.2549 14.2568Z"
                                fill="#353978"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_93_920">
                                <rect
                                  width="25"
                                  height="25"
                                  fill="white"
                                  transform="translate(0.754883 0.647461)"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                        <div className="form__group field">
                          <input
                            type="text"
                            className="form__field"
                            placeholder="Flying To"
                            required
                            value={group.flyingTo}
                            onChange={(e) =>
                              handleChange(e, "flyingTo", group.id)
                            }
                          />
                          <label htmlFor="flyingTo" className="form__label">
                            {t("upperSection.flying_to")}
                          </label>
                        </div>
                        {filteredToSuggestions.length > 0 && (
                          <ul className="suggestions">
                            {filteredToSuggestions.map((airport, index) => (
                              <li
                                key={index}
                                onClick={() =>
                                  handleSelectSuggestion(
                                    airport.iataCode,
                                    airport.name,
                                    "flyingTo",
                                    group.id,
                                  )
                                }
                              >
                                <Flightsvg />
                                {airport.name} ({airport.iataCode})
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className="Flights-Tab-input-group more-with">
                        <div className="Flights-Tab-input-group-icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="26"
                            height="26"
                            viewBox="0 0 26 26"
                            fill="none"
                          >
                            <g clipPath="url(#clip0_93_889)">
                              <path
                                d="M22.9492 5.35601H17.7409V4.31431C17.7409 3.16533 16.8066 2.23096 15.6576 2.23096H9.40759C8.25862 2.23096 7.32424 3.16528 7.32424 4.31431V5.35596H2.11594C0.966919 5.35601 0.0325928 6.29033 0.0325928 7.43931V10.5643C0.0325928 11.7133 0.966919 12.6477 2.11594 12.6477H10.4493V12.1268C10.4493 11.8389 10.6823 11.606 10.9701 11.606H14.0951C14.383 11.606 14.616 11.8389 14.616 12.1268V12.6477H22.9493C24.0983 12.6477 25.0326 11.7133 25.0326 10.5643V7.43931C25.0326 6.29033 24.0983 5.35601 22.9492 5.35601ZM15.6576 5.35601H9.40759V4.31431H15.6576V5.35601Z"
                                fill="#353978"
                              />
                              <path
                                d="M24.7437 13.2098C24.5662 13.1218 24.3541 13.1422 24.1974 13.2612C23.8271 13.5414 23.3958 13.6894 22.9492 13.6894H14.6159V15.2519C14.6159 15.5398 14.383 15.7728 14.0951 15.7728H10.9701C10.6822 15.7728 10.4492 15.5398 10.4492 15.2519V13.6894H2.11594C1.66936 13.6894 1.23806 13.5414 0.867749 13.2612C0.710571 13.1411 0.498999 13.1208 0.32146 13.2098C0.144507 13.2978 0.0325928 13.4783 0.0325928 13.6762V20.9811C0.0325928 22.1301 0.966919 23.0645 2.11594 23.0645H22.9493C24.0983 23.0645 25.0326 22.1302 25.0326 20.9811V13.6762C25.0326 13.4783 24.9207 13.2978 24.7437 13.2098Z"
                                fill="#353978"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_93_889">
                                <rect
                                  width="25"
                                  height="25"
                                  fill="white"
                                  transform="translate(0.0325928 0.147461)"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                        </div>

                        <Drop1
                          setCabin={setCabin}
                          value={cabin}
                          persons={persons}
                          setPersons={setPersons}
                        />
                      </div>

                      {/* Departure Date */}
                      <div className="Flights-Tab-input-group">
                        <div className="Flights-Tab-input-group-icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="26"
                            height="26"
                            viewBox="0 0 26 26"
                            fill="none"
                          >
                            <g clipPath="url(#clip0_93_881)">
                              <path
                                d="M21.7922 1.61182H19.5863V3.8177C19.5863 4.25888 19.2186 4.55299 18.851 4.55299C18.4833 4.55299 18.1157 4.25888 18.1157 3.8177V1.61182H6.35099V3.8177C6.35099 4.25888 5.98334 4.55299 5.6157 4.55299C5.24805 4.55299 4.8804 4.25888 4.8804 3.8177V1.61182H2.67452C1.57158 1.61182 0.762756 2.5677 0.762756 3.8177V6.46476H24.2922V3.8177C24.2922 2.5677 22.9686 1.61182 21.7922 1.61182ZM0.762756 8.00888V21.4648C0.762756 22.7883 1.57158 23.6706 2.74805 23.6706H21.8657C23.0422 23.6706 24.3657 22.7148 24.3657 21.4648V8.00888H0.762756ZM7.30687 20.3618H5.54217C5.24805 20.3618 4.95393 20.1412 4.95393 19.7736V17.9353C4.95393 17.6412 5.17452 17.3471 5.54217 17.3471H7.3804C7.67452 17.3471 7.96864 17.5677 7.96864 17.9353V19.7736C7.89511 20.1412 7.67452 20.3618 7.30687 20.3618ZM7.30687 13.7442H5.54217C5.24805 13.7442 4.95393 13.5236 4.95393 13.1559V11.3177C4.95393 11.0236 5.17452 10.7295 5.54217 10.7295H7.3804C7.67452 10.7295 7.96864 10.9501 7.96864 11.3177V13.1559C7.89511 13.5236 7.67452 13.7442 7.30687 13.7442ZM13.1892 20.3618H11.351C11.0569 20.3618 10.7628 20.1412 10.7628 19.7736V17.9353C10.7628 17.6412 10.9833 17.3471 11.351 17.3471H13.1892C13.4833 17.3471 13.7775 17.5677 13.7775 17.9353V19.7736C13.7775 20.1412 13.5569 20.3618 13.1892 20.3618ZM13.1892 13.7442H11.351C11.0569 13.7442 10.7628 13.5236 10.7628 13.1559V11.3177C10.7628 11.0236 10.9833 10.7295 11.351 10.7295H13.1892C13.4833 10.7295 13.7775 10.9501 13.7775 11.3177V13.1559C13.7775 13.5236 13.5569 13.7442 13.1892 13.7442ZM19.0716 20.3618H17.2333C16.9392 20.3618 16.6451 20.1412 16.6451 19.7736V17.9353C16.6451 17.6412 16.8657 17.3471 17.2333 17.3471H19.0716C19.3657 17.3471 19.6598 17.5677 19.6598 17.9353V19.7736C19.6598 20.1412 19.4392 20.3618 19.0716 20.3618ZM19.0716 13.7442H17.2333C16.9392 13.7442 16.6451 13.5236 16.6451 13.1559V11.3177C16.6451 11.0236 16.8657 10.7295 17.2333 10.7295H19.0716C19.3657 10.7295 19.6598 10.9501 19.6598 11.3177V13.1559C19.6598 13.5236 19.4392 13.7442 19.0716 13.7442Z"
                                fill="#353978"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_93_881">
                                <rect
                                  width="25"
                                  height="25"
                                  fill="white"
                                  transform="translate(0.0274658 0.141113)"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                        <div className="form__group field one-box-add">
                          <label
                            className={`form__label more-label-x ${
                              group.DepartureDate ? "hidden" : ""
                            }`}
                            htmlFor="date"
                          >
                            {t("upperSection.departure_date")}
                          </label>
                          <DatePicker
                            selected={
                              group.DepartureDate
                                ? new Date(group.DepartureDate)
                                : null
                            }
                            onChange={(date) => {
                              setFlightGroups((prevGroups) =>
                                prevGroups.map((g) =>
                                  g.id === group.id
                                    ? {
                                        ...g,
                                        DepartureDate: format(
                                          date,
                                          "yyyy-MM-dd",
                                        ),
                                      }
                                    : g,
                                ),
                              );
                            }}
                            className="form__field more-short-withd"
                            calendarClassName="large-calendar"
                            placeholderText="Select Date"
                            minDate={new Date()} // Disables past dates
                          />
                        </div>
                      </div>

                      {/* <div className="Flights-Tab-input-group">
                        <div className="Flights-Tab-input-group-icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="26"
                            height="26"
                            viewBox="0 0 26 26"
                            fill="none"
                          >
                            <g clipPath="url(#clip0_93_920)">
                              <path
                                d="M13.2549 0.647461C8.26243 0.647461 4.20081 4.70908 4.20081 9.70146C4.20081 15.8972 12.3033 24.9928 12.6483 25.377C12.9723 25.7379 13.538 25.7373 13.8615 25.377C14.2064 24.9928 22.3089 15.8972 22.3089 9.70146C22.3088 4.70908 18.2472 0.647461 13.2549 0.647461ZM13.2549 14.2568C10.743 14.2568 8.69958 12.2133 8.69958 9.70146C8.69958 7.18965 10.7431 5.14619 13.2549 5.14619C15.7666 5.14619 17.8101 7.1897 17.8101 9.70151C17.8101 12.2133 15.7666 14.2568 13.2549 14.2568Z"
                                fill="#353978"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_93_920">
                                <rect
                                  width="25"
                                  height="25"
                                  fill="white"
                                  transform="translate(0.754883 0.647461)"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                        <div className="form__group field">
                          <input
                            type="number"
                            className="form__field"
                            placeholder="Name"
                            required=""
                            value={persons?.adults}
                            onChange={(e) =>
                              setPersons({
                                ...persons,
                                adults: e?.target.value,
                              })
                            }
                          />
                          <label for="name" className="form__label">
                            Adults
                          </label>
                        </div>
                      </div>

                      <div className="Flights-Tab-input-group">
                        <div className="Flights-Tab-input-group-icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="26"
                            height="26"
                            viewBox="0 0 26 26"
                            fill="none"
                          >
                            <g clipPath="url(#clip0_93_920)">
                              <path
                                d="M13.2549 0.647461C8.26243 0.647461 4.20081 4.70908 4.20081 9.70146C4.20081 15.8972 12.3033 24.9928 12.6483 25.377C12.9723 25.7379 13.538 25.7373 13.8615 25.377C14.2064 24.9928 22.3089 15.8972 22.3089 9.70146C22.3088 4.70908 18.2472 0.647461 13.2549 0.647461ZM13.2549 14.2568C10.743 14.2568 8.69958 12.2133 8.69958 9.70146C8.69958 7.18965 10.7431 5.14619 13.2549 5.14619C15.7666 5.14619 17.8101 7.1897 17.8101 9.70151C17.8101 12.2133 15.7666 14.2568 13.2549 14.2568Z"
                                fill="#353978"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_93_920">
                                <rect
                                  width="25"
                                  height="25"
                                  fill="white"
                                  transform="translate(0.754883 0.647461)"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                        <div className="form__group field">
                          <input
                            type="number"
                            className="form__field"
                            placeholder="Name"
                            required=""
                            value={persons?.childrens}
                            onChange={(e) =>
                              setPersons({
                                ...persons,
                                childrens: e.target.value,
                              })
                            }
                          />
                          <label for="name" className="form__label">
                            Childrens
                          </label>
                        </div>
                      </div> */}

                      <div className="Flights-Tab-btn-group">
                        <button onClick={() => handleSubmit("multiCity")}>
                          {t("upperSection.start_journey")}
                        </button>
                      </div>

                      <div className="add-flight-btn-box">
                        <button
                          disabled={flightGroups?.length === 6}
                          onClick={addFlightGroup}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            width="1rem"
                            height="1rem"
                          >
                            <path d="M12 1.5A1.5 1.5 0 0 0 10.5 3v7.5H3a1.5 1.5 0 0 0 0 3h7.5V21a1.5 1.5 0 0 0 3 0v-7.5H21a1.5 1.5 0 0 0 0-3h-7.5V3A1.5 1.5 0 0 0 12 1.5"></path>
                          </svg>
                          {t("upperSection.add_flight")}
                        </button>
                      </div>

                      {/* Delete Button */}
                      <button
                        className="delete-button"
                        onClick={() => deleteFlightGroup(group.id)}
                      >
                        <svg
                          fill="none"
                          height="21"
                          viewBox="0 0 20 21"
                          width="20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g fill="rgb(0,0,0)">
                            <path
                              clipRule="evenodd"
                              d="m2.34257 9.12495c-.1593-1.06727-.23894-1.6009.06025-1.94807.2992-.34717.83874-.34717 1.91783-.34717h11.35865c1.0791 0 1.6187 0 1.9179.34717s.2195.8808.0602 1.94807l-.8941 5.99045c-.3641 2.4396-.5461 3.6593-1.3903 4.3868-.8441.7275-2.0774.7275-4.5439.7275h-1.65817c-2.46655 0-3.69983 0-4.54397-.7275-.84413-.7275-1.02618-1.9472-1.39029-4.3868zm6.65743 1.85475c0-.4142-.33579-.75-.75-.75s-.75.3358-.75.75v4.5c0 .4142.33579.75.75.75s.75-.3358.75-.75zm3.5 0c0-.4142-.3358-.75-.75-.75s-.75.3358-.75.75v4.5c0 .4142.3358.75.75.75s.75-.3358.75-.75z"
                              fillRule="evenodd"
                            />
                            <path d="m2 4.22974c0-.55229.44772-1 1-1h.74342c.51481 0 .77222 0 .9836-.10586.09573-.04794.18313-.11094.25888-.18659.16727-.16706.24867-.41125.41147-.89965l.14678-.44036c.22001-.660018.33001-.990028.5919-1.178786s.60975-.188758 1.30547-.188758h5.11698c.6957 0 1.0436 0 1.3055.188758.2618.188758.3718.518768.5918 1.178786l.1468.44036c.1628.4884.2442.73259.4115.89965.0757.07565.1632.13865.2589.18659.2114.10586.4688.10586.9836.10586h.7434c.5523 0 1 .44771 1 1 0 .55228-.4477 1-1 1h-14c-.55228 0-1-.44772-1-1z" />
                          </g>
                        </svg>
                      </button>
                    </div>
                  );
                })}

                {/* <div className="add-flight-btn-box">
                  <button
                    disabled={flightGroups?.length === 6}
                    onClick={addFlightGroup}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      width="1rem"
                      height="1rem"
                    >
                      <path d="M12 1.5A1.5 1.5 0 0 0 10.5 3v7.5H3a1.5 1.5 0 0 0 0 3h7.5V21a1.5 1.5 0 0 0 3 0v-7.5H21a1.5 1.5 0 0 0 0-3h-7.5V3A1.5 1.5 0 0 0 12 1.5"></path>
                    </svg>
                    Add another flight
                  </button>
                </div> */}
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Tab1;
