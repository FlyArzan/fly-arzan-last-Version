import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Stack,
  TextField,
  Typography,
  Button,
  Alert,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  InputAdornment,
  Snackbar,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useCmsPage, useSaveCmsPage, usePaginatedAirports } from "@/hooks/useCms";

const cardSx = {
  borderRadius: 2,
  bgcolor: "#1A1D23",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
};

const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "#0B0F16",
    "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
    "&.Mui-focused fieldset": { borderColor: "#3B82F6", borderWidth: 1 },
  },
  "& .MuiInputLabel-root": {
    color: "#9ca3af",
    "&.Mui-focused": { color: "#3B82F6" },
  },
  "& input, & textarea": {
    color: "#e5e7eb",
    outline: "none !important",
    boxShadow: "none !important",
  },
};

const defaultContent = {
  hero: { title: "", subtitle: "" },
  airports: [],
};

const emptyAirport = {
  name: "",
  iataCode: "",
  city: "",
  country: "",
  flag: "",
  introduction: "",
  sections: [],
  tips: [],
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
  const [editingAirport, setEditingAirport] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  // Server-side pagination
  const { data: paginatedData, isLoading: isLoadingAirports } = usePaginatedAirports(
    page,
    rowsPerPage,
    debouncedSearch
  );

  useEffect(() => {
    if (data) {
      setTitle(data.title || "Airport Information Hub");
      setContent({ ...defaultContent, ...(data.content || {}) });
    }
  }, [data]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(0); // Reset to first page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const updateHero = (field, value) => {
    setContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }));
  };

  // Get airports and total from server-side pagination
  const airports = paginatedData?.airports || [];
  const totalAirports = paginatedData?.total || 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openAddModal = () => {
    setEditingAirport({ ...emptyAirport });
    setEditingIndex(null);
    setModalOpen(true);
  };

  const openEditModal = (airport, actualIndex) => {
    setEditingAirport({ ...airport });
    setEditingIndex(actualIndex);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingAirport(null);
    setEditingIndex(null);
  };

  const [isSavingAirport, setIsSavingAirport] = useState(false);

  const saveAirport = async () => {
    setIsSavingAirport(true);
    // Get the full current airports list from content
    const currentAirports = content.airports || [];
    let updatedAirports;
    
    if (editingIndex !== null) {
      // Edit existing - editingIndex is the global index
      updatedAirports = [...currentAirports];
      updatedAirports[editingIndex] = editingAirport;
    } else {
      // Add new
      updatedAirports = [...currentAirports, editingAirport];
    }

    // Save to backend immediately
    try {
      await saveMutation.mutateAsync({
        slug,
        payload: {
          slug,
          title,
          content: { ...content, airports: updatedAirports },
          status: "published",
        },
      });
      setContent((prev) => ({ ...prev, airports: updatedAirports }));
      setToast({
        open: true,
        message: editingIndex !== null ? "Airport updated successfully!" : "Airport added successfully!",
        severity: "success",
      });
      closeModal();
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

  const deleteAirport = async (globalIndex) => {
    if (window.confirm("Are you sure you want to delete this airport?")) {
      // Get full airports list and remove by global index
      const currentAirports = content.airports || [];
      const updatedAirports = currentAirports.filter((_, i) => i !== globalIndex);
      
      // Save to backend immediately
      try {
        await saveMutation.mutateAsync({
          slug,
          payload: {
            slug,
            title,
            content: { ...content, airports: updatedAirports },
            status: "published",
          },
        });
        setContent((prev) => ({ ...prev, airports: updatedAirports }));
        setToast({
          open: true,
          message: "Airport deleted successfully!",
          severity: "success",
        });
      } catch {
        setToast({
          open: true,
          message: "Failed to delete airport. Please try again.",
          severity: "error",
        });
      }
    }
  };

  const updateEditingAirport = (field, value) => {
    setEditingAirport((prev) => ({ ...prev, [field]: value }));
  };

  const addSection = () => {
    setEditingAirport((prev) => ({
      ...prev,
      sections: [...(prev.sections || []), { title: "", content: "" }],
    }));
  };

  const updateSection = (index, field, value) => {
    setEditingAirport((prev) => {
      const sections = [...(prev.sections || [])];
      sections[index] = { ...sections[index], [field]: value };
      return { ...prev, sections };
    });
  };

  const removeSection = (index) => {
    setEditingAirport((prev) => ({
      ...prev,
      sections: prev.sections?.filter((_, i) => i !== index) || [],
    }));
  };

  const addTip = () => {
    setEditingAirport((prev) => ({
      ...prev,
      tips: [...(prev.tips || []), ""],
    }));
  };

  const updateTip = (index, value) => {
    setEditingAirport((prev) => {
      const tips = [...(prev.tips || [])];
      tips[index] = value;
      return { ...prev, tips };
    });
  };

  const removeTip = (index) => {
    setEditingAirport((prev) => ({
      ...prev,
      tips: prev.tips?.filter((_, i) => i !== index) || [],
    }));
  };

  const onSave = async () => {
    try {
      await saveMutation.mutateAsync({
        slug,
        payload: { slug, title, content, status: "published" },
      });
      setToast({
        open: true,
        message: "Page settings saved successfully!",
        severity: "success",
      });
    } catch {
      setToast({
        open: true,
        message: "Failed to save page settings. Please try again.",
        severity: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 4 }}>
        <Typography sx={{ color: "#9ca3af" }}>Loading page content...</Typography>
      </Box>
    );
  }

  const isNewPage = !data;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#FFFFFF", fontFamily: "Inter" }}>
            Airport Information Hub
          </Typography>
          <Typography variant="body2" sx={{ color: "#71717A", mt: 0.5, fontFamily: "Inter" }}>
            Manage information for {content.airports?.length || 0} airports
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={onSave}
          disabled={saveMutation.isPending}
          sx={{ bgcolor: "#3B82F6", "&:hover": { bgcolor: "#2563EB" }, textTransform: "none", fontFamily: "Inter" }}
        >
          {saveMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </Box>

      {/* Alerts */}
      {isError && <Alert severity="error">Failed to load page content. Please check your connection.</Alert>}
      {isNewPage && !isError && <Alert severity="info">This page has not been created yet. Fill in the content and save to create it.</Alert>}

      {/* Page Settings */}
      <Card sx={cardSx}>
        <CardHeader
          title={<Typography sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}>Page Settings</Typography>}
          sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <TextField fullWidth label="Page Title" value={title} onChange={(e) => setTitle(e.target.value)} sx={textFieldSx} />
        </CardContent>
      </Card>

      {/* Hero Section */}
      <Card sx={cardSx}>
        <CardHeader
          title={<Typography sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}>Hero Section</Typography>}
          subheader={<Typography variant="caption" sx={{ color: "#71717A", fontFamily: "Inter" }}>The main banner at the top of the page</Typography>}
          sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <Stack spacing={2}>
            <TextField fullWidth label="Title" value={content.hero?.title || ""} onChange={(e) => updateHero("title", e.target.value)} sx={textFieldSx} />
            <TextField fullWidth label="Subtitle" value={content.hero?.subtitle || ""} onChange={(e) => updateHero("subtitle", e.target.value)} sx={textFieldSx} />
          </Stack>
        </CardContent>
      </Card>

      {/* Airports Table */}
      <Card sx={cardSx}>
        <CardHeader
          title={<Typography sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}>Airports ({totalAirports})</Typography>}
          action={
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={openAddModal}
              sx={{
                bgcolor: "#3B82F6",
                "&:hover": { bgcolor: "#2563EB" },
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Add Airport
            </Button>
          }
          sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          {/* Search */}
          <TextField
            fullWidth
            size="small"
            placeholder="Search airports..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#9ca3af" }} />
                </InputAdornment>
              ),
            }}
            sx={{ ...textFieldSx, mb: 2 }}
          />

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "#9ca3af", fontWeight: 600, borderColor: "rgba(255,255,255,0.08)" }}>Airport Name</TableCell>
                  <TableCell sx={{ color: "#9ca3af", fontWeight: 600, borderColor: "rgba(255,255,255,0.08)" }}>Code</TableCell>
                  <TableCell sx={{ color: "#9ca3af", fontWeight: 600, borderColor: "rgba(255,255,255,0.08)" }}>City</TableCell>
                  <TableCell sx={{ color: "#9ca3af", fontWeight: 600, borderColor: "rgba(255,255,255,0.08)" }}>Country</TableCell>
                  <TableCell align="right" sx={{ color: "#9ca3af", fontWeight: 600, borderColor: "rgba(255,255,255,0.08)" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoadingAirports ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ color: "#71717A", py: 4, borderColor: "rgba(255,255,255,0.08)" }}>
                      Loading airports...
                    </TableCell>
                  </TableRow>
                ) : airports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ color: "#71717A", py: 4, borderColor: "rgba(255,255,255,0.08)" }}>
                      {searchQuery ? "No airports found matching your search." : "No airports added yet. Click 'Add Airport' to get started."}
                    </TableCell>
                  </TableRow>
                ) : (
                  airports.map((airport, index) => {
                    // Find global index by matching airport data
                    const globalIndex = (content.airports || []).findIndex(
                      (a) => a.name === airport.name && a.iataCode === airport.iataCode
                    );
                    return (
                      <TableRow key={`${airport.iataCode}-${index}`} hover>
                        <TableCell sx={{ color: "#e5e7eb", borderColor: "rgba(255,255,255,0.08)" }}>{airport.name || "-"}</TableCell>
                        <TableCell sx={{ color: "#3B82F6", fontWeight: 600, borderColor: "rgba(255,255,255,0.08)" }}>{airport.iataCode || "-"}</TableCell>
                        <TableCell sx={{ color: "#e5e7eb", borderColor: "rgba(255,255,255,0.08)" }}>{airport.city || "-"}</TableCell>
                        <TableCell sx={{ color: "#e5e7eb", borderColor: "rgba(255,255,255,0.08)" }}>
                          {airport.flag && <span style={{ marginRight: 6 }}>{airport.flag}</span>}
                          {airport.country || "-"}
                        </TableCell>
                        <TableCell align="right" sx={{ borderColor: "rgba(255,255,255,0.08)" }}>
                          <IconButton size="small" onClick={() => openEditModal(airport, globalIndex)} sx={{ color: "#3B82F6", mr: 1 }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => deleteAirport(globalIndex)} sx={{ color: "#ef4444" }}>
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

          {/* Pagination */}
          {totalAirports > 0 && (
            <TablePagination
              component="div"
              count={totalAirports}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              sx={{
                color: "#9ca3af",
                ".MuiTablePagination-selectIcon": { color: "#9ca3af" },
                ".MuiTablePagination-actions button": { color: "#9ca3af" },
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onClose={closeModal} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: "#1A1D23", color: "#e5e7eb" } }}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: "Inter" }}>
            {editingIndex !== null ? "Edit Airport" : "Add New Airport"}
          </Typography>
          <IconButton size="small" onClick={closeModal} sx={{ color: "#9ca3af" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: "rgba(255,255,255,0.08)" }}>
          {editingAirport && (
            <Stack spacing={2.5}>
              {/* Basic Info */}
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  fullWidth
                  label="Airport Name"
                  placeholder="e.g., Dubai International Airport"
                  value={editingAirport.name || ""}
                  onChange={(e) => updateEditingAirport("name", e.target.value)}
                  sx={textFieldSx}
                />
                <TextField
                  label="IATA Code"
                  placeholder="e.g., DXB"
                  value={editingAirport.iataCode || ""}
                  onChange={(e) => updateEditingAirport("iataCode", e.target.value.toUpperCase())}
                  inputProps={{ style: { textTransform: "uppercase" }, maxLength: 3 }}
                  sx={{ ...textFieldSx, minWidth: 150 }}
                />
              </Stack>

              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField fullWidth label="City" placeholder="e.g., Dubai" value={editingAirport.city || ""} onChange={(e) => updateEditingAirport("city", e.target.value)} sx={textFieldSx} />
                <TextField fullWidth label="Country" placeholder="e.g., United Arab Emirates" value={editingAirport.country || ""} onChange={(e) => updateEditingAirport("country", e.target.value)} sx={textFieldSx} />
                <TextField label="Flag Emoji" placeholder="🇦🇪" value={editingAirport.flag || ""} onChange={(e) => updateEditingAirport("flag", e.target.value)} sx={{ ...textFieldSx, minWidth: 100 }} />
              </Stack>

              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Introduction"
                placeholder="General information about this airport..."
                value={editingAirport.introduction || ""}
                onChange={(e) => updateEditingAirport("introduction", e.target.value)}
                sx={textFieldSx}
              />

              <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

              {/* Sections */}
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="body2" sx={{ color: "#9ca3af", fontWeight: 600 }}>
                    Information Sections
                  </Typography>
                  <Button size="small" startIcon={<AddIcon />} onClick={addSection} sx={{ color: "#3B82F6", textTransform: "none" }}>
                    Add Section
                  </Button>
                </Box>
                <Stack spacing={2}>
                  {(editingAirport.sections || []).map((section, index) => (
                    <Stack key={index} spacing={1} sx={{ p: 2, bgcolor: "rgba(255,255,255,0.02)", borderRadius: 1, border: "1px solid rgba(255,255,255,0.05)" }}>
                      <Stack direction="row" spacing={1} alignItems="flex-start">
                        <TextField
                          fullWidth
                          size="small"
                          label="Section Title"
                          placeholder="e.g., Terminals, Transportation"
                          value={section.title || ""}
                          onChange={(e) => updateSection(index, "title", e.target.value)}
                          sx={textFieldSx}
                        />
                        <IconButton size="small" onClick={() => removeSection(index)} sx={{ color: "#ef4444" }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                      <TextField
                        fullWidth
                        multiline
                        minRows={2}
                        size="small"
                        label="Content"
                        placeholder="Detailed information..."
                        value={section.content || ""}
                        onChange={(e) => updateSection(index, "content", e.target.value)}
                        sx={textFieldSx}
                      />
                    </Stack>
                  ))}
                </Stack>
              </Box>

              <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

              {/* Tips */}
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="body2" sx={{ color: "#9ca3af", fontWeight: 600 }}>
                    Travel Tips
                  </Typography>
                  <Button size="small" startIcon={<AddIcon />} onClick={addTip} sx={{ color: "#3B82F6", textTransform: "none" }}>
                    Add Tip
                  </Button>
                </Box>
                <Stack spacing={1.5}>
                  {(editingAirport.tips || []).map((tip, index) => (
                    <Stack key={index} direction="row" spacing={1} alignItems="center">
                      <Typography sx={{ color: "#3B82F6" }}>•</Typography>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="e.g., Arrive 3 hours early for international flights"
                        value={tip}
                        onChange={(e) => updateTip(index, e.target.value)}
                        sx={textFieldSx}
                      />
                      <IconButton size="small" onClick={() => removeTip(index)} sx={{ color: "#ef4444" }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={closeModal} disabled={isSavingAirport} sx={{ color: "#9ca3af", textTransform: "none" }}>
            Cancel
          </Button>
          <Button 
            onClick={saveAirport} 
            variant="contained" 
            disabled={isSavingAirport}
            sx={{ bgcolor: "#3B82F6", "&:hover": { bgcolor: "#2563EB" }, textTransform: "none" }}
          >
            {isSavingAirport ? "Saving..." : (editingIndex !== null ? "Save Changes" : "Add Airport")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
