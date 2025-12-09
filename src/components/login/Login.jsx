import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/Images/loginlogo.png";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { loginSchema, registrationSchema } from "../Schemas/Schemas";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSignIn, useSignUp, signInWithGoogle } from "@/hooks/useAuth";
import { toast } from "react-toastify";

const Login = ({ setShowPopup }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [rememberMe, setRememberMe] = useState(true); // Default to true

  const signInMutation = useSignIn();
  const signUpMutation = useSignUp();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle("/dashboard");
    } catch (error) {
      toast.error(error.message || "Google sign in failed");
      setIsGoogleLoading(false);
    }
  };

  const loading =
    signInMutation.isPending || signUpMutation.isPending || isRedirecting;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(!isSignup ? loginSchema : registrationSchema),
  });
  const { t } = useTranslation();

  const onSubmit = async (data) => {
    console.log("Form submitted with data:", data);
    try {
      if (isSignup) {
        console.log("Attempting signup...");
        await signUpMutation.mutateAsync({
          name: data.email.split("@")[0],
          email: data.email,
          password: data.password,
        });
        toast.success("Account created successfully!");
        setIsSignup(false);
      } else {
        console.log("Attempting login...");
        const response = await signInMutation.mutateAsync({
          email: data.email,
          password: data.password,
          rememberMe, // Pass rememberMe option
        });
        console.log("Login response:", response);

        // Use confirmedUser from session polling, fallback to response.user
        const user = response?.confirmedUser || response?.user;

        if (user) {
          toast.success("Login successful! Redirecting...");
          setIsRedirecting(true);

          // Determine redirect path based on confirmed user role
          const redirectPath =
            user.role === "admin" || user.role === "super"
              ? "/admin"
              : "/dashboard";

          if (setShowPopup) {
            setShowPopup(false);
          }

          // Small delay to ensure UI updates, then redirect
          setTimeout(() => {
            window.location.href = redirectPath;
          }, 100);
        } else {
          toast.error("Login failed - no user in response");
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      toast.error(err.message || "Authentication failed");
    }
  };

  // Show full-screen loader when redirecting
  if (isRedirecting) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          gap: "20px",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            border: "4px solid #e5e7eb",
            borderTopColor: "#50add8",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <p
          style={{
            color: "#6b7280",
            fontSize: "16px",
            fontFamily: "Rubik, sans-serif",
          }}
        >
          Login successful! Redirecting to your dashboard...
        </p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        padding: "24px 16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
          padding: "40px 32px",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Link to="/">
            <img
              src={logo}
              alt="FlyArzan"
              style={{ height: "40px", objectFit: "contain" }}
            />
          </Link>
        </div>

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "#1f2937",
              marginBottom: "8px",
              fontFamily: "Rubik, sans-serif",
            }}
          >
            {isSignup ? t(`Logsec.heading1`) : t(`Logsec.heading`)}
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#6b7280",
              fontFamily: "Rubik, sans-serif",
            }}
          >
            {isSignup ? t(`Logsec.para1`) : t(`Logsec.para`)}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email Field */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "8px",
                fontFamily: "Rubik, sans-serif",
              }}
            >
              {t(`Logsec.label1`)}
            </label>
            <input
              type="email"
              placeholder="info@example.com"
              {...register("email")}
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: "14px",
                border: errors.email
                  ? "1px solid #ef4444"
                  : "1px solid #d1d5db",
                borderRadius: "8px",
                outline: "none",
                transition: "border-color 0.2s",
                fontFamily: "Rubik, sans-serif",
                boxSizing: "border-box",
              }}
            />
            {errors.email && (
              <p
                style={{
                  color: "#ef4444",
                  fontSize: "12px",
                  marginTop: "4px",
                  fontFamily: "Rubik, sans-serif",
                }}
              >
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "8px",
                fontFamily: "Rubik, sans-serif",
              }}
            >
              {t(`Logsec.label2`)}
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              {...register("password")}
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: "14px",
                border: errors.password
                  ? "1px solid #ef4444"
                  : "1px solid #d1d5db",
                borderRadius: "8px",
                outline: "none",
                transition: "border-color 0.2s",
                fontFamily: "Rubik, sans-serif",
                boxSizing: "border-box",
              }}
            />
            {errors.password && (
              <p
                style={{
                  color: "#ef4444",
                  fontSize: "12px",
                  marginTop: "4px",
                  fontFamily: "Rubik, sans-serif",
                }}
              >
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password (Signup only) */}
          {isSignup && (
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "8px",
                  fontFamily: "Rubik, sans-serif",
                }}
              >
                {t(`Logsec.label10`)}
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                {...register("confirmPassword")}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  fontSize: "14px",
                  border: errors.confirmPassword
                    ? "1px solid #ef4444"
                    : "1px solid #d1d5db",
                  borderRadius: "8px",
                  outline: "none",
                  transition: "border-color 0.2s",
                  fontFamily: "Rubik, sans-serif",
                  boxSizing: "border-box",
                }}
              />
              {errors.confirmPassword && (
                <p
                  style={{
                    color: "#ef4444",
                    fontSize: "12px",
                    marginTop: "4px",
                    fontFamily: "Rubik, sans-serif",
                  }}
                >
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          )}

          {/* Remember Me & Forgot Password (Login only) */}
          {!isSignup && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  color: "#4b5563",
                  cursor: "pointer",
                  fontFamily: "Rubik, sans-serif",
                }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ width: "16px", height: "16px", cursor: "pointer" }}
                />
                {t(`Logsec.label3`)}
              </label>
              <a
                href="#"
                style={{
                  fontSize: "14px",
                  color: "#50add8",
                  textDecoration: "none",
                  fontFamily: "Rubik, sans-serif",
                }}
              >
                {t(`Logsec.label4`)}
              </a>
            </div>
          )}

          {/* Terms (Signup only) */}
          {isSignup && (
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                  fontSize: "13px",
                  color: "#4b5563",
                  cursor: "pointer",
                  fontFamily: "Rubik, sans-serif",
                }}
              >
                <input
                  type="checkbox"
                  {...register("terms")}
                  style={{
                    width: "16px",
                    height: "16px",
                    cursor: "pointer",
                    marginTop: "2px",
                  }}
                />
                <span>
                  {t(`Logsec.label11`)}{" "}
                  <a href="#" style={{ color: "#50add8" }}>
                    {t(`Logsec.label12`)}
                  </a>{" "}
                  {t(`Logsec.label13`)}{" "}
                  <a href="#" style={{ color: "#50add8" }}>
                    {t(`Logsec.label14`)}
                  </a>
                </span>
              </label>
              {errors.terms && (
                <p
                  style={{
                    color: "#ef4444",
                    fontSize: "12px",
                    marginTop: "4px",
                    fontFamily: "Rubik, sans-serif",
                  }}
                >
                  {errors.terms.message}
                </p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "16px",
              fontWeight: "500",
              color: "#ffffff",
              background: loading ? "#93c5fd" : "#50add8",
              border: "none",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
              fontFamily: "Rubik, sans-serif",
              marginBottom: "24px",
            }}
          >
            {loading
              ? isSignup
                ? t(`Logsec.btn5`)
                : t(`Logsec.btn3`)
              : isSignup
              ? t(`Logsec.btn2`)
              : t(`Logsec.btn1`)}
          </button>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
            <span
              style={{
                fontSize: "14px",
                color: "#9ca3af",
                fontFamily: "Rubik, sans-serif",
              }}
            >
              {t(`Logsec.label5`)}
            </span>
            <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
          </div>

          {/* Social Buttons */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                background: "#ffffff",
                cursor: isGoogleLoading ? "not-allowed" : "pointer",
                fontSize: "14px",
                fontFamily: "Rubik, sans-serif",
                color: "#374151",
                opacity: isGoogleLoading ? 0.5 : 1,
              }}
            >
              <FcGoogle size={20} />
              {isGoogleLoading ? "Signing in..." : "Google"}
            </button>
            <button
              type="button"
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                background: "#ffffff",
                cursor: "pointer",
                fontSize: "14px",
                fontFamily: "Rubik, sans-serif",
                color: "#374151",
              }}
            >
              <FaApple size={20} />
              Apple
            </button>
          </div>

          {/* Switch Form Link */}
          <p
            style={{
              textAlign: "center",
              fontSize: "14px",
              color: "#6b7280",
              fontFamily: "Rubik, sans-serif",
            }}
          >
            {isSignup ? t(`Logsec.label15`) : t(`Logsec.label7`)}
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              style={{
                background: "none",
                border: "none",
                color: "#50add8",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "14px",
                fontFamily: "Rubik, sans-serif",
                marginLeft: "4px",
              }}
            >
              {isSignup ? "Log in" : "Sign Up"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
