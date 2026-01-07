import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Stack,
  Grid,
  TextField,
  Select,
  MenuItem,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import DevicesIcon from "@mui/icons-material/Devices";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import TabletIcon from "@mui/icons-material/Tablet";
import LocationIcon from "@mui/icons-material/LocationOn";
import ShieldIcon from "@mui/icons-material/Shield";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// Import consistent styles
import {
  cardStyles,
  tableStyles,
  typographyStyles,
  inputStyles,
  selectStyles,
  buttonStyles,
} from "../styles/dashboard-styles";

// Mock Data - In production, this would come from better-auth admin.listUserSessions
const mockSessions = [
  {
    id: 1,
    user: "john.doe@example.com",
    device: "Desktop",
    browser: "Chrome 120",
    os: "Windows 11",
    location: "New York, USA",
    ip: "192.168.1.100",
    lastActive: "2 minutes ago",
    status: "active",
    loginTime: "2024-01-15 09:30:00",
  },
  {
    id: 2,
    user: "jane.smith@example.com",
    device: "Mobile",
    browser: "Safari 17",
    os: "iOS 17.2",
    location: "London, UK",
    ip: "10.0.0.45",
    lastActive: "5 minutes ago",
    status: "active",
    loginTime: "2024-01-15 10:15:00",
  },
  {
    id: 3,
    user: "bob.wilson@example.com",
    device: "Tablet",
    browser: "Firefox 121",
    os: "Android 14",
    location: "Tokyo, Japan",
    ip: "172.16.0.23",
    lastActive: "15 minutes ago",
    status: "active",
    loginTime: "2024-01-15 08:45:00",
  },
  {
    id: 4,
    user: "alice.johnson@example.com",
    device: "Desktop",
    browser: "Edge 120",
    os: "Windows 10",
    location: "Sydney, Australia",
    ip: "192.168.2.50",
    lastActive: "1 hour ago",
    status: "idle",
    loginTime: "2024-01-15 07:20:00",
  },
  {
    id: 5,
    user: "charlie.brown@example.com",
    device: "Mobile",
    browser: "Chrome 120",
    os: "Android 13",
    location: "Toronto, Canada",
    ip: "10.1.1.100",
    lastActive: "3 hours ago",
    status: "idle",
    loginTime: "2024-01-15 06:00:00",
  },
];

const mockDeviceStats = [
  { name: "Desktop", value: 1245, color: "#3b82f6" },
  { name: "Mobile", value: 892, color: "#22c55e" },
  { name: "Tablet", value: 234, color: "#f59e0b" },
];

const mockSessionsByHour = [
  { hour: "00:00", sessions: 45 },
  { hour: "04:00", sessions: 23 },
  { hour: "08:00", sessions: 156 },
  { hour: "12:00", sessions: 234 },
  { hour: "16:00", sessions: 189 },
  { hour: "20:00", sessions: 123 },
  { hour: "23:59", sessions: 67 },
];

