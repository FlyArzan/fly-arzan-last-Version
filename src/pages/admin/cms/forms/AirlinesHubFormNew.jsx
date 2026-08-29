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
import { useCmsPage, useSaveCmsPage } from "@/hooks/useCms";
import AirlineBasicTab from "./airlines/AirlineBasicTab";
import ContentTab from "./airport/ContentTab";
import BaggageTab from "./airport/BaggageTab";
import { emptyAirline } from "./airlines/shared";

/**
 * Airline Information Hub editor.
 *
 * Storage is one CMS JSON blob (cmsPage slug "airlines"). `content` is
 * schema-free server-side, so the fields need no migration — the same generic
 * PUT /:slug upsert handles it. This file owns identity, validation,
 * persistence and the list; the three dialog panels (Basic, Content, Baggage)
 * live herebeside ../airport/: ContentTab and BaggageTab are airline-agnostic
 * and are reused verbatim.
 *
 * Records are identified by IATA CODE, never by array index — the same bug that
 * bit the airport editor (index writes being dropped by JSON.stringify) is
 * avoided by keying on iata.
 */

const cardSx = {
  borderRadius: 2,
  border: "1px solid rgba(255, 255, 255, 0.08)",
};

const defaultContent = { hero: { title: "", subtitle: "" }, airlines: [] };

const codeOf = (airline) => String(airline?.iata || "").trim().toUpperCase();

/** Stable identity: IATA is the key; fall back to name so a code-less row stays editable. */
const keyOf = (airline) =>
  codeOf(airline) || `name:${String(airline?.name || "").trim().toLowerCase()}`;

const hydrateAirline = (airline) => ({
  ...emptyAirline,
  ...airline,
  baggage: { ...emptyAirline.baggage, ...(airline?.baggage || {}) },
  sections: airline?.sections || [],
  tips: airline?.tips || [],
});

const baggageState = (airline) => {
  const baggage = airline?.baggage || {};
  if (baggage.pdfUrl) return { label: "PDF", color: "success" };
  if (baggage.summary || (baggage.allowances || []).length)
    return { label: "Text only", color: "warning" };
  return null;
};

