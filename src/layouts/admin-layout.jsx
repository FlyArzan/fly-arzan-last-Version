import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSession, useSignOut } from "@/hooks/useAuth";
import {
  AppBar,
  Toolbar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  QueryStats as QueryStatsIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  ListAlt as ListAltIcon,
  MonitorHeart as MonitorHeartIcon,
  WarningAmber as WarningAmberIcon,
  BugReport as BugReportIcon,
  People as PeopleIcon,
  PersonOutline as PersonOutlineIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Feedback as FeedbackIcon,
  Description as DescriptionIcon,
  HelpCenter as HelpCenterIcon,
  PrivacyTip as PrivacyTipIcon,
  ContactPage as ContactPageIcon,
  Public as PublicIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { useUnreadCount } from "@/hooks/useNotifications";

const drawerWidth = 280;

const navSections = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        icon: DashboardIcon,
        path: "/admin",
      },
    ],
  },
  {
    title: "CMS",
    items: [
      { label: "About Us", icon: DescriptionIcon, path: "/admin/cms/about-us" },
      { label: "FAQ", icon: HelpCenterIcon, path: "/admin/cms/faq" },
      {
        label: "Privacy Policy",
        icon: PrivacyTipIcon,
        path: "/admin/cms/privacy-policy",
      },
      {
        label: "Terms & Conditions",
        icon: DescriptionIcon,
        path: "/admin/cms/terms-conditions",
      },
      { label: "Contact", icon: ContactPageIcon, path: "/admin/cms/contact" },
      {
        label: "Visa Requirements",
        icon: PublicIcon,
        path: "/admin/cms/visa-requirements",
      },
      {
        label: "COVID-19 Info",
        icon: PublicIcon,
        path: "/admin/cms/covid-19",
      },
      {
        label: "Airport Info",
        icon: PublicIcon,
        path: "/admin/cms/airport",
      },
    ],
  },
  {
    title: "Analytics",
    items: [
      {
        label: "Search Analytics",
        icon: QueryStatsIcon,
        path: "/admin/analytics/engagement",
      },
      {
        label: "Routes Analytics",
        icon: BarChartIcon,
        path: "/admin/analytics/routes",
      },
      {
        label: "Trend Charts",
        icon: TimelineIcon,
        path: "/admin/analytics/trends",
      },
      {
        label: "Search Logs",
        icon: ListAltIcon,
        path: "/admin/logs",
      },
    ],
  },
  {
    title: "Monitoring",
    items: [
      {
        label: "API Health",
        icon: MonitorHeartIcon,
        path: "/admin/monitoring/health",
      },
      {
        label: "Alerts",
        icon: WarningAmberIcon,
        path: "/admin/monitoring/alerts",
      },
      {
        label: "System Logs",
        icon: BugReportIcon,
        path: "/admin/monitoring/logs",
      },
    ],
  },
  {
    title: "Users & Access",
    items: [
      {
        label: "Users",
        icon: PeopleIcon,
        path: "/admin/users",
      },
      {
        label: "Customers",
        icon: PersonOutlineIcon,
        path: "/admin/customers",
      },
      {
        label: "User Sessions",
        icon: SecurityIcon,
        path: "/admin/auth/sessions",
      },
      {
        label: "Email Campaigns",
        icon: EmailIcon,
        path: "/admin/email-campaigns",
      },
      {
        label: "Roles & Permissions",
        icon: SecurityIcon,
        path: "/admin/roles",
      },
    ],
  },
  {
    title: "Other",
    items: [
      {
        label: "Feedback",
        icon: FeedbackIcon,
        path: "/admin/feedback",
      },
      {
        label: "Settings",
        icon: SettingsIcon,
        path: "/admin/settings",
      },
    ],
  },
];

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const navigate = useNavigate();

  // Get session and sign out mutation
  const { data: session } = useSession();
  const signOutMutation = useSignOut();
  const { data: unreadCount = 0 } = useUnreadCount();

  const user = session?.user;
  const userName = user?.name || "Admin User";
  const userEmail = user?.email || "admin@flyarzan.com";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    signOutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/Login");
      },
    });
  };

  const drawer = <AdminLayoutDrawer onItemClick={() => setMobileOpen(false)} />;

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#0B0F16",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <CssBaseline />

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          ml: { md: `${drawerWidth}px` },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          bgcolor: "#1A1D23",
          backgroundImage: "none",
          backdropFilter: "none",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ minHeight: 64, px: 3 }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ flex: 1 }}
          >
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            {/* Notification Bell */}
            <IconButton
              color="inherit"
              onClick={() => navigate("/admin/notifications")}
              sx={{ position: "relative" }}
            >
              <NotificationsIcon sx={{ color: "#A1A1AA" }} />
              {unreadCount > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    width: 18,
                    height: 18,
                    bgcolor: "#EF4444",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#fff",
                  }}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Box>
              )}
            </IconButton>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#FFFFFF",
                    fontWeight: 500,
                    fontFamily: "Inter",
                  }}
                >
                  {userName}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#71717A", fontFamily: "Inter" }}
                >
                  {userEmail}
                </Typography>
              </Box>
              <IconButton
                color="inherit"
                onClick={handleProfileMenuOpen}
                sx={{ ml: 0.5 }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: "#1f2937",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {userInitials}
                </Avatar>
              </IconButton>
            </Stack>
            <Menu
              anchorEl={profileAnchorEl}
              open={Boolean(profileAnchorEl)}
              onClose={handleProfileMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 260,
                  bgcolor: "#1A1D23",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 2,
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  handleProfileMenuClose();
                  navigate("/admin/profile");
                }}
              >
                Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleProfileMenuClose();
                  navigate("/admin/settings");
                }}
              >
                Settings
              </MenuItem>
              <Divider sx={{ borderColor: "rgba(31,41,55,0.9)" }} />
              <MenuItem onClick={handleLogout}>Log out</MenuItem>
            </Menu>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: "1px solid rgba(255, 255, 255, 0.08)",
              bgcolor: "#1A1D23",
              backgroundImage: "none",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          pt: 10,
          bgcolor: "#000000",
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.02) 0%, transparent 50%)",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

