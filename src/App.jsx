import Routes from "./Routes/Routes";
import Scroll from "./ScrollToTop/Scroll";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TanstackQueryProvider from "./providers/tanstack-query-prover";
import { RegionalSettingsProvider } from "./context/RegionalSettingsContext";
import { WebSocketProvider } from "./providers/WebSocketProvider";

function App() {
  // const { setUserLocation } = useLocationContext();
  // const selectedLocalCoun = JSON.parse(localStorage.getItem("selectCountry"));

  // useEffect(() => {
  //   const fetchLocation = async () => {
  //     try {
  //       const response = await fetch(
  //         `https://api.ipapi.com/api/check?access_key=${LOCATION_API_KEY}`
  //       );
  //       const data = await response.json();

  //       setUserLocation({
  //         country_name: selectedLocalCoun?.country
  //           ? selectedLocalCoun?.country
  //           : data?.country_name, // <<<<< actual user country ,
  //         city: selectedLocalCoun?.city ? selectedLocalCoun?.city : data?.city,
  //         userCountry: data?.country_name,
  //         userCity: data?.city,
  //         curr: data?.currency?.code,
  //         symbol: getSymbolFromCurrency(data?.currency?.code),
  //       });
  //     } catch (error) {
  //       console.error("Error fetching location:", error);
  //     }
  //   };

  //   fetchLocation();
  // }, []);

  return (
    <TanstackQueryProvider>
      <RegionalSettingsProvider>
        <BrowserRouter>
          <WebSocketProvider>
            <Scroll />
            <Routes />
            <ToastContainer />
          </WebSocketProvider>
        </BrowserRouter>
      </RegionalSettingsProvider>
    </TanstackQueryProvider>
  );
}

export default App;
