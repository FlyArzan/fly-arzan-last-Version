import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Stack,
  Chip,
  Avatar,
  IconButton,
  Divider,
  Button,
  CircularProgress,
  Switch,
  FormControlLabel,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MailIcon from "@mui/icons-material/Mail";
import EventIcon from "@mui/icons-material/Event";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import NotificationsIcon from "@mui/icons-material/Notifications";
import EmailIcon from "@mui/icons-material/Email";
import UpdateIcon from "@mui/icons-material/Update";
import {
  useCustomer,
  useBanCustomer,
  useUnbanCustomer,
  useDeleteCustomer,
  useUpdateCustomerPreferences,
} from "@/hooks/useCustomers";
import {
  cardStyles,
  typographyStyles,
  buttonStyles,
  getStatusChipStyle,
} from "./styles/dashboard-styles";

export default function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch customer data
  const { data: customer, isLoading, error } = useCustomer(id);

  // Mutations
  const banCustomerMutation = useBanCustomer();
  const unbanCustomerMutation = useUnbanCustomer();
  const deleteCustomerMutation = useDeleteCustomer();
  const updatePreferencesMutation = useUpdateCustomerPreferences();

  const handleBanToggle = async () => {
    if (!customer) return;
    try {
      if (customer.banned) {
        await unbanCustomerMutation.mutateAsync({ customerId: customer.id });
      } else {
        await banCustomerMutation.mutateAsync({
          customerId: customer.id,
          banReason: "Banned by admin",
        });
      }
    } catch (err) {
      console.error("Ban/Unban failed:", err);
    }
  };

  const handleDelete = async () => {
    if (!customer) return;
    if (
      window.confirm(
        `Are you sure you want to delete ${
          customer.name || customer.email
        }? This action cannot be undone.`
      )
    ) {
      try {
        await deleteCustomerMutation.mutateAsync({ customerId: customer.id });
        navigate("/admin/customers");
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const handlePreferenceChange = async (field, value) => {
    if (!customer) return;
    try {
      await updatePreferencesMutation.mutateAsync({
        customerId: customer.id,
        [field]: value,
      });
    } catch (err) {
      console.error("Preference update failed:", err);
    }
  };

  const getInitials = (name, email) => {
    if (name)
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    return email?.charAt(0).toUpperCase() || "?";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
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

  if (error || !customer) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <IconButton
          size="small"
          onClick={() => navigate("/admin/customers")}
          sx={{ alignSelf: "flex-start", color: "#FFFFFF" }}
        >
          <ArrowBackIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <Card sx={cardStyles.base}>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ color: "#71717A", fontFamily: "Inter" }}>
              {error?.message || "Customer not found."}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        flexWrap="wrap"
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton
            size="small"
            onClick={() => navigate(-1)}
            sx={{ color: "#FFFFFF" }}
          >
            <ArrowBackIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <Box>
            <Typography variant="h5" sx={typographyStyles.pageTitle}>
              {customer.name || "Unnamed Customer"}
            </Typography>
            <Typography variant="body2" sx={typographyStyles.pageSubtitle}>
              Customer profile and communication preferences
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            size="small"
            label="Customer"
            sx={{
              bgcolor: "rgba(34, 197, 94, 0.1)",
              color: "#22C55E",
              fontFamily: "Inter",
              fontWeight: 500,
            }}
          />
          <Chip
            size="small"
            icon={
              customer.banned ? (
                <BlockIcon sx={{ fontSize: 14 }} />
              ) : (
                <CheckCircleIcon sx={{ fontSize: 14 }} />
              )
            }
            label={customer.banned ? "Banned" : "Active"}
            sx={getStatusChipStyle(customer.banned ? "banned" : "active")}
          />
        </Stack>
      </Stack>

      <Grid container spacing={2.5}>
        {/* Customer Information Card */}
        <Grid item xs={12} md={8} sx={{ minWidth: 0 }}>
          <Card sx={cardStyles.base}>
            <CardHeader
              title={
                <Typography sx={typographyStyles.cardTitle}>
                  Customer Information
                </Typography>
              }
              subheader={
                <Typography
                  variant="caption"
                  sx={typographyStyles.cardSubtitle}
                >
                  Account details and verification status
                </Typography>
              }
              sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
            />
            <CardContent sx={{ px: 2.5, pb: 2.5 }}>
              <Stack
                direction="row"
                spacing={2.5}
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <Avatar
                  src={customer.image}
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: "#22C55E",
                    fontSize: 24,
                    fontWeight: 600,
                    fontFamily: "Inter",
                  }}
                >
                  {getInitials(customer.name, customer.email)}
                </Avatar>
                <Box>
                  <Typography
                    sx={{
                      color: "#FFFFFF",
                      fontWeight: 600,
                      fontSize: 18,
                      fontFamily: "Inter",
                    }}
                  >
                    {customer.name || "Unnamed Customer"}
                  </Typography>
                  <Typography
                    sx={{ color: "#71717A", fontSize: 13, fontFamily: "Inter" }}
                  >
                    Customer since {formatDate(customer.createdAt)}
                  </Typography>
                </Box>
              </Stack>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <MailIcon sx={{ fontSize: 18, color: "#71717A" }} />
                    <Box>
                      <Typography sx={typographyStyles.label}>Email</Typography>
                      <Typography sx={typographyStyles.value}>
                        {customer.email}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <CheckCircleIcon
                      sx={{
                        fontSize: 18,
                        color: customer.emailVerified ? "#22C55E" : "#71717A",
                      }}
                    />
                    <Box>
                      <Typography sx={typographyStyles.label}>
                        Email Verified
                      </Typography>
                      <Typography sx={typographyStyles.value}>
                        {customer.emailVerified ? "Yes" : "No"}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <EventIcon sx={{ fontSize: 18, color: "#71717A" }} />
                    <Box>
                      <Typography sx={typographyStyles.label}>
                        Joined
                      </Typography>
                      <Typography sx={typographyStyles.value}>
                        {formatDate(customer.createdAt)}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <UpdateIcon sx={{ fontSize: 18, color: "#71717A" }} />
                    <Box>
                      <Typography sx={typographyStyles.label}>
                        Last Updated
                      </Typography>
                      <Typography sx={typographyStyles.value}>
                        {formatDate(customer.updatedAt)}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Actions Card */}
        <Grid item xs={12} md={4} sx={{ minWidth: 0 }}>
          <Card sx={cardStyles.base}>
            <CardHeader
              title={
                <Typography sx={typographyStyles.cardTitle}>Actions</Typography>
              }
              subheader={
                <Typography
                  variant="caption"
                  sx={typographyStyles.cardSubtitle}
                >
                  Manage this customer account
                </Typography>
              }
              sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
            />
            <CardContent sx={{ px: 2.5, pb: 2.5 }}>
              <Stack spacing={1.5}>
                <Button
                  fullWidth
                  size="small"
                  startIcon={
                    customer.banned ? <CheckCircleIcon /> : <BlockIcon />
                  }
                  onClick={handleBanToggle}
                  disabled={
                    banCustomerMutation.isPending ||
                    unbanCustomerMutation.isPending
                  }
                  sx={
                    customer.banned ? buttonStyles.primary : buttonStyles.danger
                  }
                >
                  {customer.banned ? "Unban Customer" : "Ban Customer"}
                </Button>

                <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

                <Button
                  fullWidth
                  size="small"
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                  disabled={deleteCustomerMutation.isPending}
                  sx={buttonStyles.danger}
                >
                  Delete Customer
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Communication Preferences Card */}
      <Card sx={cardStyles.base}>
        <CardHeader
          title={
            <Stack direction="row" spacing={1} alignItems="center">
              <NotificationsIcon sx={{ fontSize: 20, color: "#F59E0B" }} />
              <Typography sx={typographyStyles.cardTitle}>
                Communication Preferences
              </Typography>
            </Stack>
          }
          subheader={
            <Typography variant="caption" sx={typographyStyles.cardSubtitle}>
              Customer&apos;s notification and newsletter settings
            </Typography>
          }
          sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  bgcolor: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: customer.wantsNotifications
                          ? "rgba(34, 197, 94, 0.1)"
                          : "rgba(113, 113, 122, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <NotificationsIcon
                        sx={{
                          fontSize: 20,
                          color: customer.wantsNotifications
                            ? "#22C55E"
                            : "#71717A",
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          color: "#FFFFFF",
                          fontWeight: 500,
                          fontSize: 14,
                          fontFamily: "Inter",
                        }}
                      >
                        Notifications
                      </Typography>
                      <Typography
                        sx={{
                          color: "#71717A",
                          fontSize: 12,
                          fontFamily: "Inter",
                        }}
                      >
                        Receive booking updates and alerts
                      </Typography>
                    </Box>
                  </Stack>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={customer.wantsNotifications}
                        onChange={(e) =>
                          handlePreferenceChange(
                            "wantsNotifications",
                            e.target.checked
                          )
                        }
                        disabled={updatePreferencesMutation.isPending}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#22C55E",
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: "#22C55E",
                            },
                        }}
                      />
                    }
                    label=""
                  />
                </Stack>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  bgcolor: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: customer.wantsNewsletter
                          ? "rgba(168, 85, 247, 0.1)"
                          : "rgba(113, 113, 122, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <EmailIcon
                        sx={{
                          fontSize: 20,
                          color: customer.wantsNewsletter
                            ? "#A855F7"
                            : "#71717A",
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          color: "#FFFFFF",
                          fontWeight: 500,
                          fontSize: 14,
                          fontFamily: "Inter",
                        }}
                      >
                        Newsletter
                      </Typography>
                      <Typography
                        sx={{
                          color: "#71717A",
                          fontSize: 12,
                          fontFamily: "Inter",
                        }}
                      >
                        Receive promotional emails and offers
                      </Typography>
                    </Box>
                  </Stack>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={customer.wantsNewsletter}
                        onChange={(e) =>
                          handlePreferenceChange(
                            "wantsNewsletter",
                            e.target.checked
                          )
                        }
                        disabled={updatePreferencesMutation.isPending}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#A855F7",
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: "#A855F7",
                            },
                        }}
                      />
                    }
                    label=""
                  />
                </Stack>
              </Card>
            </Grid>
          </Grid>

          {customer.communicationPreferencesUpdatedAt && (
            <Typography
              sx={{
                color: "#71717A",
                fontSize: 12,
                fontFamily: "Inter",
                mt: 2,
                textAlign: "right",
              }}
            >
              Last updated:{" "}
              {formatDateTime(customer.communicationPreferencesUpdatedAt)}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
