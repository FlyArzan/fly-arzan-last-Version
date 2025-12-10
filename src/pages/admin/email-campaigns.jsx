import { useState } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Stack,
  Chip,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
  CircularProgress,
  Grid,
  IconButton,
  Collapse,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import EmailIcon from "@mui/icons-material/Email";
import SendIcon from "@mui/icons-material/Send";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CampaignIcon from "@mui/icons-material/Campaign";
import {
  useEmailCampaigns,
  useEmailStats,
  useSendToAllSubscribers,
} from "@/hooks/useNotifications";
import {
  cardStyles,
  inputStyles,
  tableStyles,
  typographyStyles,
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

export default function EmailCampaigns() {
  const [page, setPage] = useState(1);
  const [expandedCampaign, setExpandedCampaign] = useState(null);
  const [sendToAllModalOpen, setSendToAllModalOpen] = useState(false);
  const [emailForm, setEmailForm] = useState({
    subject: "",
    content: "",
  });

  // Fetch email campaigns
  const { data, isLoading, refetch } = useEmailCampaigns({ page, limit: 10 });
  const campaigns = data?.campaigns ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalCampaigns = data?.total ?? 0;

  // Fetch email stats
  const { data: stats } = useEmailStats();

  // Send to all subscribers mutation
  const sendToAllMutation = useSendToAllSubscribers();

  const handleSendToAll = async () => {
    if (!emailForm.subject || !emailForm.content) return;

    try {
      await sendToAllMutation.mutateAsync({
        subject: emailForm.subject,
        content: emailForm.content,
      });
      setSendToAllModalOpen(false);
      setEmailForm({ subject: "", content: "" });
      refetch();
    } catch (err) {
      console.error("Send to all failed:", err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString();
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
            Email Campaigns
          </Typography>
          <Typography variant="body2" sx={typographyStyles.pageSubtitle}>
            Manage and send email campaigns to newsletter subscribers.
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
          <Button
            size="small"
            startIcon={<CampaignIcon />}
            onClick={() => setSendToAllModalOpen(true)}
            sx={buttonStyles.primary}
          >
            Send to All Subscribers
          </Button>
        </Stack>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Campaigns"
            value={stats?.totalCampaigns ?? totalCampaigns}
            icon={EmailIcon}
            color="#3B82F6"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Emails Sent"
            value={stats?.totalEmailsSent ?? 0}
            icon={SendIcon}
            color="#22C55E"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Newsletter Subscribers"
            value={stats?.totalSubscribers ?? 0}
            icon={PeopleIcon}
            color="#A855F7"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Blocked (Unsubscribed)"
            value={stats?.totalBlocked ?? 0}
            icon={BlockIcon}
            color="#EF4444"
          />
        </Grid>
      </Grid>

      {/* Campaigns Table */}
      <Card sx={cardStyles.base}>
        <CardHeader
          title={
            <Typography sx={typographyStyles.cardTitle}>
              Campaign History
            </Typography>
          }
          subheader={
            <Typography variant="caption" sx={typographyStyles.cardSubtitle}>
              View all sent email campaigns and their recipients.
            </Typography>
          }
          sx={{ px: 3, pt: 3, pb: 2 }}
        />
        <CardContent sx={{ px: 3, pb: 3 }}>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress size={32} sx={{ color: "#3B82F6" }} />
            </Box>
          ) : campaigns.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <EmailIcon sx={{ fontSize: 48, color: "#71717A", mb: 2 }} />
              <Typography sx={{ color: "#71717A", fontFamily: "Inter" }}>
                No email campaigns sent yet
              </Typography>
            </Box>
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={tableStyles.headerCell} width={40} />
                    <TableCell sx={tableStyles.headerCell}>Subject</TableCell>
                    <TableCell sx={tableStyles.headerCell}>Sent</TableCell>
                    <TableCell sx={tableStyles.headerCell}>Blocked</TableCell>
                    <TableCell sx={tableStyles.headerCell}>Date</TableCell>
                    <TableCell sx={tableStyles.headerCell}>Sent By</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <>
                      <TableRow
                        key={campaign.id}
                        sx={tableStyles.row}
                        onClick={() =>
                          setExpandedCampaign(
                            expandedCampaign === campaign.id
                              ? null
                              : campaign.id
                          )
                        }
                      >
                        <TableCell sx={tableStyles.bodyCell}>
                          <IconButton size="small">
                            {expandedCampaign === campaign.id ? (
                              <ExpandLessIcon sx={{ color: "#71717A" }} />
                            ) : (
                              <ExpandMoreIcon sx={{ color: "#71717A" }} />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell sx={tableStyles.bodyCell}>
                          <Typography
                            sx={{
                              color: "#FFFFFF",
                              fontSize: 14,
                              fontWeight: 500,
                              fontFamily: "Inter",
                            }}
                          >
                            {campaign.subject}
                          </Typography>
                        </TableCell>
                        <TableCell sx={tableStyles.bodyCell}>
                          <Chip
                            size="small"
                            icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                            label={campaign.sentCount}
                            sx={{
                              bgcolor: "rgba(34, 197, 94, 0.1)",
                              color: "#22C55E",
                              fontFamily: "Inter",
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={tableStyles.bodyCell}>
                          <Chip
                            size="small"
                            icon={<BlockIcon sx={{ fontSize: 14 }} />}
                            label={campaign.blockedCount}
                            sx={{
                              bgcolor: "rgba(239, 68, 68, 0.1)",
                              color: "#EF4444",
                              fontFamily: "Inter",
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          sx={{ ...tableStyles.bodyCell, color: "#71717A" }}
                        >
                          {formatDate(campaign.createdAt)}
                        </TableCell>
                        <TableCell sx={tableStyles.bodyCell}>
                          <Typography
                            sx={{
                              color: "#71717A",
                              fontSize: 13,
                              fontFamily: "Inter",
                            }}
                          >
                            {campaign.sentBy?.name ||
                              campaign.sentBy?.email ||
                              "System"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={6} sx={{ p: 0, border: "none" }}>
                          <Collapse
                            in={expandedCampaign === campaign.id}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box
                              sx={{
                                p: 3,
                                bgcolor: "rgba(255, 255, 255, 0.02)",
                                borderBottom:
                                  "1px solid rgba(255, 255, 255, 0.08)",
                              }}
                            >
                              <Typography
                                sx={{
                                  color: "#71717A",
                                  fontSize: 12,
                                  fontFamily: "Inter",
                                  mb: 1,
                                }}
                              >
                                Email Content:
                              </Typography>
                              <Typography
                                sx={{
                                  color: "#FFFFFF",
                                  fontSize: 14,
                                  fontFamily: "Inter",
                                  whiteSpace: "pre-wrap",
                                  bgcolor: "rgba(0, 0, 0, 0.2)",
                                  p: 2,
                                  borderRadius: 1,
                                }}
                              >
                                {campaign.content}
                              </Typography>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </>
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

      {/* Send to All Subscribers Modal */}
      <Dialog
        open={sendToAllModalOpen}
        onClose={() => {
          setSendToAllModalOpen(false);
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
            <CampaignIcon sx={{ color: "#A855F7" }} />
            <span>Send to All Newsletter Subscribers</span>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#71717A", fontFamily: "Inter", mb: 2 }}>
            This will send an email to all customers who have subscribed to the
            newsletter ({stats?.totalSubscribers ?? 0} subscribers).
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
              placeholder="Write your email content here..."
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
              setSendToAllModalOpen(false);
              setEmailForm({ subject: "", content: "" });
            }}
            sx={{ color: "#71717A" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendToAll}
            disabled={
              !emailForm.subject ||
              !emailForm.content ||
              sendToAllMutation.isPending
            }
            startIcon={<SendIcon />}
            sx={buttonStyles.primary}
          >
            {sendToAllMutation.isPending ? "Sending..." : "Send Campaign"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
