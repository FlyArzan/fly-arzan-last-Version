import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Stack,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Menu,
  MenuItem,
  Pagination,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonIcon from "@mui/icons-material/Person";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  useUsers,
  useBanUser,
  useUnbanUser,
  useSetUserRole,
  useImpersonateUser,
} from "@/hooks/useUsers";
import { useIsAuthenticated } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import {
  cardStyles,
  inputStyles,
  tableStyles,
  typographyStyles,
  menuStyles,
  getRoleChipStyle,
  getStatusChipStyle,
  buttonStyles,
} from "./styles/dashboard-styles";

export default function Users() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [banDialogOpen, setBanDialogOpen] = useState(false);

  // Get current user to prevent self-demotion
  const { user: currentUser } = useIsAuthenticated();

  // Fetch users from backend
  const { data, isLoading, refetch, error } = useUsers({
    page,
    limit: 20,
    search: query,
  });

  const users = data?.users ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalUsers = data?.total ?? 0;

  // Mutations
  const banUserMutation = useBanUser();
  const unbanUserMutation = useUnbanUser();
  const setRoleMutation = useSetUserRole();
  const impersonateMutation = useImpersonateUser();

  const handleMenuOpen = (event, user) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleViewProfile = () => {
    if (selectedUser) {
      navigate(`/admin/users/${selectedUser.id}`);
      handleMenuClose();
    }
  };

  const handleBanUser = async () => {
    if (selectedUser) {
      try {
        if (selectedUser.banned) {
          await unbanUserMutation.mutateAsync({ userId: selectedUser.id });
        } else {
          await banUserMutation.mutateAsync({
            userId: selectedUser.id,
            banReason: "Banned by admin",
          });
        }
      } catch (err) {
        console.error("Ban/Unban failed:", err);
      }
    }
    setBanDialogOpen(false);
    handleMenuClose();
  };

  const handleSetRole = async (role) => {
    if (selectedUser) {
      // Prevent self-demotion
      if (selectedUser.id === currentUser?.id) {
        toast.error(
          "You cannot change your own role. This would lock you out."
        );
        setRoleDialogOpen(false);
        handleMenuClose();
        return;
      }
      try {
        await setRoleMutation.mutateAsync({ userId: selectedUser.id, role });
      } catch (err) {
        console.error("Set role failed:", err);
      }
    }
    setRoleDialogOpen(false);
    handleMenuClose();
  };

  const handleImpersonate = async () => {
    if (selectedUser) {
      try {
        await impersonateMutation.mutateAsync({ userId: selectedUser.id });
        window.location.href = "/"; // Redirect to main app
      } catch (err) {
        console.error("Impersonate failed:", err);
      }
    }
    handleMenuClose();
  };

  const getInitials = (name, email) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    }
    return email?.charAt(0).toUpperCase() || "?";
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" sx={typographyStyles.pageTitle}>
            Users
          </Typography>
          <Typography variant="body2" sx={typographyStyles.pageSubtitle}>
            Manage users, roles, and permissions using better-auth admin.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button
            size="small"
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
            disabled={isLoading}
            sx={buttonStyles.secondary}
          >
            Refresh
          </Button>
          <Chip
            size="small"
            label={`${totalUsers} total users`}
            sx={getRoleChipStyle("user")}
          />
        </Stack>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ bgcolor: "rgba(239, 68, 68, 0.1)", color: "#EF4444" }}
        >
          Failed to load users: {error.message}
        </Alert>
      )}

      <Card sx={cardStyles.base}>
        <CardHeader
          title={
            <Typography sx={typographyStyles.cardTitle}>
              User directory
            </Typography>
          }
          subheader={
            <Typography variant="caption" sx={typographyStyles.cardSubtitle}>
              Search by name or email. Click a user to view their profile.
            </Typography>
          }
          sx={{ px: 3, pt: 3, pb: 2 }}
        />
        <CardContent sx={{ px: 3, pb: 3 }}>
          <Box sx={{ mb: 2 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search users by name or email..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 18, color: "#71717A" }} />
                  </InputAdornment>
                ),
              }}
              sx={inputStyles.search}
            />
          </Box>

          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress size={32} sx={{ color: "#3B82F6" }} />
            </Box>
          ) : users.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Typography sx={{ color: "#71717A", fontFamily: "Inter" }}>
                No users found
              </Typography>
            </Box>
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={tableStyles.headerCell}>User</TableCell>
                    <TableCell sx={tableStyles.headerCell}>Role</TableCell>
                    <TableCell sx={tableStyles.headerCell}>Status</TableCell>
                    <TableCell sx={tableStyles.headerCell}>Created</TableCell>
                    <TableCell align="right" sx={tableStyles.headerCell}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow
                      key={user.id}
                      sx={tableStyles.row}
                      onClick={() => navigate(`/admin/users/${user.id}`)}
                    >
                      <TableCell sx={tableStyles.bodyCell}>
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
                          <Avatar
                            src={user.image}
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: "#1f2937",
                              fontSize: 14,
                              fontWeight: 600,
                              fontFamily: "Inter",
                            }}
                          >
                            {getInitials(user.name, user.email)}
                          </Avatar>
                          <Box>
                            <Typography
                              sx={{
                                color: "#FFFFFF",
                                fontSize: 14,
                                fontWeight: 500,
                                fontFamily: "Inter",
                              }}
                            >
                              {user.name || "Unnamed User"}
                            </Typography>
                            <Typography
                              sx={{
                                color: "#71717A",
                                fontSize: 12,
                                fontFamily: "Inter",
                              }}
                            >
                              {user.email}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell sx={tableStyles.bodyCell}>
                        <Chip
                          size="small"
                          label={user.role || "user"}
                          sx={getRoleChipStyle(user.role)}
                        />
                      </TableCell>
                      <TableCell sx={tableStyles.bodyCell}>
                        <Chip
                          size="small"
                          icon={
                            user.banned ? (
                              <BlockIcon sx={{ fontSize: 14 }} />
                            ) : (
                              <CheckCircleIcon sx={{ fontSize: 14 }} />
                            )
                          }
                          label={user.banned ? "Banned" : "Active"}
                          sx={getStatusChipStyle(
                            user.banned ? "banned" : "active"
                          )}
                        />
                      </TableCell>
                      <TableCell
                        sx={{ ...tableStyles.bodyCell, color: "#71717A" }}
                      >
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell align="right" sx={tableStyles.bodyCell}>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, user)}
                        >
                          <MoreVertIcon
                            sx={{ fontSize: 18, color: "#71717A" }}
                          />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, newPage) => setPage(newPage)}
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "#71717A",
                    fontFamily: "Inter",
                    "&.Mui-selected": {
                      bgcolor: "rgba(59, 130, 246, 0.2)",
                      color: "#3B82F6",
                    },
                  },
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: menuStyles.paper }}
      >
        <MenuItem onClick={handleViewProfile}>
          <PersonIcon sx={{ fontSize: 18, mr: 1.5, color: "#3B82F6" }} /> View
          profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            setRoleDialogOpen(true);
          }}
          disabled={selectedUser?.id === currentUser?.id}
          sx={{ opacity: selectedUser?.id === currentUser?.id ? 0.5 : 1 }}
        >
          <AdminPanelSettingsIcon
            sx={{ fontSize: 18, mr: 1.5, color: "#A855F7" }}
          />
          {selectedUser?.id === currentUser?.id
            ? "Change role (self)"
            : "Change role"}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setBanDialogOpen(true);
          }}
        >
          <BlockIcon
            sx={{
              fontSize: 18,
              mr: 1.5,
              color: selectedUser?.banned ? "#22C55E" : "#EF4444",
            }}
          />
          {selectedUser?.banned ? "Unban user" : "Ban user"}
        </MenuItem>
        <MenuItem onClick={handleImpersonate}>
          <PersonAddIcon sx={{ fontSize: 18, mr: 1.5, color: "#F97316" }} />{" "}
          Impersonate
        </MenuItem>
      </Menu>

      {/* Role Change Dialog */}
      <Dialog
        open={roleDialogOpen}
        onClose={() => setRoleDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: "#1A1D23",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 2,
            minWidth: 320,
          },
        }}
      >
        <DialogTitle
          sx={{ color: "#FFFFFF", fontFamily: "Inter", fontWeight: 600 }}
        >
          Change Role for {selectedUser?.name || selectedUser?.email}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1} sx={{ mt: 1 }}>
            {selectedUser?.id === currentUser?.id && (
              <Alert
                severity="warning"
                sx={{
                  mb: 2,
                  bgcolor: "rgba(245, 158, 11, 0.1)",
                  color: "#F59E0B",
                }}
              >
                You cannot change your own role.
              </Alert>
            )}
            {["super", "admin", "moderator", "user"].map((role) => (
              <Button
                key={role}
                fullWidth
                variant={selectedUser?.role === role ? "contained" : "outlined"}
                onClick={() => handleSetRole(role)}
                disabled={selectedUser?.id === currentUser?.id}
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "capitalize",
                  ...(selectedUser?.role === role
                    ? buttonStyles.primary
                    : buttonStyles.secondary),
                }}
              >
                {role}
              </Button>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setRoleDialogOpen(false)}
            sx={{ color: "#71717A" }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Ban Confirmation Dialog */}
      <Dialog
        open={banDialogOpen}
        onClose={() => setBanDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: "#1A1D23",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 2,
            minWidth: 320,
          },
        }}
      >
        <DialogTitle
          sx={{ color: "#FFFFFF", fontFamily: "Inter", fontWeight: 600 }}
        >
          {selectedUser?.banned ? "Unban User" : "Ban User"}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#71717A", fontFamily: "Inter" }}>
            {selectedUser?.banned
              ? `Are you sure you want to unban ${
                  selectedUser?.name || selectedUser?.email
                }?`
              : `Are you sure you want to ban ${
                  selectedUser?.name || selectedUser?.email
                }? This will revoke all their sessions.`}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setBanDialogOpen(false)}
            sx={{ color: "#71717A" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleBanUser}
            sx={
              selectedUser?.banned ? buttonStyles.primary : buttonStyles.danger
            }
          >
            {selectedUser?.banned ? "Unban" : "Ban"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
