import { createContext, useContext } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useSession } from "@/hooks/useAuth";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  const ws = useWebSocket(isAuthenticated);

  return (
    <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>
  );
};

export const useWS = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWS must be used within a WebSocketProvider");
  }
  return context;
};

export default WebSocketProvider;
