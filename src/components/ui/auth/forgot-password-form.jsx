import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForgotPassword } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { Loader2, Mail, ArrowLeft, CheckCircle } from "lucide-react";

const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
});

const ForgotPasswordForm = ({ onBack }) => {
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const forgotPasswordMutation = useForgotPassword();

  const onSubmit = (data) => {
    forgotPasswordMutation.mutate(
      { email: data.email },
      {
        onSuccess: () => {
          setSentEmail(data.email);
          setEmailSent(true);
          toast.success("Password reset email sent!");
        },
        onError: () => {
          // Don't reveal if email exists or not for security
          // Still show success message
          setSentEmail(data.email);
          setEmailSent(true);
          toast.success("If an account exists, a reset email has been sent.");
        },
      }
    );
  };

  const isLoading = forgotPasswordMutation.isPending;

  // Success state - email sent
  if (emailSent) {
    return (
      <div className="tw:flex tw:flex-col tw:items-center tw:text-center tw:py-4">
        <div className="tw:w-16 tw:h-16 tw:rounded-full tw:bg-green-100 tw:flex tw:items-center tw:justify-center tw:mb-4">
          <CheckCircle className="tw:w-8 tw:h-8 tw:text-green-600" />
        </div>
        <h3 className="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-2">
          Check your email
        </h3>
        <p className="tw:text-sm tw:text-gray-600 tw:mb-4">
          We sent a password reset link to
          <br />
          <span className="tw:font-medium tw:text-gray-900">{sentEmail}</span>
        </p>
        <p className="tw:text-xs tw:text-gray-500 tw:mb-6">
          Didn&apos;t receive the email? Check your spam folder or{" "}
          <button
            type="button"
            onClick={() => setEmailSent(false)}
            className="tw:text-primary tw:hover:underline"
          >
            try again
          </button>
        </p>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="tw:flex tw:items-center tw:gap-2 tw:text-sm tw:text-gray-600 tw:hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            Back to login
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="tw:mb-6">
        <div className="tw:w-12 tw:h-12 tw:rounded-full tw:bg-primary/10 tw:flex tw:items-center tw:justify-center tw:mb-4">
          <Mail className="tw:w-6 tw:h-6 tw:text-primary" />
        </div>
        <h3 className="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-1">
          Forgot your password?
        </h3>
        <p className="tw:text-sm tw:text-gray-600">
          No worries, we&apos;ll send you reset instructions.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={isLoading} className="tw:flex tw:flex-col tw:gap-4">
          <div className="tw:flex tw:flex-col">
            <label className="tw:font-medium tw:text-sm tw:mb-1">Email</label>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              className={`input ${errors.email ? "tw:border-red-500" : ""}`}
            />
            {errors.email && (
              <span className="tw:text-red-500 tw:text-sm tw:mt-1">
                {errors.email.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="tw:w-full tw:px-4 tw:py-2.5 tw:bg-dark-purple tw:hover:bg-dark-purple/90 tw:text-white tw:rounded-md tw:font-medium tw:disabled:opacity-50 tw:disabled:cursor-not-allowed tw:flex tw:items-center tw:justify-center tw:gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="tw:w-4 tw:h-4 tw:animate-spin" />
                Sending...
              </>
            ) : (
              "Send reset link"
            )}
          </button>

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="tw:flex tw:items-center tw:justify-center tw:gap-2 tw:text-sm tw:text-gray-600 tw:hover:text-gray-900"
            >
              <ArrowLeft size={16} />
              Back to login
            </button>
          )}
        </fieldset>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
