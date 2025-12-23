import { router } from "./Routes/Routes";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TanstackQueryProvider from "./providers/tanstack-query-prover";
import { RegionalSettingsProvider } from "./context/RegionalSettingsContext";
import { WebSocketProvider } from "./providers/WebSocketProvider";
import CookieConsent from "./components/ui/cookie-consent/CookieConsent";
import TravelAgencySchema from "./components/Schemas/TravelAgencySchema";

function InitialLoader() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)",
      }}
    >
      <img
        src="/logo.svg"
        alt="FlyArzan"
        style={{ width: "120px", marginBottom: "24px" }}
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "3px solid #e0e0e0",
          borderTopColor: "#3b82f6",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

function App() {
  return (
    <TanstackQueryProvider>
      <RegionalSettingsProvider>
        <WebSocketProvider>
          <TravelAgencySchema />
          <RouterProvider router={router} fallbackElement={<InitialLoader />} />
          <ToastContainer />
          <CookieConsent />
        </WebSocketProvider>
      </RegionalSettingsProvider>
    </TanstackQueryProvider>
  );
}

export default App;
