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
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MailIcon from "@mui/icons-material/Mail";
import EventIcon from "@mui/icons-material/Event";
import DevicesIcon from "@mui/icons-material/Devices";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useUser,
  useUserSessions,
  useBanUser,
  useUnbanUser,
  useSetUserRole,
  useRevokeSession,
  useRevokeAllSessions,
} from "@/hooks/useUsers";
import {
  cardStyles,
  tableStyles,
  typographyStyles,
  buttonStyles,
  getRoleChipStyle,
  getStatusChipStyle,
} from "./styles/dashboard-styles";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch user data
  const { data: user, isLoading, error } = useUser(id);
  const { data: sessions = [], isLoading: sessionsLoading } = useUserSessions(id);

  // Mutations
  const banUserMutation = useBanUser();
  const unbanUserMutation = useUnbanUser();
  const setRoleMutation = useSetUserRole();
  const revokeSessionMutation = useRevokeSession();
  const revokeAllSessionsMutation = useRevokeAllSessions();

  const handleBanToggle = async () => {
    if (!user) return;
    try {
      if (user.banned) {
        await unbanUserMutation.mutateAsync({ userId: user.id });
      } else {
        await banUserMutation.mutateAsync({ userId: user.id, banReason: "Banned by admin" });
      }
    } catch (err) {
      console.error("Ban/Unban failed:", err);
    }
  };

  const handleRoleChange = async (role) => {
    if (!user) return;
    try {
      await setRoleMutation.mutateAsync({ userId: user.id, role });
    } catch (err) {
      console.error("Role change failed:", err);
    }
  };

  const handleRevokeSession = async (sessionToken) => {
    try {
      await revokeSessionMutation.mutateAsync({ sessionToken });
    } catch (err) {
      console.error("Revoke session failed:", err);
    }
  };

  const handleRevokeAllSessions = async () => {
    if (!user) return;
    try {
      await revokeAllSessionsMutation.mutateAsync({ userId: user.id });
    } catch (err) {
      console.error("Revoke all sessions failed:", err);
    }
  };

  const getInitials = (name, email) => {
    if (name) return name.split(" ").map((n) => n[0]).join("").toUpperCase();
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

  const formatSessionTime = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleString();
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <CircularProgress sx={{ color: "#3B82F6" }} />
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <IconButton
          size="small"
          onClick={() => navigate("/admin/users")}
          sx={{ alignSelf: "flex-start", color: "#FFFFFF" }}
        >
          <ArrowBackIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <Card sx={cardStyles.base}>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ color: "#71717A", fontFamily: "Inter" }}>
              {error?.message || "User not found."}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} flexWrap="wrap">
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
              {user.name || "Unnamed User"}
            </Typography>
            <Typography variant="body2" sx={typographyStyles.pageSubtitle}>
              User profile and session management
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            size="small"
            label={user.role || "user"}
            sx={getRoleChipStyle(user.role)}
          />
          <Chip
            size="small"
            icon={user.banned ? <BlockIcon sx={{ fontSize: 14 }} /> : <CheckCircleIcon sx={{ fontSize: 14 }} />}
            label={user.banned ? "Banned" : "Active"}
            sx={getStatusChipStyle(user.banned ? "banned" : "active")}
          />
        </Stack>
      </Stack>

      <Grid container spacing={2.5}>
        {/* User Information Card */}
        <Grid item xs={12} md={8} sx={{ minWidth: 0 }}>
          <Card sx={cardStyles.base}>
            <CardHeader
              title={<Typography sx={typographyStyles.cardTitle}>User Information</Typography>}
              subheader={<Typography variant="caption" sx={typographyStyles.cardSubtitle}>Account details and verification status</Typography>}
              sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
            />
            <CardContent sx={{ px: 2.5, pb: 2.5 }}>
              <Stack direction="row" spacing={2.5} alignItems="center" sx={{ mb: 3 }}>
                <Avatar
                  src={user.image}
                  sx={{ width: 64, height: 64, bgcolor: "#1f2937", fontSize: 24, fontWeight: 600, fontFamily: "Inter" }}
                >
                  {getInitials(user.name, user.email)}
                </Avatar>
                <Box>
                  <Typography sx={{ color: "#FFFFFF", fontWeight: 600, fontSize: 18, fontFamily: "Inter" }}>
                    {user.name || "Unnamed User"}
                  </Typography>
                  <Typography sx={{ color: "#71717A", fontSize: 13, fontFamily: "Inter" }}>
                    Member since {formatDate(user.createdAt)}
                  </Typography>
                </Box>
              </Stack>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <MailIcon sx={{ fontSize: 18, color: "#71717A" }} />
                    <Box>
                      <Typography sx={typographyStyles.label}>Email</Typography>
                      <Typography sx={typographyStyles.value}>{user.email}</Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <CheckCircleIcon sx={{ fontSize: 18, color: user.emailVerified ? "#22C55E" : "#71717A" }} />
                    <Box>
                      <Typography sx={typographyStyles.label}>Email Verified</Typography>
                      <Typography sx={typographyStyles.value}>{user.emailVerified ? "Yes" : "No"}</Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <AdminPanelSettingsIcon sx={{ fontSize: 18, color: "#71717A" }} />
                    <Box>
                      <Typography sx={typographyStyles.label}>Role</Typography>
                      <Typography sx={typographyStyles.value}>{user.role || "user"}</Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <EventIcon sx={{ fontSize: 18, color: "#71717A" }} />
                    <Box>
                      <Typography sx={typographyStyles.label}>Created</Typography>
                      <Typography sx={typographyStyles.value}>{formatDate(user.createdAt)}</Typography>
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
              title={<Typography sx={typographyStyles.cardTitle}>Actions</Typography>}
              subheader={<Typography variant="caption" sx={typographyStyles.cardSubtitle}>Manage this user account</Typography>}
              sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
            />
            <CardContent sx={{ px: 2.5, pb: 2.5 }}>
              <Stack spacing={1.5}>
                <Button
                  fullWidth
                  size="small"
                  startIcon={user.banned ? <CheckCircleIcon /> : <BlockIcon />}
                  onClick={handleBanToggle}
                  disabled={banUserMutation.isPending || unbanUserMutation.isPending}
                  sx={user.banned ? buttonStyles.primary : buttonStyles.danger}
                >
                  {user.banned ? "Unban User" : "Ban User"}
                </Button>

                <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

                <Typography sx={{ color: "#71717A", fontSize: 12, fontFamily: "Inter" }}>Change Role</Typography>
                <Stack direction="row" spacing={1}>
                  {["admin", "moderator", "user"].map((role) => (
                    <Button
                      key={role}
                      size="small"
                      variant={user.role === role ? "contained" : "outlined"}
                      onClick={() => handleRoleChange(role)}
                      disabled={setRoleMutation.isPending}
                      sx={{
                        flex: 1,
                        textTransform: "capitalize",
                        ...(user.role === role ? buttonStyles.primary : buttonStyles.secondary),
                      }}
                    >
                      {role}
                    </Button>
                  ))}
                </Stack>

                <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

                <Button
                  fullWidth
                  size="small"
                  startIcon={<DeleteIcon />}
                  onClick={handleRevokeAllSessions}
                  disabled={revokeAllSessionsMutation.isPending || sessions.length === 0}
                  sx={buttonStyles.secondary}
                >
                  Revoke All Sessions ({sessions.length})
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Sessions Card */}
      <Card sx={cardStyles.base}>
        <CardHeader
          title={
            <Stack direction="row" spacing={1} alignItems="center">
              <DevicesIcon sx={{ fontSize: 20, color: "#3B82F6" }} />
              <Typography sx={typographyStyles.cardTitle}>Active Sessions</Typography>
            </Stack>
          }
          subheader={<Typography variant="caption" sx={typographyStyles.cardSubtitle}>User&apos;s active login sessions</Typography>}
          sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          {sessionsLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={24} sx={{ color: "#3B82F6" }} />
            </Box>
          ) : sessions.length === 0 ? (
            <Typography sx={{ color: "#71717A", fontSize: 13, fontFamily: "Inter", textAlign: "center", py: 4 }}>
              No active sessions
            </Typography>
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={tableStyles.headerCell}>Created</TableCell>
                    <TableCell sx={tableStyles.headerCell}>Expires</TableCell>
                    <TableCell sx={tableStyles.headerCell}>IP Address</TableCell>
                    <TableCell sx={tableStyles.headerCell}>User Agent</TableCell>
                    <TableCell align="right" sx={tableStyles.headerCell}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell sx={tableStyles.bodyCell}>
                        {formatSessionTime(session.createdAt)}
                      </TableCell>
                      <TableCell sx={{ ...tableStyles.bodyCell, color: "#71717A" }}>
                        {formatSessionTime(session.expiresAt)}
                      </TableCell>
                      <TableCell sx={{ ...tableStyles.bodyCell, color: "#71717A" }}>
                        {session.ipAddress || "—"}
                      </TableCell>
                      <TableCell sx={{ ...tableStyles.bodyCell, color: "#71717A", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>
                        {session.userAgent || "—"}
                      </TableCell>
                      <TableCell align="right" sx={tableStyles.bodyCell}>
                        <IconButton
                          size="small"
                          onClick={() => handleRevokeSession(session.token)}
                          disabled={revokeSessionMutation.isPending}
                          sx={{ color: "#EF4444" }}
                        >
                          <DeleteIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
