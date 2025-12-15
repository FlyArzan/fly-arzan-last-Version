import { router } from "./Routes/Routes";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TanstackQueryProvider from "./providers/tanstack-query-prover";
import { RegionalSettingsProvider } from "./context/RegionalSettingsContext";
import { WebSocketProvider } from "./providers/WebSocketProvider";

function App() {
  return (
    <TanstackQueryProvider>
      <RegionalSettingsProvider>
        <WebSocketProvider>
          <RouterProvider router={router} />
          <ToastContainer />
        </WebSocketProvider>
      </RegionalSettingsProvider>
    </TanstackQueryProvider>
  );
}

export default App;