export default function AirlinesHubForm() {
  const slug = "airlines";
  const { data, isLoading, isError } = useCmsPage(slug);
  const saveMutation = useSaveCmsPage();

  const [title, setTitle] = useState("Airline Information Hub");
  const [content, setContent] = useState(defaultContent);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState(null);
  const [editingKey, setEditingKey] = useState(null);
  const [tab, setTab] = useState(0);
  const [formError, setFormError] = useState("");
  const [isSavingAirline, setIsSavingAirline] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (data) {
      setTitle(data.title || "Airline Information Hub");
      setContent({ ...defaultContent, ...(data.content || {}) });
    }
  }, [data]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const allAirlines = useMemo(() => content.airlines || [], [content.airlines]);

  const airlines = useMemo(() => {
    let rows = allAirlines.slice().sort((a, b) =>
      String(a?.name || "").localeCompare(String(b?.name || "")),
    );
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      rows = rows.filter(
        (a) =>
          String(a?.name || "").toLowerCase().includes(q) ||
          String(a?.iata || "").toLowerCase().includes(q) ||
          String(a?.icao || "").toLowerCase().includes(q),
      );
    }
    return rows;
  }, [allAirlines, debouncedSearch]);
  const totalAirlines = airlines.length;

  const missingCodeCount = useMemo(
    () => allAirlines.filter((a) => !codeOf(a)).length,
    [allAirlines],
  );

  const updateHero = (field, value) =>
    setContent((prev) => ({ ...prev, hero: { ...prev.hero, [field]: value } }));

  // ----------------------------------------------------------------- dialog ---
  const openDialog = (airline) => {
    setDraft(airline ? hydrateAirline(airline) : { ...emptyAirline });
    setEditingKey(airline ? keyOf(airline) : null);
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
  const persist = async (airlinesNext, message) => {
    await saveMutation.mutateAsync({
      slug,
      payload: {
        slug,
        title,
        content: { ...content, airlines: airlinesNext },
        status: "published",
      },
    });
    setContent((prev) => ({ ...prev, airlines: airlinesNext }));
    setToast({ open: true, message, severity: "success" });
  };

  const validateDraft = () => {
    if (!String(draft.name || "").trim()) return "Airline name is required.";
    const code = codeOf(draft);
    if (!/^[A-Z]{2,3}$/.test(code)) {
      return "IATA code must be 2–3 letters — it identifies the airline and forms its page URL (/Airlines/EK).";
    }
    if (allAirlines.some((a) => codeOf(a) === code && keyOf(a) !== editingKey)) {
      return `Another airline already uses the code ${code}.`;
    }
    return "";
  };

  const saveAirline = async () => {
    const problem = validateDraft();
    if (problem) {
      setFormError(problem);
      setTab(0);
      return;
    }
    setFormError("");
    setIsSavingAirline(true);

    const cleaned = { ...draft, iata: codeOf(draft) };
    let next;

    if (editingKey) {
      let replaced = false;
      next = allAirlines.map((a) => {
        if (!replaced && keyOf(a) === editingKey) {
          replaced = true;
          return cleaned;
        }
        return a;
      });
      if (!replaced) next = [...allAirlines, cleaned];
    } else {
      next = [...allAirlines, cleaned];
    }

    try {
      await persist(next, editingKey ? "Airline updated." : "Airline added.");
      closeDialog();
    } catch {
      setToast({
        open: true,
        message: "Failed to save airline. Please try again.",
        severity: "error",
      });
    } finally {
      setIsSavingAirline(false);
    }
  };

  const deleteAirline = async (airline) => {
    const label = airline.name || codeOf(airline) || "this airline";
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return;

    const key = keyOf(airline);
    const next = allAirlines.filter((a) => keyOf(a) !== key);
    if (next.length === allAirlines.length) {
      setToast({
        open: true,
        message: "Could not identify that airline — reload and try again.",
        severity: "error",
      });
      return;
    }

    try {
      await persist(next, "Airline deleted.");
    } catch {
      setToast({
        open: true,
        message: "Failed to delete airline. Please try again.",
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
            Airline Information Hub
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            {allAirlines.length} airline{allAirlines.length === 1 ? "" : "s"} · published at /Airlines
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
          {missingCodeCount} airline{missingCodeCount === 1 ? " has" : "s have"} no IATA code, so{" "}
          {missingCodeCount === 1 ? "it has" : "they have"} no public page. Open each one and add
          its IATA code.
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
              Heading shown at the top of the public airline directory
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

      {/* Airlines list */}
      <Card sx={cardSx}>
        <CardHeader
          title={
            <Typography sx={{ color: "#FFFFFF", fontWeight: 600 }}>
              Airlines ({totalAirlines})
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
              Add airline
            </Button>
          }
          sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by name, IATA or ICAO code…"
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
                  <TableCell>Airline name</TableCell>
                  <TableCell>IATA</TableCell>
                  <TableCell>ICAO</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell align="center">Baggage</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {airlines.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      sx={{ py: 4, color: "text.secondary" }}
                    >
                      {debouncedSearch
                        ? "No airlines match your search."
                        : "No airlines yet. Click “Add airline” to get started."}
                    </TableCell>
                  </TableRow>
                ) : (
                  airlines.map((airline) => {
                    const code = codeOf(airline);
                    const baggage = baggageState(airline);
                    return (
                      <TableRow key={keyOf(airline)} hover>
                        <TableCell sx={{ color: "text.primary" }}>
                          {airline.name || "—"}
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
                        <TableCell sx={{ color: "text.primary" }}>{airline.icao || "—"}</TableCell>
                        <TableCell sx={{ color: "text.primary" }}>
                          {airline.country || airline.countryCode || "—"}
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
                            onClick={() => openDialog(airline)}
                            sx={{ color: "primary.main", mr: 1 }}
                            aria-label={`Edit ${airline.name || code}`}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => deleteAirline(airline)}
                            sx={{ color: "#ef4444" }}
                            aria-label={`Delete ${airline.name || code}`}
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
        </CardContent>
      </Card>

      {/* Add / edit dialog */}
      <Dialog open={modalOpen} onClose={closeDialog} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {editingKey ? "Edit airline" : "Add new airline"}
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
            </Tabs>

            <DialogContent dividers sx={{ borderColor: "rgba(255,255,255,0.08)" }}>
              {formError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {formError}
                </Alert>
              )}
              {tab === 0 && <AirlineBasicTab draft={draft} setField={setField} />}
              {tab === 1 && <ContentTab draft={draft} setField={setField} />}
              {tab === 2 && (
                <BaggageTab baggage={draft.baggage || {}} onPatch={patchBaggage} />
              )}
            </DialogContent>
          </>
        )}

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={closeDialog}
            disabled={isSavingAirline}
            sx={{ color: "text.secondary" }}
          >
            Cancel
          </Button>
          <Button
            onClick={saveAirline}
            variant="contained"
            disabled={isSavingAirline}
          >
            {isSavingAirline ? "Saving…" : editingKey ? "Save changes" : "Add airline"}
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
