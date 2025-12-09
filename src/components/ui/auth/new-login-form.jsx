import { DialogTitle } from "@headlessui/react";
import { Checkbox } from "../checkbox";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa6";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInSchema } from "@/schema/authSchema";
import { useSignIn, signInWithGoogle } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import ForgotPasswordForm from "./forgot-password-form";

const NewLoginForm = ({ onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true); // Default to true

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signInSchema),
  });

  const signInMutation = useSignIn();
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

  const onSubmit = (data) => {
    // Include rememberMe in the credentials
    signInMutation.mutate(
      { ...data, rememberMe },
      {
        onSuccess: (response) => {
          // Use confirmedUser from session polling, fallback to response.user
          const user = response?.confirmedUser || response?.user;

          if (user) {
            toast.success("Login successful! Redirecting...");
            setIsRedirecting(true);

            // Close modal if callback provided
            if (onSuccess) onSuccess();

            // Determine redirect path based on confirmed user role
            const redirectPath =
              user.role === "admin" || user.role === "super"
                ? "/admin"
                : "/dashboard";

            // Small delay to ensure UI updates, then redirect
            setTimeout(() => {
              window.location.href = redirectPath;
            }, 100);
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

  const isLoading = isSubmitting || signInMutation.isPending || isRedirecting;

  // Show full-screen loader when redirecting
  if (isRedirecting) {
    return (
      <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-12 tw:gap-4">
        <Loader2 className="tw:w-10 tw:h-10 tw:animate-spin tw:text-dark-purple" />
        <p className="tw:text-secondary tw:text-center">
          Login successful! Redirecting to your dashboard...
        </p>
      </div>
    );
  }

  // Show forgot password form
  if (showForgotPassword) {
    return <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />;
  }

  return (
    <>
      <div className="tw:mb-4">
        <DialogTitle className="tw:md:text-lg tw:!text-dark-purple tw:font-medium tw:!mb-2">
          Sign in
        </DialogTitle>
        <p className="tw:text-secondary">Enter your information</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset
          className="tw:flex tw:flex-col tw:gap-1.5 tw:md:gap-2"
          disabled={isLoading}
        >
          <div className="tw:flex tw:flex-col">
            <label className="tw:font-medium">Email</label>
            <input
              {...register("email")}
              placeholder="Enter your email"
              className={`input ${errors.email ? "tw:border-red-500" : ""}`}
            />
            {errors.email && (
              <span className="tw:text-red-500 tw:text-sm tw:mt-1">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="tw:flex tw:flex-col tw:mb-1 tw:md:mb-3">
            <label className="tw:font-medium">Password</label>
            <div className="tw:relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`input tw:w-full tw:pr-12 ${
                  errors.password ? "tw:border-red-500" : ""
                }`}
              />
              <button
                type="button"
                className="tw:absolute tw:right-3 tw:top-2.5 tw:!text-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <span className="tw:text-red-500 tw:text-sm tw:mt-1">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="tw:flex tw:items-center tw:gap-2 tw:justify-between">
            <div className="tw:flex tw:gap-2 tw:items-center">
              <Checkbox
                className="tw:!mb-0.5"
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked)}
              />
              <label className="tw:text-sm tw:!mb-0" htmlFor="rememberMe">
                Remember Me
              </label>
            </div>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="tw:text-sm tw:text-primary tw:hover:underline tw:bg-transparent tw:border-none tw:cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="tw:!mt-1 tw:md:!mt-3 tw:px-3 tw:py-2 tw:bg-dark-purple tw:hover:bg-dark-purple/80 tw:!text-white tw:!rounded tw:disabled:opacity-50 tw:disabled:cursor-not-allowed tw:flex tw:items-center tw:justify-center tw:gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="tw:w-4 tw:h-4 tw:animate-spin" />
                {signInMutation.isPending
                  ? "Verifying session..."
                  : "Signing in..."}
              </>
            ) : (
              "Login"
            )}
          </button>

          <div className="tw:relative tw:py-1 tw:md:py-3 tw:text-center tw:text-sm tw:after:absolute tw:after:inset-0 tw:after:top-1/2 tw:after:z-0 tw:after:flex tw:after:items-center tw:after:border-t tw:after:border-muted">
            <span className="tw:relative tw:z-10 tw:bg-white tw:px-2 tw:text-secondary tw:select-none">
              Or Continue with
            </span>
          </div>

          <div className="tw:grid tw:grid-cols-2 tw:gap-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="tw:justify-center tw:flex tw:items-center tw:gap-2 tw:px-3 tw:py-2 tw:!rounded tw:shadow tw:border tw:border-muted tw:disabled:opacity-50 tw:disabled:cursor-not-allowed"
            >
              {isGoogleLoading ? (
                <Loader2 className="tw:w-5 tw:h-5 tw:animate-spin" />
              ) : (
                <FcGoogle size={20} />
              )}
              <span>Google</span>
            </button>
            <button
              type="button"
              className="tw:justify-center tw:flex tw:items-center tw:gap-2 tw:px-3 tw:py-2 tw:!rounded tw:shadow tw:border tw:border-muted"
            >
              <FaApple size={20} />
              <span>Apple</span>
            </button>
          </div>
        </fieldset>
      </form>
    </>
  );
};

export default NewLoginForm;
