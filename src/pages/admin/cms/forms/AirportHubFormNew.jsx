import { useState, useEffect, useMemo } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Snackbar,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Search as SearchIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { useCmsPage, useSaveCmsPage, usePaginatedAirports } from "@/hooks/useCms";
import BasicTab from "./airport/BasicTab";
import ContentTab from "./airport/ContentTab";
import BaggageTab from "./airport/BaggageTab";
import AirlinesTab from "./airport/AirlinesTab";
import { emptyAirport } from "./airport/shared";

/**
 * Airport Information Hub editor.
 *
 * Storage is one CMS JSON blob (cmsPage slug "airport_info"). `content` is
 * schema-free server-side, so the baggage/terminals/airlines fields need no
 * migration. This file owns identity, validation, persistence and the list;
 * the four dialog panels live in ./airport/.
 *
 * Records are identified by IATA CODE, never by array index. The previous
 * version recovered a row's index with findIndex(name + iataCode) against the
 * full array while displaying a server-paginated slice; a miss returned -1, and
 * `airports[-1] = draft` wrote a property JSON.stringify drops — silently
 * discarding the edit behind a success toast.
 */

// Only the border needs stating: the background comes from adminTheme's
// palette.background.paper, and inputs/tables/dialogs/menus are themed globally
// — which is why this file no longer carries local textFieldSx/cardSx copies.
const cardSx = {
  borderRadius: 2,
  border: "1px solid rgba(255, 255, 255, 0.08)",
};

const defaultContent = { hero: { title: "", subtitle: "" }, airports: [] };

const codeOf = (airport) => String(airport?.iataCode || "").trim().toUpperCase();

/**
 * Stable identity for one airport row.
 *
 * IATA is the real key — it is also the public URL (/Airport/DXB). Rows saved
 * before IATA was required fall back to their name so they stay editable
 * instead of being stranded and impossible to fix.
 */
const keyOf = (airport) =>
  codeOf(airport) || `name:${String(airport?.name || "").trim().toLowerCase()}`;

/** Fill in fields that predate this editor so the panels never read undefined. */
const hydrateAirport = (airport) => ({
  ...emptyAirport,
  ...airport,
  baggage: { ...emptyAirport.baggage, ...(airport?.baggage || {}) },
  sections: airport?.sections || [],
  tips: airport?.tips || [],
  terminals: airport?.terminals || [],
  airlines: airport?.airlines || [],
});

/** Baggage coverage at a glance, so gaps are auditable from the list. */
const baggageState = (airport) => {
  const baggage = airport?.baggage || {};
  if (baggage.pdfUrl) return { label: "PDF", color: "success" };
  if (baggage.summary || (baggage.allowances || []).length)
    return { label: "Text only", color: "warning" };
  return null;
};

