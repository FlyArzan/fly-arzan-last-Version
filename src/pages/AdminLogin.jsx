import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSignIn, useForgotPassword } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { Loader2, Eye, EyeOff, Shield, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import logo from "../assets/Images/loginlogo.png";

const adminLoginSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
});

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(adminLoginSchema),
  });

  const signInMutation = useSignIn();
  const forgotPasswordMutation = useForgotPassword();

  const {
    register: registerForgot,
    handleSubmit: handleForgotSubmit,
    formState: { errors: forgotErrors },
    reset: resetForgotForm,
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onForgotSubmit = (data) => {
    forgotPasswordMutation.mutate(
      { email: data.email },
      {
        onSuccess: () => {
          setSentEmail(data.email);
          setEmailSent(true);
          toast.success("Password reset email sent!");
        },
        onError: () => {
          setSentEmail(data.email);
          setEmailSent(true);
          toast.success("If an account exists, a reset email has been sent.");
        },
      }
    );
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setEmailSent(false);
    setSentEmail("");
    resetForgotForm();
  };

  const onSubmit = (data) => {
    signInMutation.mutate(
      { ...data, rememberMe },
      {
        onSuccess: (response) => {
          const user = response?.confirmedUser || response?.user;

          if (user) {
            // Check if user has admin role
            if (user.role === "admin" || user.role === "super") {
              toast.success("Admin login successful! Redirecting...");
              setIsRedirecting(true);
              setTimeout(() => {
                window.location.href = "/admin";
              }, 100);
            } else {
              // Not an admin - show error and don't redirect
              toast.error("Access denied. Admin privileges required.");
            }
          } else {
            toast.error("Login failed. Please try again.");
          }
        },
        onError: (error) => {
          toast.error(error.message || "Login failed. Please try again.");
        },
      }
    );
  };

  const isLoading = signInMutation.isPending || isRedirecting;

  // Show loader when redirecting
  if (isRedirecting) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
          gap: "20px",
        }}
      >
        <Loader2
          size={48}
          style={{ animation: "spin 1s linear infinite", color: "#fff" }}
        />
        <p style={{ color: "#fff", fontSize: "16px" }}>
          Redirecting to admin dashboard...
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
        background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
        padding: "24px 16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2)",
          padding: "40px 32px",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Link to="/">
            <img
              src={logo}
              alt="Fly Arzan"
              style={{ height: "40px", objectFit: "contain" }}
            />
          </Link>
        </div>

        {/* Forgot Password View */}
        {showForgotPassword ? (
          <>
            {emailSent ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "#dcfce7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  <CheckCircle size={32} color="#16a34a" />
                </div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#111827",
                    marginBottom: "8px",
                  }}
                >
                  Check your email
                </h3>
                <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
                  We sent a password reset link to
                </p>
                <p style={{ fontSize: "14px", fontWeight: "500", color: "#111827", marginBottom: "24px" }}>
                  {sentEmail}
                </p>
                <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "24px" }}>
                  Didn&apos;t receive the email? Check your spam folder or{" "}
                  <button
                    type="button"
                    onClick={() => setEmailSent(false)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#667eea",
                      cursor: "pointer",
                      padding: 0,
                      fontSize: "12px",
                    }}
                  >
                    try again
                  </button>
                </p>
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    margin: "0 auto",
                    background: "none",
                    border: "none",
                    fontSize: "14px",
                    color: "#6b7280",
                    cursor: "pointer",
                  }}
                >
                  <ArrowLeft size={16} />
                  Back to login
                </button>
              </div>
            ) : (
              <>
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      background: "rgba(102, 126, 234, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                    }}
                  >
                    <Mail size={28} color="#667eea" />
                  </div>
                  <h2
                    style={{
                      fontSize: "20px",
                      fontWeight: "600",
                      color: "#111827",
                      marginBottom: "8px",
                    }}
                  >
                    Forgot your password?
                  </h2>
                  <p style={{ fontSize: "14px", color: "#6b7280" }}>
                    No worries, we&apos;ll send you reset instructions.
                  </p>
                </div>

                <form onSubmit={handleForgotSubmit(onForgotSubmit)}>
                  <fieldset
                    disabled={forgotPasswordMutation.isPending}
                    style={{ border: "none", padding: 0, margin: 0 }}
                  >
                    <div style={{ marginBottom: "16px" }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#374151",
                          marginBottom: "6px",
                        }}
                      >
                        Email Address
                      </label>
                      <input
                        {...registerForgot("email")}
                        type="email"
                        autoComplete="off"
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: forgotErrors.email
                            ? "1px solid #ef4444"
                            : "1px solid #e5e7eb",
                          borderRadius: "8px",
                          fontSize: "14px",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                      {forgotErrors.email && (
                        <span
                          style={{
                            color: "#ef4444",
                            fontSize: "12px",
                            marginTop: "4px",
                          }}
                        >
                          {forgotErrors.email.message}
                        </span>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={forgotPasswordMutation.isPending}
                      style={{
                        width: "100%",
                        padding: "12px 24px",
                        background: forgotPasswordMutation.isPending
                          ? "#9ca3af"
                          : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "#fff",
                        borderRadius: "8px",
                        border: "none",
                        fontWeight: "500",
                        fontSize: "16px",
                        cursor: forgotPasswordMutation.isPending ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        marginBottom: "16px",
                      }}
                    >
                      {forgotPasswordMutation.isPending ? (
                        <>
                          <Loader2
                            size={18}
                            style={{ animation: "spin 1s linear infinite" }}
                          />
                          Sending...
                        </>
                      ) : (
                        "Send reset link"
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleBackToLogin}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        width: "100%",
                        background: "none",
                        border: "none",
                        fontSize: "14px",
                        color: "#6b7280",
                        cursor: "pointer",
                      }}
                    >
                      <ArrowLeft size={16} />
                      Back to login
                    </button>
                  </fieldset>
                </form>
              </>
            )}
          </>
        ) : (
          <>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <Shield size={28} color="#fff" />
              </div>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  color: "#111827",
                  marginBottom: "8px",
                }}
              >
                Admin Portal
              </h2>
              <p style={{ fontSize: "14px", color: "#6b7280" }}>
                Sign in to access the admin dashboard
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset
            disabled={isLoading}
            style={{ border: "none", padding: 0, margin: 0 }}
          >
            {/* Email */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                autoComplete="off"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: errors.email
                    ? "1px solid #ef4444"
                    : "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              {errors.email && (
                <span
                  style={{
                    color: "#ef4444",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}
                >
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="off"
                  style={{
                    width: "100%",
                    padding: "12px 48px 12px 16px",
                    border: errors.password
                      ? "1px solid #ef4444"
                      : "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9ca3af",
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <span
                  style={{
                    color: "#ef4444",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}
                >
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ width: "16px", height: "16px", cursor: "pointer" }}
              />
              <label
                htmlFor="rememberMe"
                style={{
                  fontSize: "14px",
                  color: "#4b5563",
                  cursor: "pointer",
                }}
              >
                Remember me
              </label>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "14px",
                  color: "#667eea",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "12px 24px",
                background: isLoading
                  ? "#9ca3af"
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#fff",
                borderRadius: "8px",
                border: "none",
                fontWeight: "500",
                fontSize: "16px",
                cursor: isLoading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {isLoading ? (
                <>
                  <Loader2
                    size={18}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                  Signing in...
                </>
              ) : (
                "Sign in to Admin"
              )}
            </button>
          </fieldset>
        </form>

            {/* Back to home */}
            <div style={{ textAlign: "center", marginTop: "24px" }}>
              <Link
                to="/"
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  textDecoration: "none",
                }}
              >
                ← Back to home
              </Link>
            </div>
          </>
        )}

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default AdminLogin;
