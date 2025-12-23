import { useState, useLayoutEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useSession } from "@/lib/auth-client";

/**
 * UserAuthGuard - Protects user dashboard routes
 *
 * Uses better-auth client for faster session checks.
 * - If not authenticated → redirect to /Login
 * - If admin/super role → redirect to /admin
 * - Otherwise → render children
 */
const UserAuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: session, isPending } = useSession();
  const [checked, setChecked] = useState(false);

  const user = session?.user;
  const isAdmin = user && (user.role === "admin" || user.role === "super");

  // Perform redirect check
  useLayoutEffect(() => {
    // Wait for session to load
    if (isPending) return;

    // Not authenticated - redirect to login
    if (!user) {
      navigate("/Login", {
        replace: true,
        state: {
          from: location.pathname,
          message: "Please login to access your dashboard",
        },
      });
      return;
    }

    // Admin/super users should go to /admin
    if (isAdmin) {
      navigate("/admin", { replace: true });
      return;
    }

    // Regular user - allow access
    setChecked(true);
  }, [user, isAdmin, isPending, navigate, location.pathname]);

  // Loading state - show minimal UI to prevent flash
  if (isPending || !checked) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          bgcolor: "#f5f5f5",
          gap: 2,
        }}
      >
        <CircularProgress sx={{ color: "#667eea" }} />
        <Typography sx={{ color: "#666", fontSize: 14 }}>Loading...</Typography>
      </Box>
    );
  }

  // Authenticated regular user - render children
  return children;
};

export default UserAuthGuard;
