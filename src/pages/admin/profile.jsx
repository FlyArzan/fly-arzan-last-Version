import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Stack,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Save as SaveIcon,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSession } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  cardStyles,
  typographyStyles,
  buttonStyles,
  inputStyles,
} from "./styles/dashboard-styles";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Validation schemas
const profileSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: yup.string().email("Invalid email").required("Email is required"),
});

const passwordSchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
});

// Update profile API
const updateProfile = async (data) => {
  const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update profile");
  }
  return response.json();
};

// Change password API
const changePassword = async (data) => {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/custom/change-password`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to change password");
  }
  return response.json();
};

export default function AdminProfile() {
  const queryClient = useQueryClient();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data: session, isLoading: sessionLoading } = useSession();
  const user = session?.user;

  const userInitials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "A";

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: yupResolver(profileSchema),
    values: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  // Mutations
  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const passwordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully");
      resetPasswordForm();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onProfileSubmit = (data) => {
    profileMutation.mutate(data);
  };

  const onPasswordSubmit = (data) => {
    passwordMutation.mutate(data);
  };

  if (sessionLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <CircularProgress sx={{ color: "#3B82F6" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Page Header */}
      <Box>
        <Typography variant="h5" sx={typographyStyles.pageTitle}>
          My Profile
        </Typography>
        <Typography variant="body2" sx={typographyStyles.pageSubtitle}>
          Manage your account settings and change your password
        </Typography>
      </Box>

      {/* Profile Card */}
      <Card sx={cardStyles.base}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Avatar
              src={user?.image}
              sx={{
                width: 64,
                height: 64,
                bgcolor: "#3B82F6",
                fontSize: 24,
                fontWeight: 600,
              }}
            >
              {userInitials}
            </Avatar>
            <Box>
              <Typography
                sx={{
                  color: "#FFFFFF",
                  fontSize: 18,
                  fontWeight: 600,
                  fontFamily: "Inter",
                }}
              >
                {user?.name || "Admin User"}
              </Typography>
              <Typography
                sx={{
                  color: "#71717A",
                  fontSize: 14,
                  fontFamily: "Inter",
                }}
              >
                {user?.email}
              </Typography>
              <Typography
                sx={{
                  color: "#3B82F6",
                  fontSize: 12,
                  fontFamily: "Inter",
                  textTransform: "capitalize",
                }}
              >
                {user?.role || "Admin"}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)", mb: 3 }} />

          {/* Profile Form */}
          <Box sx={{ mb: 4 }}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <PersonIcon sx={{ color: "#3B82F6", fontSize: 20 }} />
              <Typography
                sx={{
                  color: "#FFFFFF",
                  fontSize: 16,
                  fontWeight: 600,
                  fontFamily: "Inter",
                }}
              >
                Personal Information
              </Typography>
            </Stack>

            <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Full Name"
                  {...registerProfile("name")}
                  error={!!profileErrors.name}
                  helperText={profileErrors.name?.message}
                  sx={inputStyles.dark}
                />
                <TextField
                  fullWidth
                  label="Email Address"
                  {...registerProfile("email")}
                  error={!!profileErrors.email}
                  helperText={profileErrors.email?.message}
                  sx={inputStyles.dark}
                />
                <Box>
                  <Button
                    type="submit"
                    startIcon={<SaveIcon />}
                    disabled={profileMutation.isPending}
                    sx={buttonStyles.primary}
                  >
                    {profileMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </Box>
              </Stack>
            </form>
          </Box>

          <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)", mb: 3 }} />

          {/* Password Form */}
          <Box>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <LockIcon sx={{ color: "#F59E0B", fontSize: 20 }} />
              <Typography
                sx={{
                  color: "#FFFFFF",
                  fontSize: 16,
                  fontWeight: 600,
                  fontFamily: "Inter",
                }}
              >
                Change Password
              </Typography>
            </Stack>

            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type={showCurrentPassword ? "text" : "password"}
                  {...registerPassword("currentPassword")}
                  error={!!passwordErrors.currentPassword}
                  helperText={passwordErrors.currentPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          edge="end"
                          sx={{ color: "#71717A" }}
                        >
                          {showCurrentPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={inputStyles.dark}
                />
                <TextField
                  fullWidth
                  label="New Password"
                  type={showNewPassword ? "text" : "password"}
                  {...registerPassword("newPassword")}
                  error={!!passwordErrors.newPassword}
                  helperText={passwordErrors.newPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                          sx={{ color: "#71717A" }}
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={inputStyles.dark}
                />
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type={showConfirmPassword ? "text" : "password"}
                  {...registerPassword("confirmPassword")}
                  error={!!passwordErrors.confirmPassword}
                  helperText={passwordErrors.confirmPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                          sx={{ color: "#71717A" }}
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={inputStyles.dark}
                />
                <Box>
                  <Button
                    type="submit"
                    startIcon={<LockIcon />}
                    disabled={passwordMutation.isPending}
                    sx={buttonStyles.secondary}
                  >
                    {passwordMutation.isPending
                      ? "Updating..."
                      : "Update Password"}
                  </Button>
                </Box>
              </Stack>
            </form>
          </Box>

          {profileMutation.isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {profileMutation.error?.message}
            </Alert>
          )}
          {passwordMutation.isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {passwordMutation.error?.message}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