export default function AirportHubForm() {
  const slug = "airport_info";
  const { data, isLoading, isError } = useCmsPage(slug);
  const saveMutation = useSaveCmsPage();

  const [title, setTitle] = useState("Airport Information Hub");
  const [content, setContent] = useState(defaultContent);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState(null);
  const [editingKey, setEditingKey] = useState(null); // null => adding
  const [tab, setTab] = useState(0);
  const [formError, setFormError] = useState("");
  const [isSavingAirport, setIsSavingAirport] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const { data: paginatedData, isLoading: isLoadingAirports } = usePaginatedAirports(
    page,
    rowsPerPage,
    debouncedSearch,
  );

  useEffect(() => {
    if (data) {
      setTitle(data.title || "Airport Information Hub");
      setContent({ ...defaultContent, ...(data.content || {}) });
    }
  }, [data]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const airports = paginatedData?.airports || [];
  const totalAirports = paginatedData?.total || 0;
  // Memoised so the `|| []` fallback doesn't hand the memo below a new array
  // on every render.
  const allAirports = useMemo(() => content.airports || [], [content.airports]);

  // Rows an editor still needs to fix: no IATA means no public page, and no
  // stable key to edit against.
  const missingCodeCount = useMemo(
    () => allAirports.filter((a) => !codeOf(a)).length,
    [allAirports],
  );

  const updateHero = (field, value) =>
    setContent((prev) => ({ ...prev, hero: { ...prev.hero, [field]: value } }));

  // ---------------------------------------------------------------- dialog ---

  const openDialog = (airport) => {
    setDraft(airport ? hydrateAirport(airport) : { ...emptyAirport });
    setEditingKey(airport ? keyOf(airport) : null);
    setTab(0);
    setFormError("");
    setModalOpen(true);
  };

  const closeDialog = () => {
    setModalOpen(false);
    setDraft(null);
    setEditingKey(null);
    setFormError("");
  };

  const setField = (field, value) => setDraft((prev) => ({ ...prev, [field]: value }));

  const patchBaggage = (patch) =>
    setDraft((prev) => ({ ...prev, baggage: { ...(prev.baggage || {}), ...patch } }));

  // ------------------------------------------------------------ persistence ---

  const persist = async (airportsNext, message) => {
    await saveMutation.mutateAsync({
      slug,
      payload: {
        slug,
        title,
        content: { ...content, airports: airportsNext },
        status: "published",
      },
    });
    setContent((prev) => ({ ...prev, airports: airportsNext }));
    setToast({ open: true, message, severity: "success" });
  };

  const validateDraft = () => {
    if (!String(draft.name || "").trim()) return "Airport name is required.";
    const code = codeOf(draft);
    if (!/^[A-Z]{3}$/.test(code)) {
      return "IATA code must be exactly 3 letters — it identifies the airport and forms its page URL (/Airport/DXB).";
    }
    if (allAirports.some((a) => codeOf(a) === code && keyOf(a) !== editingKey)) {
      return `Another airport already uses the code ${code}.`;
    }
    return "";
  };

  const saveAirport = async () => {
    const problem = validateDraft();
    if (problem) {
      setFormError(problem);
      setTab(0);
      return;
    }
    setFormError("");
    setIsSavingAirport(true);

    const cleaned = { ...draft, iataCode: codeOf(draft) };
    let next;

    if (editingKey) {
      let replaced = false;
      next = allAirports.map((a) => {
        if (!replaced && keyOf(a) === editingKey) {
          replaced = true;
          return cleaned;
        }
        return a;
      });
      // If the row vanished under us, append rather than lose the editor's work.
      if (!replaced) next = [...allAirports, cleaned];
    } else {
      next = [...allAirports, cleaned];
    }

    try {
      await persist(next, editingKey ? "Airport updated." : "Airport added.");
      closeDialog();
    } catch {
      setToast({
        open: true,
        message: "Failed to save airport. Please try again.",
        severity: "error",
      });
    } finally {
      setIsSavingAirport(false);
    }
  };

  const deleteAirport = async (airport) => {
    const label = airport.name || codeOf(airport) || "this airport";
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return;

    const key = keyOf(airport);
    const next = allAirports.filter((a) => keyOf(a) !== key);
    if (next.length === allAirports.length) {
      setToast({
        open: true,
        message: "Could not identify that airport — reload and try again.",
        severity: "error",
      });
      return;
    }

    try {
      await persist(next, "Airport deleted.");
    } catch {
      setToast({
        open: true,
        message: "Failed to delete airport. Please try again.",
        severity: "error",
      });
    }
  };

  const savePageSettings = async () => {
    try {
      await saveMutation.mutateAsync({
        slug,
        payload: { slug, title, content, status: "published" },
      });
      setToast({ open: true, message: "Page settings saved.", severity: "success" });
    } catch {
      setToast({
        open: true,
        message: "Failed to save page settings. Please try again.",
        severity: "error",
      });
    }
  };

  // ------------------------------------------------------------------ views ---

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <Typography sx={{ color: "text.secondary" }}>Loading page content…</Typography>
      </Box>
    );
  }

  const isNewPage = !data;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#FFFFFF" }}>
            Airport Information Hub
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            {allAirports.length} airport{allAirports.length === 1 ? "" : "s"} · published at /Airport
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={savePageSettings}
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? "Saving…" : "Save page settings"}
        </Button>
      </Box>

      {isError && (
        <Alert severity="error">
          Failed to load page content. Please check your connection.
        </Alert>
      )}
      {isNewPage && !isError && (
        <Alert severity="info">
          This page has not been created yet. Fill in the content and save to create it.
        </Alert>
      )}
      {missingCodeCount > 0 && (
        <Alert severity="warning">
          {missingCodeCount} airport{missingCodeCount === 1 ? " has" : "s have"} no IATA
          code, so {missingCodeCount === 1 ? "it has" : "they have"} no public page. Open
          each one and add its 3-letter code.
        </Alert>
      )}

      {/* Page settings */}
      <Card sx={cardSx}>
        <CardHeader
          title={
            <Typography sx={{ color: "#FFFFFF", fontWeight: 600 }}>Page settings</Typography>
          }
          subheader={
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Heading and intro shown at the top of the public directory
            </Typography>
          }
          sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Page title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              fullWidth
              label="Hero title"
              value={content.hero?.title || ""}
              onChange={(e) => updateHero("title", e.target.value)}
            />
            <TextField
              fullWidth
              label="Hero subtitle"
              value={content.hero?.subtitle || ""}
              onChange={(e) => updateHero("subtitle", e.target.value)}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Airports list */}
      <Card sx={cardSx}>
        <CardHeader
          title={
            <Typography sx={{ color: "#FFFFFF", fontWeight: 600 }}>
              Airports ({totalAirports})
            </Typography>
          }
          action={
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => openDialog(null)}
              sx={{ fontWeight: 600 }}
            >
              Add airport
            </Button>
          }
          sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by name, code, city or country…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Airport name</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell align="center">Terminals</TableCell>
                  <TableCell align="center">Airlines</TableCell>
                  <TableCell align="center">Baggage</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoadingAirports ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4, color: "text.secondary" }}>
                      Loading airports…
                    </TableCell>
                  </TableRow>
                ) : airports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4, color: "text.secondary" }}>
                      {debouncedSearch
                        ? "No airports match your search."
                        : "No airports yet. Click “Add airport” to get started."}
                    </TableCell>
                  </TableRow>
                ) : (
                  airports.map((airport) => {
                    const code = codeOf(airport);
                    const baggage = baggageState(airport);
                    return (
                      <TableRow key={keyOf(airport)} hover>
                        <TableCell sx={{ color: "text.primary" }}>
                          {airport.name || "—"}
                        </TableCell>
                        <TableCell>
                          {code ? (
                            <Typography
                              component="span"
                              sx={{ color: "primary.main", fontWeight: 600, fontSize: 13 }}
                            >
                              {code}
                            </Typography>
                          ) : (
                            <Tooltip title="No public page without an IATA code">
                              <Chip
                                size="small"
                                icon={<WarningIcon sx={{ fontSize: 14 }} />}
                                label="Missing"
                                color="error"
                                variant="outlined"
                              />
                            </Tooltip>
                          )}
                        </TableCell>
                        <TableCell sx={{ color: "text.primary" }}>{airport.city || "—"}</TableCell>
                        <TableCell sx={{ color: "text.primary" }}>
                          {airport.flag && <span style={{ marginRight: 6 }}>{airport.flag}</span>}
                          {airport.country || "—"}
                        </TableCell>
                        <TableCell align="center" sx={{ color: "text.secondary" }}>
                          {(airport.terminals || []).length || "—"}
                        </TableCell>
                        <TableCell align="center" sx={{ color: "text.secondary" }}>
                          {(airport.airlines || []).length || "—"}
                        </TableCell>
                        <TableCell align="center">
                          {baggage ? (
                            <Chip
                              size="small"
                              label={baggage.label}
                              color={baggage.color}
                              variant="outlined"
                            />
                          ) : (
                            <Typography component="span" sx={{ color: "text.secondary" }}>
                              —
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => openDialog(airport)}
                            sx={{ color: "primary.main", mr: 1 }}
                            aria-label={`Edit ${airport.name || code}`}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => deleteAirport(airport)}
                            sx={{ color: "#ef4444" }}
                            aria-label={`Delete ${airport.name || code}`}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {totalAirports > 0 && (
            <TablePagination
              component="div"
              count={totalAirports}
              page={page}
              onPageChange={(_, next) => setPage(next)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25, 50]}
              sx={{ color: "text.secondary" }}
            />
          )}
        </CardContent>
      </Card>

      {/* Add / edit dialog — tabbed, because one flat form covering identity,
          prose, baggage and an airline roster is unusable. */}
      <Dialog open={modalOpen} onClose={closeDialog} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {editingKey ? "Edit airport" : "Add new airport"}
          </Typography>
          <IconButton size="small" onClick={closeDialog} sx={{ color: "text.secondary" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {draft && (
          <>
            <Tabs
              value={tab}
              onChange={(_, next) => setTab(next)}
              sx={{ px: 3, borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Tab label="Basic" />
              <Tab label="Content" />
              <Tab label={`Baggage${draft.baggage?.pdfUrl ? " • PDF" : ""}`} />
              <Tab label={`Airlines (${(draft.airlines || []).length})`} />
            </Tabs>

            <DialogContent dividers sx={{ borderColor: "rgba(255,255,255,0.08)" }}>
              {formError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {formError}
                </Alert>
              )}
              {tab === 0 && <BasicTab draft={draft} setField={setField} />}
              {tab === 1 && <ContentTab draft={draft} setField={setField} />}
              {tab === 2 && (
                <BaggageTab baggage={draft.baggage || {}} onPatch={patchBaggage} />
              )}
              {tab === 3 && <AirlinesTab draft={draft} setField={setField} />}
            </DialogContent>
          </>
        )}

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={closeDialog} disabled={isSavingAirport} sx={{ color: "text.secondary" }}>
            Cancel
          </Button>
          <Button onClick={saveAirport} variant="contained" disabled={isSavingAirport}>
            {isSavingAirport ? "Saving…" : editingKey ? "Save changes" : "Add airport"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
