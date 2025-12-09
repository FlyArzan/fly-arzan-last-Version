import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useResetPassword } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { Loader2, Eye, EyeOff, CheckCircle, XCircle, Lock } from "lucide-react";
import logo from "../assets/Images/loginlogo.png";

const resetPasswordSchema = yup.object({
  newPassword: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [tokenError, setTokenError] = useState(false);

  const token = searchParams.get("token");
  const error = searchParams.get("error");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const resetPasswordMutation = useResetPassword();

  // Check for token errors from URL
  useEffect(() => {
    if (error === "INVALID_TOKEN") {
      setTokenError(true);
    }
  }, [error]);

  const onSubmit = (data) => {
    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }

    resetPasswordMutation.mutate(
      { newPassword: data.newPassword, token },
      {
        onSuccess: () => {
          setResetSuccess(true);
          toast.success("Password reset successfully!");
        },
        onError: (err) => {
          toast.error(err.message || "Failed to reset password");
        },
      }
    );
  };

  const isLoading = resetPasswordMutation.isPending;

  // Token error state
  if (tokenError || (!token && !resetSuccess)) {
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
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "#fef2f2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <XCircle size={32} color="#dc2626" />
          </div>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#111827",
              marginBottom: "8px",
            }}
          >
            Invalid or Expired Link
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "#6b7280",
              marginBottom: "24px",
            }}
          >
            This password reset link is invalid or has expired. Please request a
            new one.
          </p>
          <Link
            to="/Login"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              background: "#667eea",
              color: "#fff",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  // Success state
  if (resetSuccess) {
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
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "#dcfce7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <CheckCircle size={32} color="#16a34a" />
          </div>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#111827",
              marginBottom: "8px",
            }}
          >
            Password Reset Successful
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "#6b7280",
              marginBottom: "24px",
            }}
          >
            Your password has been reset successfully. You can now log in with
            your new password.
          </p>
          <button
            onClick={() => navigate("/Login")}
            style={{
              width: "100%",
              padding: "12px 24px",
              background: "#667eea",
              color: "#fff",
              borderRadius: "8px",
              border: "none",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Reset password form
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
              alt="Fly Arzan"
              style={{ height: "40px", objectFit: "contain" }}
            />
          </Link>
        </div>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "rgba(102, 126, 234, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Lock size={24} color="#667eea" />
          </div>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#111827",
              marginBottom: "8px",
            }}
          >
            Set new password
          </h2>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            Your new password must be at least 8 characters long.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset
            disabled={isLoading}
            style={{ border: "none", padding: 0, margin: 0 }}
          >
            {/* New Password */}
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
                New Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  {...register("newPassword")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  style={{
                    width: "100%",
                    padding: "12px 48px 12px 16px",
                    border: errors.newPassword
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
              {errors.newPassword && (
                <span
                  style={{
                    color: "#ef4444",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}
                >
                  {errors.newPassword.message}
                </span>
              )}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Confirm Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  style={{
                    width: "100%",
                    padding: "12px 48px 12px 16px",
                    border: errors.confirmPassword
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <span
                  style={{
                    color: "#ef4444",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}
                >
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "12px 24px",
                background: isLoading ? "#9ca3af" : "#667eea",
                color: "#fff",
                borderRadius: "8px",
                border: "none",
                fontWeight: "500",
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
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </fieldset>
        </form>

        {/* Back to login link */}
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <Link
            to="/Login"
            style={{
              fontSize: "14px",
              color: "#6b7280",
              textDecoration: "none",
            }}
          >
            ← Back to login
          </Link>
        </div>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ResetPassword;
