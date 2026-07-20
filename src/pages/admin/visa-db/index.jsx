import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, IconButton,
  TextField, MenuItem, Select, FormControl, InputLabel, Stack,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Public as PublicIcon } from "@mui/icons-material";
import { useAdminVisaList, useDeleteVisaCountry } from "@/hooks/useVisa";
import { chipStyles } from "@/pages/admin/styles/dashboard-styles";
import { toast } from "sonner";

const cardSx = {
  borderRadius: 2,
  bgcolor: "#1A1D23",
  border: "1px solid rgba(255, 255, 255, 0.08)",
};

const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "#0B0F16",
    "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
    "&.Mui-focused fieldset": { borderColor: "#3B82F6", borderWidth: 1 },
  },
  "& .MuiInputLabel-root": { color: "#9ca3af", "&.Mui-focused": { color: "#3B82F6" } },
  "& input, & .MuiSelect-select": { color: "#e5e7eb" },
};

const getFlagEmoji = (code) => {
  if (!code || code.length !== 2) return "🌍";
  return code.toUpperCase().split("").map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65)).join("");
};

// Explicit contrast-checked styles instead of MUI's bare "success"/"default"
// color prop, which falls back to low-contrast defaults with no theme.
const VISA_LABELS = {
  yes: { label: "Visa Required", sx: chipStyles.danger },
  no: { label: "Visa Free", sx: chipStyles.success },
  depends: { label: "Depends", sx: chipStyles.warning },
  check: { label: "Check", sx: chipStyles.neutral },
};

const STATUS_CHIP_SX = {
  published: chipStyles.success,
  draft: chipStyles.neutral,
};

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

export default function VisaAdmin() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading } = useAdminVisaList({ page, limit: 20, search, status: statusFilter });
  const deleteMutation = useDeleteVisaCountry();

  const countries = data?.countries || [];
  const total = data?.total || 0;

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(0);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => { toast.success("Country deleted"); setDeleteId(null); },
      onError: () => toast.error("Failed to delete"),
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#FFFFFF", fontFamily: "Inter" }}>
            Visa Database
          </Typography>
          <Typography variant="body2" sx={{ color: "#71717A", mt: 0.5, fontFamily: "Inter" }}>
            {total} countries
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/admin/visa-db/new")}
          sx={{ bgcolor: "#3B82F6", "&:hover": { bgcolor: "#2563EB" }, textTransform: "none", fontFamily: "Inter" }}
        >
          Add Country
        </Button>
      </Box>

      {/* Filters */}
      <Box component="form" onSubmit={handleSearch} sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          size="small" placeholder="Search countries…" value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)} sx={{ ...textFieldSx, minWidth: 240 }}
        />
        <FormControl size="small" sx={{ minWidth: 140, ...textFieldSx }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} label="Status" onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="published">Published</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" sx={{ bgcolor: "#3B82F6", textTransform: "none" }}>Search</Button>
      </Box>

      <Paper sx={cardSx}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {["Country", "Visa Status", "eVisa", "Visa on Arrival", "Status", "Updated", ""].map((h) => (
                  <TableCell key={h} sx={{ color: "#71717A", borderColor: "rgba(255,255,255,0.06)", fontFamily: "Inter", fontSize: 12 }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: "center", color: "#71717A", py: 6 }}>Loading…</TableCell>
                </TableRow>
              ) : countries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: "center", py: 8 }}>
                    <PublicIcon sx={{ fontSize: 48, color: "#374151", mb: 1, display: "block", mx: "auto" }} />
                    <Typography sx={{ color: "#71717A", fontFamily: "Inter" }}>
                      No visa entries yet. Click &ldquo;Add Country&rdquo; to get started.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                countries.map((c) => {
                  const visaLabel = VISA_LABELS[c.visaRequired] || VISA_LABELS.check;
                  return (
                    <TableRow key={c.id} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02)" } }}>
                      <TableCell sx={{ borderColor: "rgba(255,255,255,0.06)" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <span style={{ fontSize: 22 }}>{getFlagEmoji(c.countryCode)}</span>
                          <Box>
                            <Typography
                              sx={{ color: "#e5e7eb", fontFamily: "Inter", fontSize: 13, fontWeight: 500, cursor: "pointer", "&:hover": { color: "#3B82F6" } }}
                              onClick={() => navigate(`/admin/visa-db/${c.id}`)}
                            >
                              {c.countryName}
                            </Typography>
                            <Typography sx={{ color: "#71717A", fontSize: 11, fontFamily: "Inter" }}>{c.countrySlug}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderColor: "rgba(255,255,255,0.06)" }}>
                        <Chip label={visaLabel.label} size="small" sx={visaLabel.sx} />
                      </TableCell>
                      <TableCell sx={{ color: "#9ca3af", borderColor: "rgba(255,255,255,0.06)", fontSize: 12 }}>
                        {c.eVisaAvailable === "yes" ? "✓" : c.eVisaAvailable === "no" ? "✗" : "—"}
                      </TableCell>
                      <TableCell sx={{ color: "#9ca3af", borderColor: "rgba(255,255,255,0.06)", fontSize: 12 }}>
                        {c.visaOnArrival === "yes" ? "✓" : c.visaOnArrival === "no" ? "✗" : "—"}
                      </TableCell>
                      <TableCell sx={{ borderColor: "rgba(255,255,255,0.06)" }}>
                        <Chip label={c.status} size="small" sx={STATUS_CHIP_SX[c.status] || STATUS_CHIP_SX.draft} />
                      </TableCell>
                      <TableCell sx={{ color: "#9ca3af", borderColor: "rgba(255,255,255,0.06)", fontSize: 12 }}>
                        {formatDate(c.updatedAt)}
                      </TableCell>
                      <TableCell sx={{ borderColor: "rgba(255,255,255,0.06)" }}>
                        <Stack direction="row" spacing={0.5}>
                          <IconButton size="small" onClick={() => navigate(`/admin/visa-db/${c.id}`)} sx={{ color: "#3B82F6" }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => setDeleteId(c.id)} sx={{ color: "#ef4444" }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {total > 20 && (
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <Typography sx={{ color: "#71717A", fontSize: 13 }}>{page * 20 + 1}–{Math.min((page + 1) * 20, total)} of {total}</Typography>
            <Stack direction="row" spacing={1}>
              <Button size="small" disabled={page === 0} onClick={() => setPage(page - 1)} sx={{ color: "#9ca3af", textTransform: "none" }}>Previous</Button>
              <Button size="small" disabled={(page + 1) * 20 >= total} onClick={() => setPage(page + 1)} sx={{ color: "#9ca3af", textTransform: "none" }}>Next</Button>
            </Stack>
          </Box>
        )}
      </Paper>

      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}
        PaperProps={{ sx: { bgcolor: "#1A1D23", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.08)" } }}>
        <DialogTitle sx={{ fontFamily: "Inter" }}>Delete Country?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#9ca3af", fontFamily: "Inter", fontSize: 14 }}>This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} sx={{ color: "#9ca3af", textTransform: "none" }}>Cancel</Button>
          <Button onClick={handleDelete} disabled={deleteMutation.isPending} sx={{ color: "#ef4444", textTransform: "none" }}>
            {deleteMutation.isPending ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
