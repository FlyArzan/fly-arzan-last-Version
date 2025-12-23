import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const authClient = createAuthClient({
  baseURL: API_BASE_URL,
  plugins: [adminClient()],
});

// Export hooks and methods
export const { useSession, signIn, signUp, signOut, getSession } = authClient;
