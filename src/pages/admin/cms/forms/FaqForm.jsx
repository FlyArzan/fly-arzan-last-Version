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
  QuestionAnswer as QuestionIcon,
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
  categories: [],
};

export default function FaqForm() {
  const slug = "faq";
  const { data, isLoading, isError } = useCmsPage(slug);
  const saveMutation = useSaveCmsPage();

  const [title, setTitle] = useState("FAQ");
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    if (data) {
      setTitle(data.title || "FAQ");
      setContent({ ...defaultContent, ...(data.content || {}) });
    }
  }, [data]);

  const updateHero = (field, value) => {
    setContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }));
  };

  const addCategory = () => {
    setContent((prev) => ({
      ...prev,
      categories: [
        ...(prev.categories || []),
        { name: "New Category", items: [] },
      ],
    }));
  };

  const updateCategoryName = (catIndex, name) => {
    setContent((prev) => {
      const categories = [...(prev.categories || [])];
      categories[catIndex] = { ...categories[catIndex], name };
      return { ...prev, categories };
    });
  };

  const removeCategory = (catIndex) => {
    setContent((prev) => ({
      ...prev,
      categories: prev.categories?.filter((_, i) => i !== catIndex) || [],
    }));
  };

  const addFaqItem = (catIndex) => {
    setContent((prev) => {
      const categories = [...(prev.categories || [])];
      categories[catIndex] = {
        ...categories[catIndex],
        items: [
          ...(categories[catIndex].items || []),
          { question: "", answer: "" },
        ],
      };
      return { ...prev, categories };
    });
  };

  const updateFaqItem = (catIndex, itemIndex, field, value) => {
    setContent((prev) => {
      const categories = [...(prev.categories || [])];
      const items = [...(categories[catIndex].items || [])];
      items[itemIndex] = { ...items[itemIndex], [field]: value };
      categories[catIndex] = { ...categories[catIndex], items };
      return { ...prev, categories };
    });
  };

  const removeFaqItem = (catIndex, itemIndex) => {
    setContent((prev) => {
      const categories = [...(prev.categories || [])];
      categories[catIndex] = {
        ...categories[catIndex],
        items:
          categories[catIndex].items?.filter((_, i) => i !== itemIndex) || [],
      };
      return { ...prev, categories };
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
  const totalFaqs = (content.categories || []).reduce(
    (acc, cat) => acc + (cat.items?.length || 0),
    0
  );

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
            FAQ Page
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#71717A", mt: 0.5, fontFamily: "Inter" }}
          >
            Manage frequently asked questions ({totalFaqs} questions in{" "}
            {content.categories?.length || 0} categories)
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
              The main banner at the top of the FAQ page
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

      {/* FAQ Categories */}
      <Card sx={cardSx}>
        <CardHeader
          title={
            <Typography
              sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}
            >
              FAQ Categories
            </Typography>
          }
          subheader={
            <Typography
              variant="caption"
              sx={{ color: "#71717A", fontFamily: "Inter" }}
            >
              Organize your FAQs into categories (e.g., General, Booking,
              Payment)
            </Typography>
          }
          action={
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={addCategory}
              sx={{ color: "#3B82F6" }}
            >
              Add Category
            </Button>
          }
          sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <Stack spacing={3}>
            {(content.categories || []).map((category, catIndex) => (
              <Box
                key={catIndex}
                sx={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 2,
                  p: 2,
                  bgcolor: "rgba(255,255,255,0.02)",
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <TextField
                    label="Category Name"
                    value={category.name || ""}
                    onChange={(e) =>
                      updateCategoryName(catIndex, e.target.value)
                    }
                    sx={textFieldSx}
                  />
                  <Chip
                    label={`${category.items?.length || 0} FAQs`}
                    size="small"
                    sx={{
                      bgcolor: "rgba(59, 130, 246, 0.1)",
                      color: "#3B82F6",
                    }}
                  />
                  <IconButton
                    onClick={() => removeCategory(catIndex)}
                    sx={{ color: "#ef4444" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>

                <Divider
                  sx={{ borderColor: "rgba(255,255,255,0.08)", mb: 2 }}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "#9ca3af", fontFamily: "Inter" }}
                  >
                    Questions & Answers
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => addFaqItem(catIndex)}
                    sx={{ color: "#3B82F6" }}
                  >
                    Add FAQ
                  </Button>
                </Box>

                <Stack spacing={1}>
                  {(category.items || []).map((item, itemIndex) => (
                    <Accordion
                      key={itemIndex}
                      sx={{
                        bgcolor: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        "&:before": { display: "none" },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={
                          <ExpandMoreIcon sx={{ color: "#9ca3af" }} />
                        }
                      >
                        <Stack
                          direction="row"
                          spacing={2}
                          alignItems="center"
                          sx={{ width: "100%" }}
                        >
                          <QuestionIcon
                            sx={{ color: "#3B82F6", fontSize: 20 }}
                          />
                          <Typography
                            sx={{
                              color: "#e5e7eb",
                              fontFamily: "Inter",
                              flexGrow: 1,
                            }}
                            noWrap
                          >
                            {item.question || `Question ${itemIndex + 1}`}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFaqItem(catIndex, itemIndex);
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
                            label="Question"
                            value={item.question || ""}
                            onChange={(e) =>
                              updateFaqItem(
                                catIndex,
                                itemIndex,
                                "question",
                                e.target.value
                              )
                            }
                            sx={textFieldSx}
                          />
                          <TextField
                            fullWidth
                            multiline
                            minRows={3}
                            label="Answer"
                            value={item.answer || ""}
                            onChange={(e) =>
                              updateFaqItem(
                                catIndex,
                                itemIndex,
                                "answer",
                                e.target.value
                              )
                            }
                            sx={textFieldSx}
                          />
                        </Stack>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                  {(!category.items || category.items.length === 0) && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#71717A",
                        textAlign: "center",
                        py: 2,
                        fontStyle: "italic",
                      }}
                    >
                      No FAQs in this category. Click &ldquo;Add FAQ&rdquo; to
                      create one.
                    </Typography>
                  )}
                </Stack>
              </Box>
            ))}
            {(!content.categories || content.categories.length === 0) && (
              <Typography
                variant="body2"
                sx={{ color: "#71717A", textAlign: "center", py: 3 }}
              >
                No categories added yet. Click &ldquo;Add Category&rdquo; to get
                started.
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
