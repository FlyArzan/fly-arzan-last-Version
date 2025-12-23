import { DialogTitle } from "@headlessui/react";
import { Checkbox } from "../checkbox";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa6";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUpSchema } from "@/schema/authSchema";
import { useSignUp, signInWithGoogle } from "@/hooks/useAuth";
import { toast } from "sonner";

const NewRegisterForm = ({ onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      terms: false,
    },
  });

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

  const onSubmit = (data) => {
    signUpMutation.mutate(data, {
      onSuccess: (response) => {
        if (response?.user) {
          toast.success("Registration successful! Please log in.");
          // Call onSuccess to switch to login form
          if (onSuccess) onSuccess();
        } else {
          toast.error("Registration failed. Please try again.");
        }
      },
      onError: (error) => {
        toast.error(error.message || "Registration failed. Please try again.");
      },
    });
  };

  return (
    <>
      <div className="tw:mb-4">
        <DialogTitle className="tw:md:text-lg tw:!text-dark-purple tw:font-medium tw:!mb-2">
          Sign Up
        </DialogTitle>
        <p className="tw:text-secondary">Enter your information</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="tw:flex tw:flex-col tw:gap-1.5 tw:md:gap-2">
          <div className="tw:flex tw:flex-col">
            <label className="tw:font-medium">Name</label>
            <input
              {...register("name")}
              placeholder="Enter your full name"
              className={`input ${errors.name ? "tw:border-red-500" : ""}`}
            />
            {errors.name && (
              <span className="tw:text-red-500 tw:text-sm tw:mt-1">
                {errors.name.message}
              </span>
            )}
          </div>

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

          <div className="tw:flex tw:flex-col">
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

          <div className="tw:flex tw:flex-col tw:gap-1">
            <div className="tw:flex tw:gap-2 tw:items-start">
              <Checkbox
                className="tw:mt-0.5"
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => {
                  setTermsAccepted(checked);
                  setValue("terms", checked, { shouldValidate: true });
                }}
              />
              <label className="tw:text-sm tw:leading-tight" htmlFor="terms">
                I agree to the platform&apos;s
                <Link
                  to="/PrivacyPolicy"
                  className="tw:text-primary tw:hover:underline"
                >
                  &nbsp;Terms of Service
                </Link>
                &nbsp;and&nbsp;
                <Link
                  to="/PrivacyPolicy"
                  className="tw:text-primary tw:hover:underline"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.terms && (
              <span className="tw:text-red-500 tw:text-xs">
                {errors.terms.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || signUpMutation.isPending}
            className="tw:!mt-1 tw:md:!mt-3 tw:px-3 tw:py-2 tw:bg-dark-purple tw:hover:bg-dark-purple/80 tw:!text-white tw:!rounded tw:disabled:opacity-50 tw:disabled:cursor-not-allowed"
          >
            {isSubmitting || signUpMutation.isPending
              ? "Creating Account..."
              : "Create Account"}
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

export default NewRegisterForm;
