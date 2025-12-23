import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "antd/dist/reset.css"; // ya 'antd/dist/antd.css'

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

import { Provider } from "react-redux";
import { store } from "./Redux/store.js";
import { CarProvider } from "./context/CarContext.jsx";
import { HotelProvider } from "./context/HotelContext.jsx";
import { FlightProvider } from "./context/FlightContext.jsx";
import { HelmetProvider } from 'react-helmet-async';
import "./i18n"; // import here!

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <HelmetProvider>
    <CarProvider>
      <HotelProvider>
        <FlightProvider>
          <Provider store={store}>
            <App />
          </Provider>
        </FlightProvider>
      </HotelProvider>
    </CarProvider>
  </HelmetProvider>
  // {/* // </StrictMode/> */}
);
