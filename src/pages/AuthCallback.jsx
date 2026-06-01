import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Loader2 } from "lucide-react";
import { useSession } from "@/hooks/useAuth";

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
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
        }}
      >
        <Loader2
          size={40}
          style={{ animation: "spin 1s linear infinite", color: "#312e81" }}
        />
        <p style={{ color: "#6b7280", fontSize: "15px" }}>Signing you in…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </>
  );
};

export default AuthCallback;