export default function Sessions() {
  const [filterDevice, setFilterDevice] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSessions = mockSessions.filter((session) => {
    const matchesDevice = filterDevice === "all" || session.device.toLowerCase() === filterDevice;
    const matchesStatus = filterStatus === "all" || session.status === filterStatus;
    const matchesSearch =
      session.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.ip.includes(searchQuery);
    return matchesDevice && matchesStatus && matchesSearch;
  });

  const getDeviceIcon = (device) => {
    const iconProps = { sx: { fontSize: 18 }, color: "inherit" };
    switch (device.toLowerCase()) {
      case "desktop":
        return <DevicesIcon {...iconProps} />;
      case "mobile":
        return <SmartphoneIcon {...iconProps} />;
      case "tablet":
        return <TabletIcon {...iconProps} />;
      default:
        return <DevicesIcon {...iconProps} />;
    }
  };

  const activeCount = mockSessions.filter((s) => s.status === "active").length;
  const totalSessions = mockSessions.length;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
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
            Active Sessions
          </Typography>
          <Typography variant="body2" sx={typographyStyles.pageSubtitle}>
            Monitor and manage user sessions across devices and locations.
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          startIcon={<ShieldIcon sx={{ fontSize: 18 }} />}
          sx={buttonStyles.primary}
        >
          Security Settings
        </Button>
      </Box>

      {/* Session Statistics */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6} sx={{ minWidth: 0 }}>
          <Card sx={cardStyles.base}>
            <CardHeader
              title={
                <Typography sx={{ color: "#71717A", fontSize: 13, fontFamily: "Inter" }}>Active Sessions</Typography>
              }
              sx={{ px: 2.25, pt: 2.25, pb: 1 }}
            />
            <CardContent sx={{ px: 2.25, pb: 2.25 }}>
              <Typography sx={{ color: "#FFFFFF", fontSize: 28, fontWeight: 700, fontFamily: "Inter" }}>
                {activeCount}
              </Typography>
              <Typography sx={{ color: "#22C55E", fontSize: 12, mt: 0.5, fontFamily: "Inter" }}>
                Out of {totalSessions} total sessions
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} sx={{ minWidth: 0 }}>
          <Card sx={cardStyles.base}>
            <CardHeader
              title={
                <Typography sx={{ color: "#9ca3af", fontSize: 13 }}>Sessions by Device</Typography>
              }
              sx={{ px: 2.25, pt: 2.25, pb: 1 }}
            />
            <CardContent sx={{ px: 2.25, pb: 2.25 }}>
              <Box sx={{ height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockDeviceStats}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={2}
                      label={({ name, value }) => `${name} ${value}`}
                    >
                      {mockDeviceStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#0A0A0A", border: "1px solid #262626" }} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Sessions Chart */}
      <Card sx={cardStyles.base}>
        <CardHeader
          title={<Typography sx={typographyStyles.cardTitle}>Sessions by Hour</Typography>}
          subheader={
            <Typography variant="caption" sx={typographyStyles.cardSubtitle}>
              Active session count throughout the day.
            </Typography>
          }
          sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <Box sx={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockSessionsByHour}>
                <CartesianGrid strokeDasharray="3 3" stroke="#202020" />
                <XAxis dataKey="hour" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: "#0A0A0A", border: "1px solid #262626" }} />
                <Bar dataKey="sessions" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      {/* Filters & Sessions Table */}
      <Card sx={cardStyles.base}>
        <CardHeader
          title={<Typography sx={typographyStyles.cardTitle}>Active User Sessions</Typography>}
          subheader={
            <Typography variant="caption" sx={typographyStyles.cardSubtitle}>
              Monitor user activity, devices, and locations.
            </Typography>
          }
          sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <Stack spacing={2} sx={{ mb: 2.5 }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems="center">
              <TextField
                size="small"
                fullWidth
                placeholder="Search by email, IP or location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ fontSize: 18, mr: 1, color: "#71717A" }} />,
                }}
                sx={inputStyles.search}
              />
              <Select
                size="small"
                value={filterDevice}
                onChange={(e) => setFilterDevice(e.target.value)}
                sx={selectStyles.base}
                MenuProps={selectStyles.menuProps}
              >
                <MenuItem value="all">All Devices</MenuItem>
                <MenuItem value="desktop">Desktop</MenuItem>
                <MenuItem value="mobile">Mobile</MenuItem>
                <MenuItem value="tablet">Tablet</MenuItem>
              </Select>
              <Select
                size="small"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                sx={selectStyles.base}
                MenuProps={selectStyles.menuProps}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="idle">Idle</MenuItem>
              </Select>
            </Stack>
          </Stack>

          <Box sx={{ overflowX: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={tableStyles.headerCell}>User</TableCell>
                  <TableCell sx={tableStyles.headerCell}>Device</TableCell>
                  <TableCell sx={tableStyles.headerCell}>Browser</TableCell>
                  <TableCell sx={tableStyles.headerCell}>Location</TableCell>
                  <TableCell sx={{ color: "#9ca3af", borderColor: "#262626", fontSize: 12 }}>Status</TableCell>
                  <TableCell sx={{ color: "#9ca3af", borderColor: "#262626", fontSize: 12 }}>Last Active</TableCell>
                  <TableCell align="right" sx={{ color: "#9ca3af", borderColor: "#262626", fontSize: 12 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSessions.map((session) => (
                  <TableRow key={session.id} sx={{ "&:hover": { bgcolor: "rgba(37,99,235,0.1)" } }}>
                    <TableCell sx={{ borderColor: "#262626", color: "#e5e7eb", fontSize: 13 }}>
                      {session.user}
                    </TableCell>
                    <TableCell sx={{ borderColor: "#262626", fontSize: 13 }}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Box sx={{ color: "#60a5fa" }}>{getDeviceIcon(session.device)}</Box>
                        <Typography sx={{ color: "#e5e7eb" }}>{session.device}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ borderColor: "#262626", color: "#e5e7eb", fontSize: 13 }}>
                      {session.browser}
                    </TableCell>
                    <TableCell sx={{ borderColor: "#262626", color: "#e5e7eb", fontSize: 13 }}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <LocationIcon sx={{ fontSize: 16, color: "#9ca3af" }} />
                        {session.location}
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ borderColor: "#262626" }}>
                      <Chip
                        size="small"
                        label={session.status}
                        sx={{
                          bgcolor: session.status === "active" ? "rgba(74,222,128,0.2)" : "rgba(156,163,175,0.2)",
                          color: session.status === "active" ? "#4ade80" : "#9ca3af",
                          borderRadius: 999,
                          fontSize: 11,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ borderColor: "#262626", color: "#9ca3af", fontSize: 13 }}>
                      {session.lastActive}
                    </TableCell>
                    <TableCell align="right" sx={{ borderColor: "#262626" }}>
                      <IconButton
                        size="small"
                        sx={{ color: "#f97316" }}
                        title="Terminate session"
                      >
                        <CloseIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
