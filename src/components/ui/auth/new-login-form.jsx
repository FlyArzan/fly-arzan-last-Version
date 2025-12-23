import { DialogTitle } from "@headlessui/react";
import { Checkbox } from "../checkbox";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa6";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInSchema } from "@/schema/authSchema";
import { useSignIn } from "@/hooks/useAuth";
import { toast } from "sonner";

const NewLoginForm = ({ onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signInSchema),
  });

  const signInMutation = useSignIn();

  const onSubmit = (data) => {
    signInMutation.mutate(data, {
      onSuccess: (response) => {
        console.log("Login response:", response);
        // better-auth returns { user, session } structure
        const user = response?.user;
        if (user) {
          toast.success("Login successful!");
          // Close modal if callback provided
          if (onSuccess) onSuccess();
          // Navigate based on role (only super can access admin)
          console.log("User role:", user.role);
          const isSuperAdmin = user.role === "super";
          if (isSuperAdmin) {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }
        } else {
          toast.error("Login failed. Please try again.");
        }
      },
      onError: (error) => {
        toast.error(error.message || "Login failed. Please try again.");
      },
    });
  };

  return (
    <>
      <div className="tw:mb-4">
        <DialogTitle className="tw:md:text-lg tw:!text-dark-purple tw:font-medium tw:!mb-2">
          Sign in
        </DialogTitle>
        <p className="tw:text-secondary">Enter your information</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="tw:flex tw:flex-col tw:gap-1.5 tw:md:gap-2">
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
              <Checkbox className="tw:!mb-0.5" id="rememberMe" />
              <label className="tw:text-sm tw:!mb-0" htmlFor="rememberMe">
                Remember Me
              </label>
            </div>
            <Link className="tw:text-sm tw:!text-inherit tw:!no-underline tw:hover:!underline">
              Forgot Password
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || signInMutation.isPending}
            className="tw:!mt-1 tw:md:!mt-3 tw:px-3 tw:py-2 tw:bg-dark-purple tw:hover:bg-dark-purple/80 tw:!text-white tw:!rounded tw:disabled:opacity-50 tw:disabled:cursor-not-allowed"
          >
            {isSubmitting || signInMutation.isPending
              ? "Signing in..."
              : "Login"}
          </button>

          <div className="tw:relative tw:py-1 tw:md:py-3 tw:text-center tw:text-sm tw:after:absolute tw:after:inset-0 tw:after:top-1/2 tw:after:z-0 tw:after:flex tw:after:items-center tw:after:border-t tw:after:border-muted">
            <span className="tw:relative tw:z-10 tw:bg-white tw:px-2 tw:text-secondary tw:select-none">
              Or Continue with
            </span>
          </div>

          <div className="tw:grid tw:grid-cols-2 tw:gap-4">
            <button className="tw:justify-center tw:flex tw:items-center tw:gap-2 tw:px-3 tw:py-2 tw:!rounded tw:shadow tw:border tw:border-muted">
              <FcGoogle size={20} />
              <span>Google</span>
            </button>
            <button className="tw:justify-center tw:flex tw:items-center tw:gap-2 tw:px-3 tw:py-2 tw:!rounded tw:shadow tw:border tw:border-muted">
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
