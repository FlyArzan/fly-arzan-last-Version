import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Tabs,
  Tab,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Switch,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Logout as LogoutIcon,
  Home as HomeIcon,
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import NotificationBell from "@/components/notifications/NotificationBell";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSession, useSignOut } from "@/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

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

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

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

const UserDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(0);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Delete account state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Notification preferences state
  const [notificationPrefs, setNotificationPrefs] = useState({
    wantsNotifications: true,
    wantsNewsletter: false,
  });

  const { data: session, isLoading: sessionLoading } = useSession();
  const signOutMutation = useSignOut();

  const user = session?.user;

  // Fetch notification preferences from backend
  const { data: prefsData } = useQuery({
    queryKey: ["notification-preferences"],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/api/user/notification-preferences`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch notification preferences");
      }
      return response.json();
    },
    enabled: !!user,
  });

  // Sync local state with fetched data
  useEffect(() => {
    if (prefsData) {
      setNotificationPrefs({
        wantsNotifications: prefsData.wantsNotifications ?? true,
        wantsNewsletter: prefsData.wantsNewsletter ?? false,
      });
    }
  }, [prefsData]);
  const userInitials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
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

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: async (password) => {
      const result = await authClient.deleteUser({
        password,
      });
      if (result.error) {
        throw new Error(result.error.message || "Failed to delete account");
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Account deleted successfully");
      queryClient.clear();
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete account");
    },
  });

  // Notification preferences mutation
  const notificationPrefsMutation = useMutation({
    mutationFn: async (prefs) => {
      const response = await fetch(
        `${API_BASE_URL}/api/user/notification-preferences`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(prefs),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || "Failed to update notification preferences"
        );
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Notification preferences updated");
      queryClient.invalidateQueries({ queryKey: ["notification-preferences"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleLogout = () => {
    signOutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  const onProfileSubmit = (data) => {
    profileMutation.mutate(data);
  };

  const onPasswordSubmit = (data) => {
    passwordMutation.mutate(data);
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm");
      return;
    }
    if (!deletePassword) {
      toast.error("Please enter your password");
      return;
    }
    deleteAccountMutation.mutate(deletePassword);
  };

  const handleNotificationChange = (key) => (event) => {
    const newPrefs = { ...notificationPrefs, [key]: event.target.checked };
    setNotificationPrefs(newPrefs);
    notificationPrefsMutation.mutate(newPrefs);
  };

  if (sessionLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#f5f5f5",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        py: 4,
        px: 2,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          maxWidth: 800,
          mx: "auto",
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          startIcon={<HomeIcon />}
          onClick={() => navigate("/")}
          sx={{ color: "#666" }}
        >
          Back to Home
        </Button>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <NotificationBell />
          <Button
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            color="error"
            variant="outlined"
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Main Card */}
      <Card
        sx={{
          maxWidth: 800,
          mx: "auto",
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        {/* Profile Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            p: 4,
            display: "flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: "rgba(255,255,255,0.2)",
              fontSize: 28,
              fontWeight: 600,
              border: "3px solid rgba(255,255,255,0.3)",
            }}
          >
            {userInitials}
          </Avatar>
          <Box>
            <Typography
              variant="h5"
              sx={{ color: "#fff", fontWeight: 600, mb: 0.5 }}
            >
              {user?.name || "User"}
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>
              {user?.email}
            </Typography>
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 500,
                fontSize: 14,
              },
            }}
          >
            <Tab
              icon={<PersonIcon sx={{ fontSize: 20 }} />}
              iconPosition="start"
              label="Profile"
            />
            <Tab
              icon={<LockIcon sx={{ fontSize: 20 }} />}
              iconPosition="start"
              label="Security"
            />
            <Tab
              icon={<NotificationsIcon sx={{ fontSize: 20 }} />}
              iconPosition="start"
              label="Notifications"
            />
          </Tabs>
        </Box>

        <CardContent sx={{ p: 4 }}>
          {/* Profile Tab */}
          <TabPanel value={activeTab} index={0}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Profile Information
            </Typography>
            <Typography sx={{ color: "#666", mb: 3, fontSize: 14 }}>
              Update your personal information
            </Typography>

            <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <TextField
                  label="Full Name"
                  fullWidth
                  defaultValue={user?.name || ""}
                  {...registerProfile("name")}
                  error={!!profileErrors.name}
                  helperText={profileErrors.name?.message}
                />
                <TextField
                  label="Email Address"
                  fullWidth
                  defaultValue={user?.email || ""}
                  {...registerProfile("email")}
                  error={!!profileErrors.email}
                  helperText={profileErrors.email?.message}
                />
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={profileMutation.isPending}
                    sx={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      px: 4,
                    }}
                  >
                    {profileMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </Box>
              </Box>
            </form>
          </TabPanel>

          {/* Security Tab */}
          <TabPanel value={activeTab} index={1}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Change Password
            </Typography>
            <Typography sx={{ color: "#666", mb: 3, fontSize: 14 }}>
              Ensure your account is using a strong password
            </Typography>

            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <TextField
                  label="Current Password"
                  type={showCurrentPassword ? "text" : "password"}
                  fullWidth
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
                />
                <TextField
                  label="New Password"
                  type={showNewPassword ? "text" : "password"}
                  fullWidth
                  {...registerPassword("newPassword")}
                  error={!!passwordErrors.newPassword}
                  helperText={passwordErrors.newPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Confirm New Password"
                  type={showConfirmPassword ? "text" : "password"}
                  fullWidth
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
                />
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={passwordMutation.isPending}
                    sx={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      px: 4,
                    }}
                  >
                    {passwordMutation.isPending
                      ? "Updating..."
                      : "Update Password"}
                  </Button>
                </Box>
              </Box>
            </form>

            <Alert severity="info" sx={{ mt: 3 }}>
              Password must be at least 8 characters long.
            </Alert>

            {/* Delete Account Section */}
            <Divider sx={{ my: 4 }} />
            <Box
              sx={{
                p: 3,
                border: "1px solid #ffcdd2",
                borderRadius: 2,
                bgcolor: "#ffebee",
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <WarningIcon sx={{ color: "#d32f2f" }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#d32f2f" }}
                >
                  Delete Account
                </Typography>
              </Box>
              <Typography sx={{ color: "#666", mb: 2, fontSize: 14 }}>
                Once you delete your account, there is no going back. All your
                data will be permanently removed.
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete My Account
              </Button>
            </Box>
          </TabPanel>

          {/* Notifications Tab */}
          <TabPanel value={activeTab} index={2}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Notification Preferences
            </Typography>
            <Typography sx={{ color: "#666", mb: 3, fontSize: 14 }}>
              Manage how you receive notifications and updates from Fly Arzan
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* In-App Notifications */}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  In-App Notifications
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationPrefs.wantsNotifications}
                        onChange={handleNotificationChange(
                          "wantsNotifications"
                        )}
                        color="primary"
                        disabled={notificationPrefsMutation.isPending}
                      />
                    }
                    label={
                      <Box>
                        <Typography sx={{ fontWeight: 500 }}>
                          Receive Notifications
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#666" }}>
                          Get notified about important updates, promotions, and
                          system announcements within the app
                        </Typography>
                      </Box>
                    }
                  />
                </FormGroup>
              </Box>

              <Divider />

              {/* Email Notifications */}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Email Communications
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationPrefs.wantsNewsletter}
                        onChange={handleNotificationChange("wantsNewsletter")}
                        color="primary"
                        disabled={notificationPrefsMutation.isPending}
                      />
                    }
                    label={
                      <Box>
                        <Typography sx={{ fontWeight: 500 }}>
                          Newsletter & Marketing Emails
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#666" }}>
                          Receive promotional emails, special offers, travel
                          tips, and newsletter updates from Fly Arzan
                        </Typography>
                      </Box>
                    }
                  />
                </FormGroup>
              </Box>
            </Box>

            <Alert severity="info" sx={{ mt: 3 }}>
              Your preferences are saved automatically. You can change them at
              any time.
            </Alert>
          </TabPanel>
        </CardContent>
      </Card>

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningIcon sx={{ color: "#d32f2f" }} />
          Delete Account
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            This action is <strong>permanent and cannot be undone</strong>. All
            your data, including bookings, saved searches, and preferences will
            be permanently deleted.
          </DialogContentText>
          <TextField
            label="Enter your password"
            type="password"
            fullWidth
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label='Type "DELETE" to confirm'
            fullWidth
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
            helperText="This action cannot be undone"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              setDeletePassword("");
              setDeleteConfirmText("");
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteAccount}
            disabled={
              deleteAccountMutation.isPending ||
              deleteConfirmText !== "DELETE" ||
              !deletePassword
            }
          >
            {deleteAccountMutation.isPending ? "Deleting..." : "Delete Account"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserDashboard;
