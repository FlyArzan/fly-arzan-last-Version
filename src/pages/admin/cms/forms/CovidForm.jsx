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
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { useCmsPage, useSaveCmsPage } from "@/hooks/useCms";

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
  introduction: "",
  guidelines: [],
  travelRestrictions: "",
  healthRequirements: "",
  lastUpdated: new Date().toISOString(),
};

export default function CovidForm() {
  const slug = "covid_19_info";
  const { data, isLoading, isError } = useCmsPage(slug);
  const saveMutation = useSaveCmsPage();

  const [title, setTitle] = useState("COVID-19 Travel Information");
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    if (data) {
      setTitle(data.title || "COVID-19 Travel Information");
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

  const addGuideline = () => {
    setContent((prev) => ({
      ...prev,
      guidelines: [...(prev.guidelines || []), { title: "", description: "" }],
    }));
  };

  const updateGuideline = (index, field, value) => {
    setContent((prev) => {
      const guidelines = [...(prev.guidelines || [])];
      guidelines[index] = { ...guidelines[index], [field]: value };
      return { ...prev, guidelines };
    });
  };

  const removeGuideline = (index) => {
    setContent((prev) => ({
      ...prev,
      guidelines: prev.guidelines?.filter((_, i) => i !== index) || [],
    }));
  };

  const onSave = () => {
    const updatedContent = {
      ...content,
      lastUpdated: new Date().toISOString(),
    };
    saveMutation.mutate({
      slug,
      payload: { slug, title, content: updatedContent, status: "published" },
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
            COVID-19 Information Page
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#71717A", mt: 0.5, fontFamily: "Inter" }}
          >
            Manage COVID-19 travel guidelines and requirements
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
              General information about COVID-19 travel
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

      {/* Travel Guidelines */}
      <Card sx={cardSx}>
        <CardHeader
          title={
            <Typography
              sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}
            >
              Travel Guidelines
            </Typography>
          }
          subheader={
            <Typography
              variant="caption"
              sx={{ color: "#71717A", fontFamily: "Inter" }}
            >
              Add specific guidelines for travelers
            </Typography>
          }
          action={
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={addGuideline}
              sx={{ color: "#3B82F6" }}
            >
              Add Guideline
            </Button>
          }
          sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <Stack spacing={2}>
            {(content.guidelines || []).map((guideline, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <Stack spacing={2}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography
                      sx={{
                        color: "#9ca3af",
                        fontSize: 12,
                        fontFamily: "Inter",
                      }}
                    >
                      Guideline {index + 1}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => removeGuideline(index)}
                      sx={{ color: "#ef4444" }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                  <TextField
                    fullWidth
                    label="Title"
                    value={guideline.title || ""}
                    onChange={(e) =>
                      updateGuideline(index, "title", e.target.value)
                    }
                    sx={textFieldSx}
                  />
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    label="Description"
                    value={guideline.description || ""}
                    onChange={(e) =>
                      updateGuideline(index, "description", e.target.value)
                    }
                    sx={textFieldSx}
                  />
                </Stack>
              </Box>
            ))}
            {(!content.guidelines || content.guidelines.length === 0) && (
              <Typography
                variant="body2"
                sx={{ color: "#71717A", textAlign: "center", py: 3 }}
              >
                No guidelines added yet. Click &ldquo;Add Guideline&rdquo; to
                get started.
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Travel Restrictions */}
      <Card sx={cardSx}>
        <CardHeader
          title={
            <Typography
              sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}
            >
              Travel Restrictions
            </Typography>
          }
          subheader={
            <Typography
              variant="caption"
              sx={{ color: "#71717A", fontFamily: "Inter" }}
            >
              Current travel restrictions and entry requirements
            </Typography>
          }
          sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Travel Restrictions"
            value={content.travelRestrictions || ""}
            onChange={(e) => updateField("travelRestrictions", e.target.value)}
            sx={textFieldSx}
          />
        </CardContent>
      </Card>

      {/* Health Requirements */}
      <Card sx={cardSx}>
        <CardHeader
          title={
            <Typography
              sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}
            >
              Health Requirements
            </Typography>
          }
          subheader={
            <Typography
              variant="caption"
              sx={{ color: "#71717A", fontFamily: "Inter" }}
            >
              Vaccination, testing, and health documentation requirements
            </Typography>
          }
          sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Health Requirements"
            value={content.healthRequirements || ""}
            onChange={(e) => updateField("healthRequirements", e.target.value)}
            sx={textFieldSx}
          />
        </CardContent>
      </Card>

      {/* Last Updated Info */}
      <Card sx={cardSx}>
        <CardContent sx={{ px: 2.5, py: 2 }}>
          <Typography
            variant="caption"
            sx={{ color: "#71717A", fontFamily: "Inter" }}
          >
            Last updated:{" "}
            {content.lastUpdated
              ? new Date(content.lastUpdated).toLocaleString()
              : "Never"}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
