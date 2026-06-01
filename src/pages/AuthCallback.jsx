import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useSession } from "@/hooks/useAuth";
import FullPageLoader from "@/components/ui/FullPageLoader";

/**
 * Post-OAuth landing page.
 *
 * Google sign-in (and any social provider) redirects here after the backend
 * completes the OAuth flow. We can't know the user's role at sign-in time, so
 * we resolve it here: admins/super go to the admin panel, everyone else to the
 * user dashboard. If the session somehow didn't establish, fall back to login.
 */
const AuthCallback = () => {
  const navigate = useNavigate();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;

    const user = session?.user;
    if (!user) {
      navigate("/Login?error=google_auth_failed", { replace: true });
      return;
    }

    const isAdmin = user.role === "admin" || user.role === "super";
    navigate(isAdmin ? "/admin" : "/dashboard", { replace: true });
  }, [session, isPending, navigate]);

  return (
    <>
      <Helmet>
        <title>Signing you in… | FlyArzan</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <FullPageLoader message="Signing you in…" />
    </>
  );
};

export default AuthCallback;
