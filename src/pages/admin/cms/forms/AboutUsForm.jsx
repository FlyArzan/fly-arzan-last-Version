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
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
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
  hero: { heading: "", subheading: "" },
  whoWeAre: { title: "", paragraphs: [""] },
  services: [],
  features: [],
  whyChooseUs: { title: "", subtitle: "", items: [] },
};

export default function AboutUsForm() {
  const slug = "about_us";
  const { data, isLoading, isError } = useCmsPage(slug);
  const saveMutation = useSaveCmsPage();

  const [title, setTitle] = useState("About Us");
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    if (data) {
      setTitle(data.title || "About Us");
      setContent({ ...defaultContent, ...(data.content || {}) });
    }
  }, [data]);

  const updateContent = (path, value) => {
    setContent((prev) => {
      const updated = { ...prev };
      const keys = path.split(".");
      let obj = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const addParagraph = () => {
    setContent((prev) => ({
      ...prev,
      whoWeAre: {
        ...prev.whoWeAre,
        paragraphs: [...(prev.whoWeAre?.paragraphs || []), ""],
      },
    }));
  };

  const updateParagraph = (index, value) => {
    setContent((prev) => {
      const paragraphs = [...(prev.whoWeAre?.paragraphs || [])];
      paragraphs[index] = value;
      return { ...prev, whoWeAre: { ...prev.whoWeAre, paragraphs } };
    });
  };

  const removeParagraph = (index) => {
    setContent((prev) => ({
      ...prev,
      whoWeAre: {
        ...prev.whoWeAre,
        paragraphs:
          prev.whoWeAre?.paragraphs?.filter((_, i) => i !== index) || [],
      },
    }));
  };

  const addService = () => {
    setContent((prev) => ({
      ...prev,
      services: [...(prev.services || []), { title: "", description: "" }],
    }));
  };

  const updateService = (index, field, value) => {
    setContent((prev) => {
      const services = [...(prev.services || [])];
      services[index] = { ...services[index], [field]: value };
      return { ...prev, services };
    });
  };

  const removeService = (index) => {
    setContent((prev) => ({
      ...prev,
      services: prev.services?.filter((_, i) => i !== index) || [],
    }));
  };

  const addFeature = () => {
    setContent((prev) => ({
      ...prev,
      features: [...(prev.features || []), { title: "", description: "" }],
    }));
  };

  const updateFeature = (index, field, value) => {
    setContent((prev) => {
      const features = [...(prev.features || [])];
      features[index] = { ...features[index], [field]: value };
      return { ...prev, features };
    });
  };

  const removeFeature = (index) => {
    setContent((prev) => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || [],
    }));
  };

  const addWhyChooseUsItem = () => {
    setContent((prev) => ({
      ...prev,
      whyChooseUs: {
        ...prev.whyChooseUs,
        items: [
          ...(prev.whyChooseUs?.items || []),
          { title: "", description: "" },
        ],
      },
    }));
  };

  const updateWhyChooseUsItem = (index, field, value) => {
    setContent((prev) => {
      const items = [...(prev.whyChooseUs?.items || [])];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, whyChooseUs: { ...prev.whyChooseUs, items } };
    });
  };

  const removeWhyChooseUsItem = (index) => {
    setContent((prev) => ({
      ...prev,
      whyChooseUs: {
        ...prev.whyChooseUs,
        items: prev.whyChooseUs?.items?.filter((_, i) => i !== index) || [],
      },
    }));
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
            About Us Page
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#71717A", mt: 0.5, fontFamily: "Inter" }}
          >
            Manage the content for the About Us page
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

      {/* Page Title */}
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
              label="Heading"
              value={content.hero?.heading || ""}
              onChange={(e) => updateContent("hero.heading", e.target.value)}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Subheading"
              value={content.hero?.subheading || ""}
              onChange={(e) => updateContent("hero.subheading", e.target.value)}
              sx={textFieldSx}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Who We Are Section */}
      <Card sx={cardSx}>
        <CardHeader
          title={
            <Typography
              sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}
            >
              Who We Are
            </Typography>
          }
          subheader={
            <Typography
              variant="caption"
              sx={{ color: "#71717A", fontFamily: "Inter" }}
            >
              Company introduction and description
            </Typography>
          }
          sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Section Title"
              value={content.whoWeAre?.title || ""}
              onChange={(e) => updateContent("whoWeAre.title", e.target.value)}
              sx={textFieldSx}
            />
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
                Paragraphs
              </Typography>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={addParagraph}
                sx={{ color: "#3B82F6" }}
              >
                Add Paragraph
              </Button>
            </Box>
            {(content.whoWeAre?.paragraphs || []).map((para, index) => (
              <Stack
                key={index}
                direction="row"
                spacing={1}
                alignItems="flex-start"
              >
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  label={`Paragraph ${index + 1}`}
                  value={para}
                  onChange={(e) => updateParagraph(index, e.target.value)}
                  sx={textFieldSx}
                />
                <IconButton
                  onClick={() => removeParagraph(index)}
                  sx={{ color: "#ef4444", mt: 1 }}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Services Section */}
      <Card sx={cardSx}>
        <CardHeader
          title={
            <Typography
              sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}
            >
              Our Services
            </Typography>
          }
          subheader={
            <Typography
              variant="caption"
              sx={{ color: "#71717A", fontFamily: "Inter" }}
            >
              Services offered (Ticket, Hotel, Rent Car, etc.)
            </Typography>
          }
          action={
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={addService}
              sx={{ color: "#3B82F6" }}
            >
              Add Service
            </Button>
          }
          sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <Stack spacing={2}>
            {(content.services || []).map((service, index) => (
              <Accordion
                key={index}
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
                    <Typography sx={{ color: "#e5e7eb", fontFamily: "Inter" }}>
                      {service.title || `Service ${index + 1}`}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeService(index);
                      }}
                      sx={{ color: "#ef4444" }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Service Title"
                      value={service.title || ""}
                      onChange={(e) =>
                        updateService(index, "title", e.target.value)
                      }
                      sx={textFieldSx}
                    />
                    <TextField
                      fullWidth
                      multiline
                      minRows={2}
                      label="Description"
                      value={service.description || ""}
                      onChange={(e) =>
                        updateService(index, "description", e.target.value)
                      }
                      sx={textFieldSx}
                    />
                  </Stack>
                </AccordionDetails>
              </Accordion>
            ))}
            {(!content.services || content.services.length === 0) && (
              <Typography
                variant="body2"
                sx={{ color: "#71717A", textAlign: "center", py: 2 }}
              >
                No services added yet. Click &ldquo;Add Service&rdquo; to create
                one.
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Features Section */}
      <Card sx={cardSx}>
        <CardHeader
          title={
            <Typography
              sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}
            >
              Features
            </Typography>
          }
          subheader={
            <Typography
              variant="caption"
              sx={{ color: "#71717A", fontFamily: "Inter" }}
            >
              Key features and benefits
            </Typography>
          }
          action={
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={addFeature}
              sx={{ color: "#3B82F6" }}
            >
              Add Feature
            </Button>
          }
          sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <Stack spacing={2}>
            {(content.features || []).map((feature, index) => (
              <Stack
                key={index}
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems="flex-start"
              >
                <TextField
                  fullWidth
                  label="Feature Title"
                  value={feature.title || ""}
                  onChange={(e) =>
                    updateFeature(index, "title", e.target.value)
                  }
                  sx={textFieldSx}
                />
                <TextField
                  fullWidth
                  label="Description"
                  value={feature.description || ""}
                  onChange={(e) =>
                    updateFeature(index, "description", e.target.value)
                  }
                  sx={textFieldSx}
                />
                <IconButton
                  onClick={() => removeFeature(index)}
                  sx={{ color: "#ef4444", mt: { xs: 0, md: 1 } }}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            ))}
            {(!content.features || content.features.length === 0) && (
              <Typography
                variant="body2"
                sx={{ color: "#71717A", textAlign: "center", py: 2 }}
              >
                No features added yet. Click &ldquo;Add Feature&rdquo; to create
                one.
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Why Choose Us Section */}
      <Card sx={cardSx}>
        <CardHeader
          title={
            <Typography
              sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}
            >
              Why Choose Us
            </Typography>
          }
          subheader={
            <Typography
              variant="caption"
              sx={{ color: "#71717A", fontFamily: "Inter" }}
            >
              Reasons to choose your service
            </Typography>
          }
          action={
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={addWhyChooseUsItem}
              sx={{ color: "#3B82F6" }}
            >
              Add Item
            </Button>
          }
          sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Section Title"
              value={content.whyChooseUs?.title || ""}
              onChange={(e) =>
                updateContent("whyChooseUs.title", e.target.value)
              }
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Section Subtitle"
              value={content.whyChooseUs?.subtitle || ""}
              onChange={(e) =>
                updateContent("whyChooseUs.subtitle", e.target.value)
              }
              sx={textFieldSx}
            />
            <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
            {(content.whyChooseUs?.items || []).map((item, index) => (
              <Stack
                key={index}
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems="flex-start"
              >
                <TextField
                  fullWidth
                  label="Item Title"
                  value={item.title || ""}
                  onChange={(e) =>
                    updateWhyChooseUsItem(index, "title", e.target.value)
                  }
                  sx={textFieldSx}
                />
                <TextField
                  fullWidth
                  label="Description"
                  value={item.description || ""}
                  onChange={(e) =>
                    updateWhyChooseUsItem(index, "description", e.target.value)
                  }
                  sx={textFieldSx}
                />
                <IconButton
                  onClick={() => removeWhyChooseUsItem(index)}
                  sx={{ color: "#ef4444", mt: { xs: 0, md: 1 } }}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            ))}
            {(!content.whyChooseUs?.items ||
              content.whyChooseUs.items.length === 0) && (
              <Typography
                variant="body2"
                sx={{ color: "#71717A", textAlign: "center", py: 2 }}
              >
                No items added yet. Click &ldquo;Add Item&rdquo; to create one.
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
