import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, IconButton,
  TextField, MenuItem, Select, FormControl, InputLabel,
  Stack, Alert, Dialog, DialogTitle, DialogContent, DialogActions,
} from "@mui/material";
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Refresh as RefreshIcon, Article as ArticleIcon,
} from "@mui/icons-material";
import { useAdminArticles, useArticleCategories, useDeleteArticle } from "@/hooks/useArticles";
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

// Explicit contrast-checked styles instead of MUI's bare "success"/"default"
// color prop, which falls back to low-contrast defaults with no theme.
const STATUS_COLORS = {
  published: { label: "Published", sx: chipStyles.success },
  draft: { label: "Draft", sx: chipStyles.neutral },
};

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

export default function ArticlesAdmin() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading, refetch } = useAdminArticles({
    page,
    limit: 20,
    search,
    status: statusFilter,
    category: categoryFilter,
  });
  const { data: categories = [] } = useArticleCategories();
  const deleteMutation = useDeleteArticle();

  const articles = data?.articles || [];
  const total = data?.total || 0;

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(0);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => { toast.success("Article deleted"); setDeleteId(null); },
      onError: () => toast.error("Failed to delete article"),
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#FFFFFF", fontFamily: "Inter" }}>
            Travel Articles
          </Typography>
          <Typography variant="body2" sx={{ color: "#71717A", mt: 0.5, fontFamily: "Inter" }}>
            {total} total articles
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
            sx={{ color: "#9ca3af", borderColor: "rgba(255,255,255,0.1)", textTransform: "none" }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/admin/content/articles/new")}
            sx={{ bgcolor: "#3B82F6", "&:hover": { bgcolor: "#2563EB" }, textTransform: "none", fontFamily: "Inter" }}
          >
            New Article
          </Button>
        </Stack>
      </Box>

      {/* Filters */}
      <Box component="form" onSubmit={handleSearch} sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          size="small"
          placeholder="Search articles…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          sx={{ ...textFieldSx, flex: 1, minWidth: 320 }}
        />
        <FormControl size="small" sx={{ minWidth: 180, ...textFieldSx }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            label="Category"
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(0); }}
          >
            <MenuItem value="">All</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.slug}>{cat.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 140, ...textFieldSx }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="published">Published</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" sx={{ bgcolor: "#3B82F6", textTransform: "none" }}>
          Search
        </Button>
      </Box>

      {/* Table */}
      <Paper sx={cardSx}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {["Title", "Category", "Status", "Author", "Published", ""].map((h) => (
                  <TableCell key={h} sx={{ color: "#71717A", borderColor: "rgba(255,255,255,0.06)", fontFamily: "Inter", fontSize: 12 }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: "center", color: "#71717A", py: 6 }}>
                    Loading…
                  </TableCell>
                </TableRow>
              ) : articles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: "center", py: 8 }}>
                    <ArticleIcon sx={{ fontSize: 48, color: "#374151", mb: 1, display: "block", mx: "auto" }} />
                    <Typography sx={{ color: "#71717A", fontFamily: "Inter" }}>
                      No articles yet. Click &ldquo;New Article&rdquo; to get started.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                articles.map((a) => {
                  const sc = STATUS_COLORS[a.status] || STATUS_COLORS.draft;
                  return (
                    <TableRow key={a.id} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02)" } }}>
                      <TableCell sx={{ color: "#e5e7eb", borderColor: "rgba(255,255,255,0.06)", maxWidth: 300 }}>
                        <Typography
                          sx={{ fontFamily: "Inter", fontSize: 13, fontWeight: 500, cursor: "pointer", "&:hover": { color: "#3B82F6" } }}
                          onClick={() => navigate(`/admin/content/articles/${a.id}`)}
                          noWrap
                        >
                          {a.title}
                        </Typography>
                        <Typography sx={{ color: "#71717A", fontSize: 11, fontFamily: "Inter" }}>{a.slug}</Typography>
                      </TableCell>
                      <TableCell sx={{ borderColor: "rgba(255,255,255,0.06)" }}>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap">
                          {(a.articleCategory || []).slice(0, 2).map((c) => (
                            <Chip key={c.slug} label={c.name} size="small" sx={{ fontSize: 10, bgcolor: "rgba(59,130,246,0.1)", color: "#3B82F6" }} />
                          ))}
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ borderColor: "rgba(255,255,255,0.06)" }}>
                        <Chip label={sc.label} size="small" sx={sc.sx} />
                      </TableCell>
                      <TableCell sx={{ color: "#9ca3af", borderColor: "rgba(255,255,255,0.06)", fontSize: 12, fontFamily: "Inter" }}>
                        {a.authorName || "—"}
                      </TableCell>
                      <TableCell sx={{ color: "#9ca3af", borderColor: "rgba(255,255,255,0.06)", fontSize: 12, fontFamily: "Inter" }}>
                        {formatDate(a.publishedAt)}
                      </TableCell>
                      <TableCell sx={{ borderColor: "rgba(255,255,255,0.06)" }}>
                        <Stack direction="row" spacing={0.5}>
                          <IconButton size="small" onClick={() => navigate(`/admin/content/articles/${a.id}`)} sx={{ color: "#3B82F6" }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => setDeleteId(a.id)} sx={{ color: "#ef4444" }}>
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

        {/* Pagination */}
        {total > 20 && (
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <Typography sx={{ color: "#71717A", fontSize: 13, fontFamily: "Inter" }}>
              {page * 20 + 1}–{Math.min((page + 1) * 20, total)} of {total}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button size="small" disabled={page === 0} onClick={() => setPage(page - 1)} sx={{ color: "#9ca3af", textTransform: "none" }}>
                Previous
              </Button>
              <Button size="small" disabled={(page + 1) * 20 >= total} onClick={() => setPage(page + 1)} sx={{ color: "#9ca3af", textTransform: "none" }}>
                Next
              </Button>
            </Stack>
          </Box>
        )}
      </Paper>

      {/* Delete confirm */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}
        PaperProps={{ sx: { bgcolor: "#1A1D23", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.08)" } }}>
        <DialogTitle sx={{ fontFamily: "Inter" }}>Delete Article?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#9ca3af", fontFamily: "Inter", fontSize: 14 }}>
            This action cannot be undone.
          </Typography>
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
