import { useEffect, useRef, useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8787/ws";

// Reconnection settings
const INITIAL_RECONNECT_DELAY = 1000;
const MAX_RECONNECT_DELAY = 30000;
const RECONNECT_MULTIPLIER = 1.5;

/**
 * WebSocket hook for real-time notifications
 * Automatically connects when user is authenticated
 */
export const useWebSocket = (isAuthenticated = false) => {
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectDelayRef = useRef(INITIAL_RECONNECT_DELAY);
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  // Handle incoming WebSocket messages
  const handleMessage = useCallback(
    (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "connected":
            console.log("[WS] Connected:", data.message);
            break;

          case "notification":
            // Invalidate notification queries to refetch (list + unread count)
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            queryClient.invalidateQueries({
              queryKey: ["notifications", "unread-count"],
            });

            // Show toast for new notification
            if (data.payload) {
              const { title, type } = data.payload;
              const toastType =
                type === "warning"
                  ? "warning"
                  : type === "promo"
                  ? "info"
                  : "info";
              toast[toastType](title || "New notification", {
                position: "top-right",
                autoClose: 5000,
              });
            }
            break;

          case "pong":
            // Heartbeat response
            break;

          default:
            console.log("[WS] Unknown message type:", data.type);
        }
      } catch (error) {
        console.error("[WS] Failed to parse message:", error);
      }
    },
    [queryClient]
  );

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (!isAuthenticated) {
      return;
    }

    // Don't reconnect if already connected or connecting
    if (
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.OPEN ||
        wsRef.current.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    console.log("[WS] Connecting to", WS_URL);

    try {
      const ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        console.log("[WS] Connected");
        setIsConnected(true);
        reconnectDelayRef.current = INITIAL_RECONNECT_DELAY;
      };

      ws.onmessage = handleMessage;

      ws.onclose = (event) => {
        console.log("[WS] Disconnected:", event.code, event.reason);
        setIsConnected(false);
        wsRef.current = null;

        // Don't reconnect if closed intentionally (code 1000) or unauthorized (4001)
        if (event.code === 1000 || event.code === 4001) {
          return;
        }

        // Schedule reconnection with exponential backoff
        if (isAuthenticated) {
          const delay = reconnectDelayRef.current;
          console.log(`[WS] Reconnecting in ${delay}ms...`);

          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectDelayRef.current = Math.min(
              reconnectDelayRef.current * RECONNECT_MULTIPLIER,
              MAX_RECONNECT_DELAY
            );
            connect();
          }, delay);
        }
      };

      ws.onerror = (error) => {
        console.error("[WS] Error:", error);
      };

      wsRef.current = ws;
    } catch (error) {
      console.error("[WS] Failed to connect:", error);
    }
  }, [isAuthenticated, handleMessage]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close(1000, "User disconnected");
      wsRef.current = null;
    }

    setIsConnected(false);
  }, []);

  // Send message to server
  const send = useCallback((data) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
      return true;
    }
    return false;
  }, []);

  // Connect when authenticated, disconnect when not
  useEffect(() => {
    if (isAuthenticated) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isAuthenticated, connect, disconnect]);

  // Heartbeat - ping every 25 seconds to keep connection alive
  useEffect(() => {
    if (!isConnected) return;

    const pingInterval = setInterval(() => {
      send({ type: "ping" });
    }, 25000);

    return () => clearInterval(pingInterval);
  }, [isConnected, send]);

  return {
    isConnected,
    send,
    connect,
    disconnect,
  };
};

export default useWebSocket;
