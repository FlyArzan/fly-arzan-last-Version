import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

// API base URL - adjust based on your backend setup
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Re-export useSession from better-auth client for consistent session management
export { useSession } from "@/lib/auth-client";

// Sign In API call
const signIn = async (credentials) => {
  const formData = new FormData();
  formData.append("email", credentials.email);
  formData.append("password", credentials.password);
  // Pass rememberMe option (default true if not specified)
  formData.append(
    "rememberMe",
    credentials.rememberMe !== false ? "true" : "false"
  );

  const response = await fetch(`${API_BASE_URL}/api/auth/custom/sign-in`, {
    credentials: "include",
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Sign in failed");
  }

  return data;
};

// Sign Up API call
const signUp = async (userData) => {
  const formData = new FormData();
  formData.append("name", userData.name);
  formData.append("email", userData.email);
  formData.append("password", userData.password);

  const response = await fetch(`${API_BASE_URL}/api/auth/custom/sign-up`, {
    credentials: "include",
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Sign up failed");
  }

  return data;
};

// Sign In Hook
export const useSignIn = () => {
  return useMutation({
    mutationFn: async (credentials) => {
      const result = await signIn(credentials);

      // Wait for session to be fully established
      // Poll until session is confirmed (max 5 seconds)
      let sessionConfirmed = false;
      let attempts = 0;
      const maxAttempts = 10;

      while (!sessionConfirmed && attempts < maxAttempts) {
        attempts++;
        const sessionData = await authClient.getSession({
          fetchOptions: { throw: false },
        });

        if (sessionData?.data?.user) {
          sessionConfirmed = true;
          // Return the confirmed session user data
          result.confirmedUser = sessionData.data.user;
        } else {
          // Wait 500ms before next attempt
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      if (!sessionConfirmed) {
        console.warn("Session not confirmed after login, proceeding anyway");
      }

      return result;
    },
    mutationKey: ["auth", "sign-in"],
  });
};

// Sign Up Hook
export const useSignUp = () => {
  return useMutation({
    mutationFn: signUp,
    mutationKey: ["auth", "sign-up"],
  });
};

// Sign Out Hook - uses better-auth client
export const useSignOut = () => {
  return useMutation({
    mutationFn: () => authClient.signOut(),
    mutationKey: ["auth", "sign-out"],
  });
};

// Forgot Password Hook - request password reset email
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async ({ email, redirectTo }) => {
      const result = await authClient.requestPasswordReset({
        email,
        redirectTo: redirectTo || `${window.location.origin}/reset-password`,
      });
      if (result.error) {
        throw new Error(result.error.message || "Failed to send reset email");
      }
      return result;
    },
    mutationKey: ["auth", "forgot-password"],
  });
};

// Reset Password Hook - set new password with token
export const useResetPassword = () => {
  return useMutation({
    mutationFn: async ({ newPassword, token }) => {
      const result = await authClient.resetPassword({
        newPassword,
        token,
      });
      if (result.error) {
        throw new Error(result.error.message || "Failed to reset password");
      }
      return result;
    },
    mutationKey: ["auth", "reset-password"],
  });
};

// Google Sign In - uses better-auth social sign in
// This function triggers a redirect to Google OAuth
export const signInWithGoogle = async (callbackURL = "/dashboard") => {
  console.log("[Google Sign In] Starting...");

  const result = await authClient.signIn.social({
    provider: "google",
    callbackURL,
    errorCallbackURL: "/Login?error=google_auth_failed",
  });

  console.log("[Google Sign In] Result:", result);

  // Check if there's an error in the response
  if (result?.error) {
    console.error("[Google Sign In] Error:", result.error);
    throw new Error(result.error.message || "Google sign in failed");
  }

  // If the client didn't auto-redirect and returned a URL, redirect manually
  if (result?.data?.url) {
    console.log("[Google Sign In] Redirecting to:", result.data.url);
    window.location.href = result.data.url;
  } else if (result?.url) {
    console.log("[Google Sign In] Redirecting to:", result.url);
    window.location.href = result.url;
  }

  return result;
};

// Helper hook to check if user is authenticated
export const useIsAuthenticated = () => {
  const { data: session, isPending: isLoading } = authClient.useSession();
  return {
    isAuthenticated: !!session?.user,
    isLoading,
    user: session?.user ?? null,
    session: session?.session ?? null,
  };
};

// Helper hook to check if user is admin (only super role can access admin panel)
// This matches better-auth config: adminRoles: "super"
export const useIsAdmin = () => {
  const { isAuthenticated, user, isLoading } = useIsAuthenticated();
  const isAdmin = isAuthenticated && user?.role === "super";
  return {
    isAdmin,
    isLoading,
    user,
  };
};

// Helper hook to check if user is super admin
export const useIsSuperAdmin = () => {
  const { isAuthenticated, user, isLoading } = useIsAuthenticated();
  return {
    isSuperAdmin: isAuthenticated && user?.role === "super",
    isLoading,
    user,
  };
};

// Helper hook to check if user is moderator or higher
export const useIsModerator = () => {
  const { isAuthenticated, user, isLoading } = useIsAuthenticated();
  const isModerator =
    isAuthenticated &&
    (user?.role === "super" ||
      user?.role === "admin" ||
      user?.role === "moderator");
  return {
    isModerator,
    isLoading,
    user,
  };
};

// Helper hook to check if user has a specific role
export const useHasRole = (...allowedRoles) => {
  const { isAuthenticated, user, isLoading } = useIsAuthenticated();
  const hasRole = isAuthenticated && allowedRoles.includes(user?.role);
  return {
    hasRole,
    isLoading,
    user,
  };
};
