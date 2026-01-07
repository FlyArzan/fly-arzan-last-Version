import { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Stack,
  Chip,
  TextField,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { useSystemLogs, useSystemLogStats } from "@/hooks/useSystemLogs";


export default function SystemLogs() {
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterService, setFilterService] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("today");

  // Fetch real data from backend
  const { data: logsData, isLoading, error } = useSystemLogs({
    limit: 50,
    offset: 0,
    level: filterLevel,
    service: filterService,
    search: searchQuery,
  });

  const { data: statsData } = useSystemLogStats();

  const logs = logsData?.logs || [];
  const logStats = statsData || { total: 0, errors: 0, warnings: 0, info: 0 };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Failed to load system logs. Please try again later.</Alert>
      </Box>
    );
  }

  const levelColor = (level) => {
    switch (level) {
      case "error":
        return { bg: "#3b1612", color: "#fecaca", icon: <ErrorIcon sx={{ fontSize: 18, color: "#f97316" }} /> };
      case "warning":
        return {
          bg: "#2b2413",
          color: "#fde68a",
          icon: <WarningAmberIcon sx={{ fontSize: 18, color: "#facc15" }} />,
        };
      case "info":
        return { bg: "#112031", color: "#bfdbfe", icon: <InfoIcon sx={{ fontSize: 18, color: "#60a5fa" }} /> };
      case "success":
        return {
          bg: "#1a2e1f",
          color: "#bbf7d0",
          icon: <CheckCircleIcon sx={{ fontSize: 18, color: "#4ade80" }} />,
        };
      default:
        return {
          bg: "#1f2933",
          color: "#e5e7eb",
          icon: <DescriptionIcon sx={{ fontSize: 18, color: "#9ca3af" }} />,
        };
    }
  };

  const handleExport = () => {
    console.log("Exporting logs");
  };

  const services = [...new Set(logs.map((log) => log.service))];

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
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#FFFFFF", fontFamily: "Inter, sans-serif" }}>
            System logs
          </Typography>
          <Typography variant="body2" sx={{ color: "#71717A", mt: 0.5, fontFamily: "Inter, sans-serif" }}>
            Explore backend and infrastructure logs for debugging and audits.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          onClick={handleExport}
          sx={{
            textTransform: "none",
            borderColor: "#30363d",
            color: "#e5e7eb",
          }}
        >
          <DownloadIcon sx={{ fontSize: 18, mr: 1 }} /> Export logs
        </Button>
      </Box>

      {/* Statistics row */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={3} sx={{ minWidth: 0 }}>
          <Card sx={{ borderRadius: 2, bgcolor: "#1A1D23", background: "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0.02) 100%)", border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)" }}>
            <CardHeader
              title={
                <Typography sx={{ color: "#9ca3af", fontSize: 12 }}>Total logs (24h)</Typography>
              }
              sx={{ px: 2.25, pt: 2.25, pb: 0.75 }}
            />
            <CardContent sx={{ px: 2.25, pb: 2.25 }}>
              <Typography sx={{ color: "#e5e7eb", fontSize: 24, fontWeight: 700 }}>
                {logStats.total.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3} sx={{ minWidth: 0 }}>
          <Card sx={{ borderRadius: 2, bgcolor: "#1A1D23", background: "linear-gradient(135deg, rgba(251, 113, 133, 0.05) 0%, rgba(251, 113, 133, 0.02) 100%)", border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)" }}>
            <CardHeader
              title={<Typography sx={{ color: "#9ca3af", fontSize: 12 }}>Errors</Typography>}
              sx={{ px: 2.25, pt: 2.25, pb: 0.75 }}
            />
            <CardContent sx={{ px: 2.25, pb: 2.25 }}>
              <Typography sx={{ color: "#e5e7eb", fontSize: 24, fontWeight: 700 }}>
                {logStats.errors.toLocaleString()}
              </Typography>
              <Typography sx={{ color: "#f97316", fontSize: 11, mt: 0.5 }}>
                {logStats.total > 0 ? ((logStats.errors / logStats.total) * 100).toFixed(2) : 0}% of total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3} sx={{ minWidth: 0 }}>
          <Card sx={{ borderRadius: 2, bgcolor: "#1A1D23", background: "linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(245, 158, 11, 0.02) 100%)", border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)" }}>
            <CardHeader
              title={<Typography sx={{ color: "#9ca3af", fontSize: 12 }}>Warnings</Typography>}
              sx={{ px: 2.25, pt: 2.25, pb: 0.75 }}
            />
            <CardContent sx={{ px: 2.25, pb: 2.25 }}>
              <Typography sx={{ color: "#e5e7eb", fontSize: 24, fontWeight: 700 }}>
                {logStats.warnings.toLocaleString()}
              </Typography>
              <Typography sx={{ color: "#facc15", fontSize: 11, mt: 0.5 }}>
                {logStats.total > 0 ? ((logStats.warnings / logStats.total) * 100).toFixed(2) : 0}% of total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3} sx={{ minWidth: 0 }}>
          <Card sx={{ borderRadius: 2, bgcolor: "#1A1D23", background: "linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(34, 197, 94, 0.02) 100%)", border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)" }}>
            <CardHeader
              title={
                <Typography sx={{ color: "#9ca3af", fontSize: 12 }}>Info</Typography>
              }
              sx={{ px: 2.25, pt: 2.25, pb: 0.75 }}
            />
            <CardContent sx={{ px: 2.25, pb: 2.25 }}>
              <Typography sx={{ color: "#e5e7eb", fontSize: 24, fontWeight: 700 }}>
                {logStats.info.toLocaleString()}
              </Typography>
              <Typography sx={{ color: "#60a5fa", fontSize: 11, mt: 0.5 }}>
                {logStats.total > 0 ? ((logStats.info / logStats.total) * 100).toFixed(2) : 0}% of total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters + list */}
      <Card sx={{ borderRadius: 2, bgcolor: "#1A1D23", background: "linear-gradient(135deg, rgba(147, 51, 234, 0.05) 0%, rgba(147, 51, 234, 0.02) 100%)", border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)" }}>
        <CardHeader
          title={
            <Typography sx={{ color: "#e5e7eb", fontWeight: 600 }}>Log entries</Typography>
          }
          subheader={
            <Typography variant="caption" sx={{ color: "#9ca3af" }}>
              Filter and search through system logs.
            </Typography>
          }
          sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          {/* Filters */}
          <Stack spacing={2} sx={{ mb: 2 }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems="center">
              <Box sx={{ flex: 1, width: "100%" }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search logs by message, details or service"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ fontSize: 18, color: "#6b7280", mr: 1 }} />,
                    sx: {
                      bgcolor: "#0B0F16",
                      borderRadius: 999,
                      fontSize: 13,
                      color: "#FFFFFF",
                      fontFamily: "Inter, sans-serif",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    },
                  }}
                />
              </Box>
              <Stack direction="row" spacing={1.5} sx={{ width: { xs: "100%", md: "auto" } }}>
                <Select
                  size="small"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  displayEmpty
                  sx={{
                    minWidth: 140,
                    bgcolor: "#0B0F16",
                    color: "#FFFFFF",
                    fontSize: 13,
                    fontFamily: "Inter, sans-serif",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: 1,
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  }}
                >
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="yesterday">Yesterday</MenuItem>
                  <MenuItem value="7days">Last 7 days</MenuItem>
                  <MenuItem value="30days">Last 30 days</MenuItem>
                </Select>
                <Select
                  size="small"
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  displayEmpty
                  sx={{
                    minWidth: 120,
                    bgcolor: "#0B0F16",
                    color: "#FFFFFF",
                    fontSize: 13,
                    fontFamily: "Inter, sans-serif",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: 1,
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  }}
                >
                  <MenuItem value="all">All levels</MenuItem>
                  <MenuItem value="error">Error</MenuItem>
                  <MenuItem value="warning">Warning</MenuItem>
                  <MenuItem value="info">Info</MenuItem>
                </Select>
                <Select
                  size="small"
                  value={filterService}
                  onChange={(e) => setFilterService(e.target.value)}
                  displayEmpty
                  sx={{
                    minWidth: 150,
                    bgcolor: "#0B0F16",
                    color: "#FFFFFF",
                    fontSize: 13,
                    fontFamily: "Inter, sans-serif",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: 1,
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  }}
                >
                  <MenuItem value="all">All services</MenuItem>
                  {services.map((service) => (
                    <MenuItem key={service} value={service}>
                      {service}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Stack>
          </Stack>

          {/* Logs list */}
          {logs.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <DescriptionIcon sx={{ fontSize: 40, color: "#4b5563", mb: 1 }} />
              <Typography sx={{ color: "#e5e7eb", fontWeight: 500 }}>No logs found</Typography>
              <Typography sx={{ color: "#9ca3af", fontSize: 13 }}>
                Try adjusting your filters or search query.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1.5}>
              {logs.map((log) => {
                const meta = levelColor(log.level);
                return (
                  <Box
                    key={log.id}
                    sx={{
                      p: 1.75,
                      borderRadius: 2,
                      bgcolor: "#101010",
                      border: "1px solid #262626",
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                      {meta.icon}
                      <Box sx={{ flex: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                          <Typography
                            sx={{
                              color: "#9ca3af",
                              fontSize: 11,
                              fontFamily: "monospace",
                            }}
                          >
                            {log.timestamp}
                          </Typography>
                          <Chip
                            label={log.level.toUpperCase()}
                            size="small"
                            sx={{
                              bgcolor: meta.bg,
                              color: meta.color,
                              borderRadius: 999,
                              fontSize: 10,
                            }}
                          />
                          <Chip
                            label={log.service}
                            size="small"
                            sx={{
                              bgcolor: "#1f2933",
                              color: "#e5e7eb",
                              borderRadius: 999,
                              fontSize: 10,
                            }}
                          />
                        </Stack>
                        <Typography sx={{ color: "#e5e7eb", fontSize: 14, fontWeight: 500 }}>
                          {log.message}
                        </Typography>
                        <Typography sx={{ color: "#9ca3af", fontSize: 13, mt: 0.5 }}>
                          {log.details}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 0.75 }}>
                          <Typography sx={{ color: "#6b7280", fontSize: 11 }}>
                            User: {log.user}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>
                );
              })}
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* Quick actions */}
      <Card sx={{ borderRadius: 2, bgcolor: "#1A1D23", background: "linear-gradient(135deg, rgba(168, 85, 247, 0.05) 0%, rgba(168, 85, 247, 0.02) 100%)", border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)" }}>
        <CardHeader
          title={
            <Typography sx={{ color: "#e5e7eb", fontWeight: 600 }}>Quick actions</Typography>
          }
          subheader={
            <Typography variant="caption" sx={{ color: "#9ca3af" }}>
              Common log management tasks.
            </Typography>
          }
          sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={4}>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  justifyContent: "flex-start",
                  borderColor: "#30363d",
                  color: "#e5e7eb",
                  textTransform: "none",
                }}
              >
                <DownloadIcon sx={{ fontSize: 18, mr: 1 }} /> Download all logs
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  justifyContent: "flex-start",
                  borderColor: "#30363d",
                  color: "#e5e7eb",
                  textTransform: "none",
                }}
              >
                <FilterListIcon sx={{ fontSize: 18, mr: 1 }} /> Create custom filter
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  justifyContent: "flex-start",
                  borderColor: "#30363d",
                  color: "#e5e7eb",
                  textTransform: "none",
                }}
              >
                <CalendarTodayIcon sx={{ fontSize: 18, mr: 1 }} /> Schedule report
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