const AdminLayoutDrawer = ({ onItemClick = () => {} }) => {
  const location = useLocation();

  const isActivePath = (path) => {
    if (path === "/admin") {
      return (
        location.pathname === "/admin" ||
        location.pathname === "/admin/dashboard"
      );
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#1A1D23",
        color: "#FFFFFF",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 64,
          px: 2,
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Link
          to="/admin"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          <img src="/logo.png" alt="Logo" style={{ height: 32 }} />
        </Link>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", py: 2 }}>
        {navSections.map((section) => (
          <Box key={section.title} sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              sx={{
                px: 3,
                mb: 0.5,
                display: "block",
                textTransform: "uppercase",
                letterSpacing: 0.8,
                color: "#71717A",
                fontFamily: "Inter",
              }}
            >
              {section.title}
            </Typography>
            <List disablePadding>
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActivePath(item.path);
                return (
                  <ListItemButton
                    key={item.path}
                    component={Link}
                    to={item.path}
                    sx={{
                      mx: 2,
                      mb: 0.5,
                      borderRadius: 1.5,
                      px: 2,
                      py: 1.25,
                      background: active
                        ? "linear-gradient(90deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05))"
                        : "transparent",
                      "& .MuiListItemIcon-root": {
                        color: active ? "#3B82F6" : "#71717A",
                        minWidth: 20,
                        mr: 1.5,
                      },
                      "& .MuiTypography-root": {
                        color: active ? "#FFFFFF" : "#A1A1AA",
                        fontWeight: active ? 500 : 400,
                        fontFamily: "Inter",
                        fontSize: "0.875rem",
                      },
                      "&:hover": {
                        background: active
                          ? "linear-gradient(90deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.08))"
                          : "rgba(255, 255, 255, 0.05)",
                      },
                      "&:hover .MuiTypography-root": { color: "#FFFFFF" },
                      "&:hover .MuiListItemIcon-root": { color: "#3B82F6" },
                      transition: "all 0.2s ease-in-out",
                    }}
                    onClick={onItemClick}
                  >
                    <ListItemIcon>
                      <Icon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      sx={{
                        "& .MuiTypography-root": {
                          fontFamily: "Inter",
                          fontSize: "0.875rem",
                          fontWeight: active ? 500 : 400,
                        },
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AdminLayout;
