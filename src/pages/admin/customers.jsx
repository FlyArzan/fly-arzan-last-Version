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
  Grid,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonIcon from "@mui/icons-material/Person";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import NotificationsIcon from "@mui/icons-material/Notifications";
import EmailIcon from "@mui/icons-material/Email";
import PeopleIcon from "@mui/icons-material/People";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SendIcon from "@mui/icons-material/Send";
import {
  useCustomers,
  useCustomerStats,
  useBanCustomer,
  useUnbanCustomer,
  useDeleteCustomer,
} from "@/hooks/useCustomers";
import {
  useSendNotification,
  useSendBulkNotification,
  useSendEmail,
  useSendBulkEmail,
} from "@/hooks/useNotifications";
import {
  cardStyles,
  inputStyles,
  tableStyles,
  typographyStyles,
  menuStyles,
  getStatusChipStyle,
  buttonStyles,
} from "./styles/dashboard-styles";

// Stats card component
const StatsCard = ({ title, value, icon: Icon, color }) => (
  <Card
    sx={{
      ...cardStyles.base,
      p: 2.5,
    }}
  >
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Box>
        <Typography
          sx={{ color: "#71717A", fontSize: 12, fontFamily: "Inter", mb: 0.5 }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            color: "#FFFFFF",
            fontSize: 24,
            fontWeight: 600,
            fontFamily: "Inter",
          }}
        >
          {value}
        </Typography>
      </Box>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          bgcolor: `${color}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon sx={{ color, fontSize: 20 }} />
      </Box>
    </Stack>
  </Card>
);

export default function Customers() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState([]);

  // Send notification/email modal state
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [notificationForm, setNotificationForm] = useState({
    title: "",
    message: "",
    type: "info",
  });
  const [emailForm, setEmailForm] = useState({
    subject: "",
    content: "",
  });

  // Fetch customers from backend
  const { data, isLoading, refetch, error } = useCustomers({
    page,
    limit: 20,
    search: query,
  });

  // Fetch customer stats
  const { data: stats } = useCustomerStats();

  const customers = data?.customers ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalCustomers = data?.total ?? 0;

  // Mutations
  const banCustomerMutation = useBanCustomer();
  const unbanCustomerMutation = useUnbanCustomer();
  const deleteCustomerMutation = useDeleteCustomer();

  // Notification/Email mutations
  const sendNotificationMutation = useSendNotification();
  const sendBulkNotificationMutation = useSendBulkNotification();
  const sendEmailMutation = useSendEmail();
  const sendBulkEmailMutation = useSendBulkEmail();

  // Bulk selection handlers
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIds(customers.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (customerId) => {
    setSelectedIds((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId]
    );
  };

  const isAllSelected =
    customers.length > 0 && selectedIds.length === customers.length;
  const isSomeSelected =
    selectedIds.length > 0 && selectedIds.length < customers.length;

  // Send notification handler
  const handleSendNotification = async () => {
    if (!notificationForm.title || !notificationForm.message) return;

    try {
      if (selectedIds.length === 1 && selectedCustomer) {
        // Single user
        await sendNotificationMutation.mutateAsync({
          userId: selectedCustomer.id,
          title: notificationForm.title,
          message: notificationForm.message,
          type: notificationForm.type,
        });
      } else if (selectedIds.length > 0) {
        // Bulk
        await sendBulkNotificationMutation.mutateAsync({
          userIds: selectedIds,
          title: notificationForm.title,
          message: notificationForm.message,
          type: notificationForm.type,
        });
      }
      setNotificationModalOpen(false);
      setNotificationForm({ title: "", message: "", type: "info" });
      setSelectedIds([]);
      setSelectedCustomer(null);
    } catch (err) {
      console.error("Send notification failed:", err);
    }
  };

  // Send email handler
  const handleSendEmail = async () => {
    if (!emailForm.subject || !emailForm.content) return;

    try {
      if (selectedIds.length === 1 && selectedCustomer) {
        // Single user
        await sendEmailMutation.mutateAsync({
          userId: selectedCustomer.id,
          subject: emailForm.subject,
          content: emailForm.content,
        });
      } else if (selectedIds.length > 0) {
        // Bulk
        await sendBulkEmailMutation.mutateAsync({
          userIds: selectedIds,
          subject: emailForm.subject,
          content: emailForm.content,
        });
      }
      setEmailModalOpen(false);
      setEmailForm({ subject: "", content: "" });
      setSelectedIds([]);
      setSelectedCustomer(null);
    } catch (err) {
      console.error("Send email failed:", err);
    }
  };

  // Open notification modal for single customer from menu
  const handleOpenNotificationModal = () => {
    if (selectedCustomer) {
      setSelectedIds([selectedCustomer.id]);
    }
    setNotificationModalOpen(true);
    handleMenuClose();
  };

  // Open email modal for single customer from menu
  const handleOpenEmailModal = () => {
    if (selectedCustomer) {
      setSelectedIds([selectedCustomer.id]);
    }
    setEmailModalOpen(true);
    handleMenuClose();
  };

  const handleMenuOpen = (event, customer) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedCustomer(customer);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCustomer(null);
  };

  const handleViewProfile = () => {
    if (selectedCustomer) {
      navigate(`/admin/customers/${selectedCustomer.id}`);
      handleMenuClose();
    }
  };

  const handleBanCustomer = async () => {
    if (selectedCustomer) {
      try {
        if (selectedCustomer.banned) {
          await unbanCustomerMutation.mutateAsync({
            customerId: selectedCustomer.id,
          });
        } else {
          await banCustomerMutation.mutateAsync({
            customerId: selectedCustomer.id,
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

  const handleDeleteCustomer = async () => {
    if (selectedCustomer) {
      try {
        await deleteCustomerMutation.mutateAsync({
          customerId: selectedCustomer.id,
        });
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
    setDeleteDialogOpen(false);
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
            Customers
          </Typography>
          <Typography variant="body2" sx={typographyStyles.pageSubtitle}>
            Manage customer accounts and communication preferences.
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
            label={`${totalCustomers} customers`}
            sx={{
              bgcolor: "rgba(34, 197, 94, 0.1)",
              color: "#22C55E",
              fontFamily: "Inter",
              fontWeight: 500,
            }}
          />
        </Stack>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={2}>
          <StatsCard
            title="Total Customers"
            value={stats?.totalCustomers ?? 0}
            icon={PeopleIcon}
            color="#3B82F6"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatsCard
            title="Verified"
            value={stats?.verifiedCustomers ?? 0}
            icon={VerifiedUserIcon}
            color="#22C55E"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatsCard
            title="Banned"
            value={stats?.bannedCustomers ?? 0}
            icon={BlockIcon}
            color="#EF4444"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatsCard
            title="Notifications On"
            value={stats?.wantsNotifications ?? 0}
            icon={NotificationsIcon}
            color="#F59E0B"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatsCard
            title="Newsletter"
            value={stats?.wantsNewsletter ?? 0}
            icon={EmailIcon}
            color="#A855F7"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatsCard
            title="New This Month"
            value={stats?.newThisMonth ?? 0}
            icon={TrendingUpIcon}
            color="#06B6D4"
          />
        </Grid>
      </Grid>

      {error && (
        <Alert
          severity="error"
          sx={{ bgcolor: "rgba(239, 68, 68, 0.1)", color: "#EF4444" }}
        >
          Failed to load customers: {error.message}
        </Alert>
      )}

      <Card sx={cardStyles.base}>
        <CardHeader
          title={
            <Typography sx={typographyStyles.cardTitle}>
              Customer Directory
            </Typography>
          }
          subheader={
            <Typography variant="caption" sx={typographyStyles.cardSubtitle}>
              Search by name or email. Click a customer to view their profile
              and preferences.
            </Typography>
          }
          sx={{ px: 3, pt: 3, pb: 2 }}
        />
        <CardContent sx={{ px: 3, pb: 3 }}>
          <Box
            sx={{
              mb: 2,
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <TextField
              size="small"
              placeholder="Search customers by name or email..."
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
              sx={{ ...inputStyles.search, flex: 1, minWidth: 200 }}
            />
            {/* Bulk Action Buttons */}
            {selectedIds.length > 0 && (
              <Stack direction="row" spacing={1}>
                <Chip
                  size="small"
                  label={`${selectedIds.length} selected`}
                  onDelete={() => setSelectedIds([])}
                  sx={{
                    bgcolor: "rgba(59, 130, 246, 0.1)",
                    color: "#3B82F6",
                    fontFamily: "Inter",
                  }}
                />
                <Button
                  size="small"
                  startIcon={<NotificationsIcon />}
                  onClick={() => setNotificationModalOpen(true)}
                  sx={buttonStyles.secondary}
                >
                  Send Notification
                </Button>
                <Button
                  size="small"
                  startIcon={<EmailIcon />}
                  onClick={() => setEmailModalOpen(true)}
                  sx={buttonStyles.secondary}
                >
                  Send Email
                </Button>
              </Stack>
            )}
          </Box>

          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress size={32} sx={{ color: "#3B82F6" }} />
            </Box>
          ) : customers.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Typography sx={{ color: "#71717A", fontFamily: "Inter" }}>
                No customers found
              </Typography>
            </Box>
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox" sx={tableStyles.headerCell}>
                      <Checkbox
                        checked={isAllSelected}
                        indeterminate={isSomeSelected}
                        onChange={handleSelectAll}
                        sx={{
                          color: "#71717A",
                          "&.Mui-checked": { color: "#3B82F6" },
                          "&.MuiCheckbox-indeterminate": { color: "#3B82F6" },
                        }}
                      />
                    </TableCell>
                    <TableCell sx={tableStyles.headerCell}>Customer</TableCell>
                    <TableCell sx={tableStyles.headerCell}>Status</TableCell>
                    <TableCell sx={tableStyles.headerCell}>
                      Notifications
                    </TableCell>
                    <TableCell sx={tableStyles.headerCell}>
                      Newsletter
                    </TableCell>
                    <TableCell sx={tableStyles.headerCell}>Joined</TableCell>
                    <TableCell align="right" sx={tableStyles.headerCell}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow
                      key={customer.id}
                      sx={{
                        ...tableStyles.row,
                        bgcolor: selectedIds.includes(customer.id)
                          ? "rgba(59, 130, 246, 0.05)"
                          : "transparent",
                      }}
                      onClick={() =>
                        navigate(`/admin/customers/${customer.id}`)
                      }
                    >
                      <TableCell padding="checkbox" sx={tableStyles.bodyCell}>
                        <Checkbox
                          checked={selectedIds.includes(customer.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectOne(customer.id);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          sx={{
                            color: "#71717A",
                            "&.Mui-checked": { color: "#3B82F6" },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={tableStyles.bodyCell}>
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
                          <Avatar
                            src={customer.image}
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: "#22C55E",
                              fontSize: 14,
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
                                fontSize: 14,
                                fontWeight: 500,
                                fontFamily: "Inter",
                              }}
                            >
                              {customer.name || "Unnamed Customer"}
                            </Typography>
                            <Typography
                              sx={{
                                color: "#71717A",
                                fontSize: 12,
                                fontFamily: "Inter",
                              }}
                            >
                              {customer.email}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell sx={tableStyles.bodyCell}>
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
                          sx={getStatusChipStyle(
                            customer.banned ? "banned" : "active"
                          )}
                        />
                      </TableCell>
                      <TableCell sx={tableStyles.bodyCell}>
                        <Chip
                          size="small"
                          label={
                            customer.wantsNotifications ? "Enabled" : "Disabled"
                          }
                          sx={{
                            bgcolor: customer.wantsNotifications
                              ? "rgba(34, 197, 94, 0.1)"
                              : "rgba(113, 113, 122, 0.1)",
                            color: customer.wantsNotifications
                              ? "#22C55E"
                              : "#71717A",
                            fontFamily: "Inter",
                            fontWeight: 500,
                            fontSize: 12,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={tableStyles.bodyCell}>
                        <Chip
                          size="small"
                          label={
                            customer.wantsNewsletter
                              ? "Subscribed"
                              : "Not Subscribed"
                          }
                          sx={{
                            bgcolor: customer.wantsNewsletter
                              ? "rgba(168, 85, 247, 0.1)"
                              : "rgba(113, 113, 122, 0.1)",
                            color: customer.wantsNewsletter
                              ? "#A855F7"
                              : "#71717A",
                            fontFamily: "Inter",
                            fontWeight: 500,
                            fontSize: 12,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{ ...tableStyles.bodyCell, color: "#71717A" }}
                      >
                        {customer.createdAt
                          ? new Date(customer.createdAt).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell align="right" sx={tableStyles.bodyCell}>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, customer)}
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
          onClick={handleOpenNotificationModal}
          disabled={!selectedCustomer?.wantsNotifications}
        >
          <NotificationsIcon
            sx={{
              fontSize: 18,
              mr: 1.5,
              color: selectedCustomer?.wantsNotifications
                ? "#F59E0B"
                : "#71717A",
            }}
          />
          Send notification
          {!selectedCustomer?.wantsNotifications && (
            <Chip
              size="small"
              label="Disabled"
              sx={{
                ml: 1,
                fontSize: 10,
                height: 18,
                bgcolor: "rgba(113, 113, 122, 0.2)",
                color: "#71717A",
              }}
            />
          )}
        </MenuItem>
        <MenuItem
          onClick={handleOpenEmailModal}
          disabled={!selectedCustomer?.wantsNewsletter}
        >
          <EmailIcon
            sx={{
              fontSize: 18,
              mr: 1.5,
              color: selectedCustomer?.wantsNewsletter ? "#A855F7" : "#71717A",
            }}
          />
          Send email
          {!selectedCustomer?.wantsNewsletter && (
            <Chip
              size="small"
              label="Disabled"
              sx={{
                ml: 1,
                fontSize: 10,
                height: 18,
                bgcolor: "rgba(113, 113, 122, 0.2)",
                color: "#71717A",
              }}
            />
          )}
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
              color: selectedCustomer?.banned ? "#22C55E" : "#EF4444",
            }}
          />
          {selectedCustomer?.banned ? "Unban customer" : "Ban customer"}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setDeleteDialogOpen(true);
          }}
          sx={{ color: "#EF4444" }}
        >
          <DeleteIcon sx={{ fontSize: 18, mr: 1.5, color: "#EF4444" }} />
          Delete customer
        </MenuItem>
      </Menu>

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
          {selectedCustomer?.banned ? "Unban Customer" : "Ban Customer"}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#71717A", fontFamily: "Inter" }}>
            {selectedCustomer?.banned
              ? `Are you sure you want to unban ${
                  selectedCustomer?.name || selectedCustomer?.email
                }?`
              : `Are you sure you want to ban ${
                  selectedCustomer?.name || selectedCustomer?.email
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
            onClick={handleBanCustomer}
            sx={
              selectedCustomer?.banned
                ? buttonStyles.primary
                : buttonStyles.danger
            }
          >
            {selectedCustomer?.banned ? "Unban" : "Ban"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
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
          Delete Customer
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#71717A", fontFamily: "Inter" }}>
            Are you sure you want to permanently delete{" "}
            <strong>{selectedCustomer?.name || selectedCustomer?.email}</strong>
            ? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: "#71717A" }}
          >
            Cancel
          </Button>
          <Button onClick={handleDeleteCustomer} sx={buttonStyles.danger}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Send Notification Modal */}
      <Dialog
        open={notificationModalOpen}
        onClose={() => {
          setNotificationModalOpen(false);
          setNotificationForm({ title: "", message: "", type: "info" });
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "#1A1D23",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle
          sx={{ color: "#FFFFFF", fontFamily: "Inter", fontWeight: 600 }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <NotificationsIcon sx={{ color: "#F59E0B" }} />
            <span>Send Notification</span>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#71717A", fontFamily: "Inter", mb: 2 }}>
            {selectedIds.length === 1
              ? "Send a notification to this customer."
              : `Send a notification to ${selectedIds.length} selected customers.`}
          </Typography>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Title"
              placeholder="Enter notification title..."
              value={notificationForm.title}
              onChange={(e) =>
                setNotificationForm((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              sx={inputStyles.dark}
            />
            <TextField
              fullWidth
              label="Message"
              placeholder="Write your notification message..."
              multiline
              rows={4}
              value={notificationForm.message}
              onChange={(e) =>
                setNotificationForm((prev) => ({
                  ...prev,
                  message: e.target.value,
                }))
              }
              sx={inputStyles.dark}
            />
            <FormControl fullWidth sx={inputStyles.dark}>
              <InputLabel sx={{ color: "#71717A" }}>Type</InputLabel>
              <Select
                value={notificationForm.type}
                label="Type"
                onChange={(e) =>
                  setNotificationForm((prev) => ({
                    ...prev,
                    type: e.target.value,
                  }))
                }
                sx={{ color: "#FFFFFF" }}
              >
                <MenuItem value="info">Info</MenuItem>
                <MenuItem value="warning">Warning</MenuItem>
                <MenuItem value="promo">Promo</MenuItem>
                <MenuItem value="system">System</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setNotificationModalOpen(false);
              setNotificationForm({ title: "", message: "", type: "info" });
            }}
            sx={{ color: "#71717A" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendNotification}
            disabled={
              !notificationForm.title ||
              !notificationForm.message ||
              sendNotificationMutation.isPending ||
              sendBulkNotificationMutation.isPending
            }
            startIcon={<SendIcon />}
            sx={buttonStyles.primary}
          >
            {sendNotificationMutation.isPending ||
            sendBulkNotificationMutation.isPending
              ? "Sending..."
              : "Send Notification"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Send Email Modal */}
      <Dialog
        open={emailModalOpen}
        onClose={() => {
          setEmailModalOpen(false);
          setEmailForm({ subject: "", content: "" });
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "#1A1D23",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle
          sx={{ color: "#FFFFFF", fontFamily: "Inter", fontWeight: 600 }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <EmailIcon sx={{ color: "#A855F7" }} />
            <span>Send Email</span>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#71717A", fontFamily: "Inter", mb: 2 }}>
            {selectedIds.length === 1
              ? "Send an email to this customer."
              : `Send an email to ${selectedIds.length} selected customers.`}
          </Typography>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Subject"
              placeholder="Enter email subject..."
              value={emailForm.subject}
              onChange={(e) =>
                setEmailForm((prev) => ({ ...prev, subject: e.target.value }))
              }
              sx={inputStyles.dark}
            />
            <TextField
              fullWidth
              label="Content"
              placeholder="Write your email content..."
              multiline
              rows={6}
              value={emailForm.content}
              onChange={(e) =>
                setEmailForm((prev) => ({ ...prev, content: e.target.value }))
              }
              sx={inputStyles.dark}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setEmailModalOpen(false);
              setEmailForm({ subject: "", content: "" });
            }}
            sx={{ color: "#71717A" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendEmail}
            disabled={
              !emailForm.subject ||
              !emailForm.content ||
              sendEmailMutation.isPending ||
              sendBulkEmailMutation.isPending
            }
            startIcon={<SendIcon />}
            sx={buttonStyles.primary}
          >
            {sendEmailMutation.isPending || sendBulkEmailMutation.isPending
              ? "Sending..."
              : "Send Email"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
