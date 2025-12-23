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
  Divider,
  Alert,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Flag as FlagIcon,
} from "@mui/icons-material";
import { useCmsPage, useSaveCmsPage } from "@/hooks/useCms";

const cardSx = {
  borderRadius: 2,
  bgcolor: "#1A1D23",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
};

// Common TextField styling to fix focus outline and border issues
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
  introduction: "",
  countries: [],
  generalInfo: "",
};

export default function VisaRequirementsForm() {
  const slug = "visa_requirements";
  const { data, isLoading, isError } = useCmsPage(slug);
  const saveMutation = useSaveCmsPage();

  const [title, setTitle] = useState("Visa Requirements");
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    if (data) {
      setTitle(data.title || "Visa Requirements");
      setContent({ ...defaultContent, ...(data.content || {}) });
    }
  }, [data]);

  const updateHero = (field, value) => {
    setContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }));
  };

  const updateField = (field, value) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  const addCountry = () => {
    setContent((prev) => ({
      ...prev,
      countries: [
        ...(prev.countries || []),
        {
          name: "",
          code: "",
          visaRequired: true,
          requirements: "",
          processingTime: "",
          fees: "",
          documents: [],
        },
      ],
    }));
  };

  const updateCountry = (index, field, value) => {
    setContent((prev) => {
      const countries = [...(prev.countries || [])];
      countries[index] = { ...countries[index], [field]: value };
      return { ...prev, countries };
    });
  };

  const removeCountry = (index) => {
    setContent((prev) => ({
      ...prev,
      countries: prev.countries?.filter((_, i) => i !== index) || [],
    }));
  };

  const addDocument = (countryIndex) => {
    setContent((prev) => {
      const countries = [...(prev.countries || [])];
      countries[countryIndex] = {
        ...countries[countryIndex],
        documents: [...(countries[countryIndex].documents || []), ""],
      };
      return { ...prev, countries };
    });
  };

  const updateDocument = (countryIndex, docIndex, value) => {
    setContent((prev) => {
      const countries = [...(prev.countries || [])];
      const documents = [...(countries[countryIndex].documents || [])];
      documents[docIndex] = value;
      countries[countryIndex] = { ...countries[countryIndex], documents };
      return { ...prev, countries };
    });
  };

  const removeDocument = (countryIndex, docIndex) => {
    setContent((prev) => {
      const countries = [...(prev.countries || [])];
      countries[countryIndex] = {
        ...countries[countryIndex],
        documents:
          countries[countryIndex].documents?.filter((_, i) => i !== docIndex) ||
          [],
      };
      return { ...prev, countries };
    });
  };

  const onSave = () => {
    saveMutation.mutate({
      slug,
      payload: { slug, title, content, status: "published" },
    });
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
        }}
      >
        <Typography sx={{ color: "#9ca3af" }}>
          Loading page content...
        </Typography>
      </Box>
    );
  }

  const isNewPage = !data;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, color: "#FFFFFF", fontFamily: "Inter" }}
          >
            Visa Requirements Page
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#71717A", mt: 0.5, fontFamily: "Inter" }}
          >
            Manage visa information for {content.countries?.length || 0}{" "}
            countries
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={onSave}
          disabled={saveMutation.isPending}
          sx={{
            bgcolor: "#3B82F6",
            "&:hover": { bgcolor: "#2563EB" },
            textTransform: "none",
            fontFamily: "Inter",
          }}
        >
          {saveMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </Box>

      {isError && (
        <Alert severity="error">
          Failed to load page content. Please check your connection.
        </Alert>
      )}
      {isNewPage && !isError && (
        <Alert severity="info">
          This page has not been created yet. Fill in the content and save to
          create it.
        </Alert>
      )}
      {saveMutation.isError && (
        <Alert severity="error">Failed to save changes</Alert>
      )}
      {saveMutation.isSuccess && (
        <Alert severity="success">Changes saved successfully!</Alert>
      )}

      {/* Page Settings */}
      <Card sx={cardSx}>
        <CardHeader
          title={
            <Typography
              sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}
            >
              Page Settings
            </Typography>
          }
          sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <TextField
            fullWidth
            label="Page Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={textFieldSx}
          />
        </CardContent>
      </Card>

      {/* Hero Section */}
      <Card sx={cardSx}>
        <CardHeader
          title={
            <Typography
              sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}
            >
              Hero Section
            </Typography>
          }
          subheader={
            <Typography
              variant="caption"
              sx={{ color: "#71717A", fontFamily: "Inter" }}
            >
              The main banner at the top of the page
            </Typography>
          }
          sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Title"
              value={content.hero?.title || ""}
              onChange={(e) => updateHero("title", e.target.value)}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Subtitle"
              value={content.hero?.subtitle || ""}
              onChange={(e) => updateHero("subtitle", e.target.value)}
              sx={textFieldSx}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Introduction */}
      <Card sx={cardSx}>
        <CardHeader
          title={
            <Typography
              sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}
            >
              Introduction
            </Typography>
          }
          subheader={
            <Typography
              variant="caption"
              sx={{ color: "#71717A", fontFamily: "Inter" }}
            >
              General information about visa requirements
            </Typography>
          }
          sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Introduction Text"
            value={content.introduction || ""}
            onChange={(e) => updateField("introduction", e.target.value)}
            sx={textFieldSx}
          />
        </CardContent>
      </Card>

      {/* Countries */}
      <Card sx={cardSx}>
        <CardHeader
          title={
            <Typography
              sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}
            >
              Country-Specific Requirements
            </Typography>
          }
          subheader={
            <Typography
              variant="caption"
              sx={{ color: "#71717A", fontFamily: "Inter" }}
            >
              Add visa requirements for each destination country
            </Typography>
          }
          action={
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={addCountry}
              sx={{ color: "#3B82F6" }}
            >
              Add Country
            </Button>
          }
          sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <Stack spacing={2}>
            {(content.countries || []).map((country, countryIndex) => (
              <Accordion
                key={countryIndex}
                sx={{
                  bgcolor: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#9ca3af" }} />}
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ width: "100%" }}
                  >
                    <FlagIcon sx={{ color: "#3B82F6" }} />
                    <Typography
                      sx={{
                        color: "#e5e7eb",
                        fontFamily: "Inter",
                        flexGrow: 1,
                      }}
                    >
                      {country.name || `Country ${countryIndex + 1}`}
                    </Typography>
                    {country.code && (
                      <Chip
                        label={country.code}
                        size="small"
                        sx={{
                          bgcolor: "rgba(59, 130, 246, 0.1)",
                          color: "#3B82F6",
                        }}
                      />
                    )}
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCountry(countryIndex);
                      }}
                      sx={{ color: "#ef4444" }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                      <TextField
                        fullWidth
                        label="Country Name"
                        value={country.name || ""}
                        onChange={(e) =>
                          updateCountry(countryIndex, "name", e.target.value)
                        }
                        sx={textFieldSx}
                      />
                      <TextField
                        label="Country Code"
                        placeholder="e.g., KZ, AE, TR"
                        value={country.code || ""}
                        onChange={(e) =>
                          updateCountry(
                            countryIndex,
                            "code",
                            e.target.value.toUpperCase()
                          )
                        }
                        inputProps={{
                          style: { textTransform: "uppercase" },
                          maxLength: 3,
                        }}
                        sx={{ ...textFieldSx, minWidth: 150 }}
                      />
                    </Stack>

                    <TextField
                      fullWidth
                      multiline
                      minRows={3}
                      label="Requirements Description"
                      value={country.requirements || ""}
                      onChange={(e) =>
                        updateCountry(
                          countryIndex,
                          "requirements",
                          e.target.value
                        )
                      }
                      sx={textFieldSx}
                    />

                    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                      <TextField
                        fullWidth
                        label="Processing Time"
                        placeholder="e.g., 3-5 business days"
                        value={country.processingTime || ""}
                        onChange={(e) =>
                          updateCountry(
                            countryIndex,
                            "processingTime",
                            e.target.value
                          )
                        }
                        sx={textFieldSx}
                      />
                      <TextField
                        fullWidth
                        label="Visa Fees"
                        placeholder="e.g., $50 USD"
                        value={country.fees || ""}
                        onChange={(e) =>
                          updateCountry(countryIndex, "fees", e.target.value)
                        }
                        sx={textFieldSx}
                      />
                    </Stack>

                    <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: "#9ca3af", fontFamily: "Inter" }}
                      >
                        Required Documents
                      </Typography>
                      <Button
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => addDocument(countryIndex)}
                        sx={{ color: "#3B82F6" }}
                      >
                        Add Document
                      </Button>
                    </Box>

                    {(country.documents || []).map((doc, docIndex) => (
                      <Stack
                        key={docIndex}
                        direction="row"
                        spacing={1}
                        alignItems="center"
                      >
                        <Typography sx={{ color: "#3B82F6" }}>•</Typography>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="e.g., Valid passport"
                          value={doc}
                          onChange={(e) =>
                            updateDocument(
                              countryIndex,
                              docIndex,
                              e.target.value
                            )
                          }
                          sx={textFieldSx}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeDocument(countryIndex, docIndex)}
                          sx={{ color: "#ef4444" }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    ))}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            ))}
            {(!content.countries || content.countries.length === 0) && (
              <Typography
                variant="body2"
                sx={{ color: "#71717A", textAlign: "center", py: 3 }}
              >
                No countries added yet. Click &ldquo;Add Country&rdquo; to get
                started.
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* General Info */}
      <Card sx={cardSx}>
        <CardHeader
          title={
            <Typography
              sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}
            >
              General Information
            </Typography>
          }
          subheader={
            <Typography
              variant="caption"
              sx={{ color: "#71717A", fontFamily: "Inter" }}
            >
              Additional notes or disclaimers
            </Typography>
          }
          sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="General Information"
            placeholder="e.g., Visa requirements may change. Please verify with the embassy..."
            value={content.generalInfo || ""}
            onChange={(e) => updateField("generalInfo", e.target.value)}
            sx={textFieldSx}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
