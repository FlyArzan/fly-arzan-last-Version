import { useState, useLayoutEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession } from "@/lib/auth-client";
import FullPageLoader from "@/components/ui/FullPageLoader";

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

  // Loading state — shared loader keeps the whole login→dashboard chain seamless
  if (isPending || !checked) {
    return <FullPageLoader />;
  }

  // Authenticated regular user - render children
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {children}
    </>
  );
};

export default UserAuthGuard;
