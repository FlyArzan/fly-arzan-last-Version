import { useState, useLayoutEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useSession } from "@/lib/auth-client";

/**
 * AdminAuthGuard - Protects admin routes
 *
 * Uses better-auth client for faster session checks.
 * - If not authenticated → redirect to /Login
 * - If not admin/super → redirect to /dashboard
 * - Otherwise → render children
 */
const AdminAuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: session, isPending } = useSession();
  const [checked, setChecked] = useState(false);

  const user = session?.user;
  const isAdmin = user && (user.role === "admin" || user.role === "super");

  // Add dark background to body immediately to prevent white flash
  useLayoutEffect(() => {
    document.body.classList.add("admin-loading");
    document.body.style.backgroundColor = "#0B0F16";

    return () => {
      document.body.classList.remove("admin-loading");
      document.body.style.backgroundColor = "";
    };
  }, []);

  // Perform redirect check synchronously before paint
  useLayoutEffect(() => {
    // Wait for session to load
    if (isPending) return;

    // Not authenticated - redirect to login
    if (!user) {
      navigate("/Login", {
        replace: true,
        state: {
          from: location.pathname,
          message: "Please login to access admin panel",
        },
      });
      return;
    }

    // Authenticated but not admin - redirect to user dashboard
    if (!isAdmin) {
      navigate("/dashboard", {
        replace: true,
        state: { message: "You don't have permission to access admin panel" },
      });
      return;
    }

    // Admin user - allow access
    setChecked(true);
  }, [user, isAdmin, isPending, navigate, location.pathname]);

  // Loading state - show immediately with dark background
  if (isPending || !checked) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          bgcolor: "#0B0F16",
          gap: 3,
        }}
      >
        <CircularProgress
          size={48}
          sx={{
            color: "#3B82F6",
          }}
        />
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h6"
            sx={{
              color: "#FFFFFF",
              fontWeight: 500,
              fontFamily: "Inter",
              mb: 1,
            }}
          >
            Loading Admin Panel
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#71717A",
              fontFamily: "Inter",
            }}
          >
            Verifying your credentials...
          </Typography>
        </Box>
      </Box>
    );
  }

  // Authenticated and is admin - render children
  return children;
};

export default AdminAuthGuard;
