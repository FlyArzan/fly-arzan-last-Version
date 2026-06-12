import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box, Typography, Button, TextField, Stack, Card, CardHeader,
  CardContent, Alert, Chip, FormControl, InputLabel, Select,
  MenuItem, OutlinedInput, Checkbox, ListItemText, IconButton, Divider,
} from "@mui/material";
import {
  Save as SaveIcon, ArrowBack as ArrowBackIcon,
  Add as AddIcon, Delete as DeleteIcon,
} from "@mui/icons-material";
import { useAdminArticle, useSaveArticle, useArticleCategories } from "@/hooks/useArticles";
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
  "& input, & textarea, & .MuiSelect-select": { color: "#e5e7eb" },
};

const labelSx = { color: "#9ca3af", fontFamily: "Inter", fontSize: 13, mb: 0.5 };

const defaultForm = {
  title: "", slug: "", shortSummary: "", body: "", featuredImage: "",
  imageAlt: "", authorName: "Fly Arzan Travel Team", readingTime: "",
  metaTitle: "", metaDescription: "", keywords: "", status: "draft",
  publishedAt: "", categoryIds: [], faqs: [], relatedArticles: [],
};

const slugify = (str) =>
  str.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();

export default function ArticleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id && id !== "new");

  const { data: existing, isLoading } = useAdminArticle(isEdit ? id : null);
  const { data: categories = [] } = useArticleCategories();
  const saveMutation = useSaveArticle();

  const [form, setForm] = useState(defaultForm);
  const [slugManuallySet, setSlugManuallySet] = useState(false);

  useEffect(() => {
    if (isEdit && existing) {
      setForm({
        title: existing.title || "",
        slug: existing.slug || "",
        shortSummary: existing.shortSummary || "",
        body: existing.body || "",
        featuredImage: existing.featuredImage || "",
        imageAlt: existing.imageAlt || "",
        authorName: existing.authorName || "Fly Arzan Travel Team",
        readingTime: existing.readingTime?.toString() || "",
        metaTitle: existing.metaTitle || "",
        metaDescription: existing.metaDescription || "",
        keywords: existing.keywords || "",
        status: existing.status || "draft",
        publishedAt: existing.publishedAt ? existing.publishedAt.substring(0, 10) : "",
        categoryIds: (existing.articleCategory || []).map((c) => c.id),
        faqs: Array.isArray(existing.faqs) ? existing.faqs : [],
        relatedArticles: Array.isArray(existing.relatedArticles) ? existing.relatedArticles : [],
      });
      setSlugManuallySet(true);
    }
  }, [isEdit, existing]);

  const set = (field) => (e) => {
    const val = e.target ? e.target.value : e;
    setForm((prev) => {
      const next = { ...prev, [field]: val };
      if (field === "title" && !slugManuallySet) {
        next.slug = slugify(val);
      }
      return next;
    });
  };

  const handleSlugChange = (e) => {
    setSlugManuallySet(true);
    setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }));
  };

  const addFaq = () => setForm((p) => ({ ...p, faqs: [...p.faqs, { question: "", answer: "" }] }));
  const updateFaq = (i, field, val) =>
    setForm((p) => { const faqs = [...p.faqs]; faqs[i] = { ...faqs[i], [field]: val }; return { ...p, faqs }; });
  const removeFaq = (i) => setForm((p) => ({ ...p, faqs: p.faqs.filter((_, idx) => idx !== i) }));

  const handleSave = () => {
    if (!form.title || !form.slug || !form.body) {
      toast.error("Title, slug, and body are required");
      return;
    }
    const payload = { ...form, body: form.body };
    saveMutation.mutate(
      { id: isEdit ? id : null, data: payload },
      {
        onSuccess: (data) => {
          toast.success(isEdit ? "Article updated" : "Article created");
          if (!isEdit) navigate(`/admin/content/articles/${data.id}`);
        },
        onError: (err) => toast.error(err.message || "Failed to save article"),
      }
    );
  };

  if (isEdit && isLoading) {
    return (
      <Box sx={{ p: 4, color: "#9ca3af", fontFamily: "Inter" }}>Loading article…</Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton onClick={() => navigate("/admin/content/articles")} sx={{ color: "#9ca3af" }}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#FFFFFF", fontFamily: "Inter" }}>
              {isEdit ? "Edit Article" : "New Article"}
            </Typography>
            {isEdit && (
              <Typography variant="body2" sx={{ color: "#71717A", fontFamily: "Inter" }}>
                /travel-guides/…/{form.slug}
              </Typography>
            )}
          </Box>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            onClick={() => { setForm((p) => ({ ...p, status: "draft" })); setTimeout(handleSave, 0); }}
            disabled={saveMutation.isPending}
            sx={{ color: "#9ca3af", borderColor: "rgba(255,255,255,0.1)", textTransform: "none" }}
          >
            Save as Draft
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => { if (form.status === "draft") setForm((p) => ({ ...p, status: "published" })); handleSave(); }}
            disabled={saveMutation.isPending}
            sx={{ bgcolor: "#3B82F6", "&:hover": { bgcolor: "#2563EB" }, textTransform: "none" }}
          >
            {saveMutation.isPending ? "Saving…" : form.status === "published" ? "Update Published" : "Publish"}
          </Button>
        </Stack>
      </Box>

      {saveMutation.isError && <Alert severity="error">Failed to save article</Alert>}

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 320px" }, gap: 3 }}>
        {/* Main */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Core fields */}
          <Card sx={cardSx}>
            <CardContent sx={{ px: 2.5, py: 2.5 }}>
              <Stack spacing={2}>
                <TextField fullWidth label="Title *" value={form.title} onChange={set("title")} sx={textFieldSx} />
                <TextField
                  fullWidth label="Slug *" value={form.slug} onChange={handleSlugChange}
                  helperText="Used in the URL. Auto-generated from title."
                  FormHelperTextProps={{ sx: { color: "#71717A" } }}
                  sx={textFieldSx}
                />
                <TextField
                  fullWidth multiline minRows={2} label="Short Summary"
                  value={form.shortSummary} onChange={set("shortSummary")} sx={textFieldSx}
                  helperText="Shown in article cards and meta description if no custom meta."
                  FormHelperTextProps={{ sx: { color: "#71717A" } }}
                />
              </Stack>
            </CardContent>
          </Card>

          {/* Article body */}
          <Card sx={cardSx}>
            <CardHeader
              title={<Typography sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}>Article Body *</Typography>}
              subheader={<Typography variant="caption" sx={{ color: "#71717A", fontFamily: "Inter" }}>HTML is supported.</Typography>}
              sx={{ px: 2.5, pt: 2.25, pb: 1 }}
            />
            <CardContent sx={{ px: 2.5, pb: 2.5 }}>
              <TextField
                fullWidth multiline minRows={16}
                label="Body (HTML)"
                value={form.body} onChange={set("body")}
                sx={{ ...textFieldSx, "& textarea": { fontFamily: "monospace", fontSize: 13 } }}
              />
            </CardContent>
          </Card>

          {/* FAQs */}
          <Card sx={cardSx}>
            <CardHeader
              title={<Typography sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}>FAQs</Typography>}
              action={
                <Button size="small" startIcon={<AddIcon />} onClick={addFaq} sx={{ color: "#3B82F6" }}>
                  Add FAQ
                </Button>
              }
              sx={{ px: 2.5, pt: 2.25, pb: 1 }}
            />
            <CardContent sx={{ px: 2.5, pb: 2.5 }}>
              <Stack spacing={2}>
                {form.faqs.length === 0 && (
                  <Typography sx={{ color: "#71717A", fontSize: 13, fontFamily: "Inter" }}>
                    No FAQs yet. Click Add FAQ to add one.
                  </Typography>
                )}
                {form.faqs.map((faq, i) => (
                  <Box key={i} sx={{ p: 2, bgcolor: "rgba(255,255,255,0.02)", borderRadius: 1.5, border: "1px solid rgba(255,255,255,0.05)" }}>
                    <Stack spacing={1.5}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography sx={{ color: "#9ca3af", fontSize: 12, fontFamily: "Inter" }}>FAQ {i + 1}</Typography>
                        <IconButton size="small" onClick={() => removeFaq(i)} sx={{ color: "#ef4444" }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <TextField fullWidth size="small" label="Question" value={faq.question}
                        onChange={(e) => updateFaq(i, "question", e.target.value)} sx={textFieldSx} />
                      <TextField fullWidth multiline minRows={2} size="small" label="Answer" value={faq.answer}
                        onChange={(e) => updateFaq(i, "answer", e.target.value)} sx={textFieldSx} />
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* Sidebar */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Status & publish */}
          <Card sx={cardSx}>
            <CardHeader title={<Typography sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}>Publish Settings</Typography>} sx={{ px: 2.5, pt: 2.25, pb: 1 }} />
            <CardContent sx={{ px: 2.5, pb: 2.5 }}>
              <Stack spacing={2}>
                <FormControl fullWidth size="small" sx={textFieldSx}>
                  <InputLabel>Status</InputLabel>
                  <Select value={form.status} label="Status" onChange={set("status")}>
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                  </Select>
                </FormControl>
                <TextField type="date" fullWidth size="small" label="Publish Date"
                  value={form.publishedAt} onChange={set("publishedAt")}
                  InputLabelProps={{ shrink: true }}
                  sx={textFieldSx}
                />
              </Stack>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card sx={cardSx}>
            <CardHeader title={<Typography sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}>Categories</Typography>} sx={{ px: 2.5, pt: 2.25, pb: 1 }} />
            <CardContent sx={{ px: 2.5, pb: 2.5 }}>
              <FormControl fullWidth size="small" sx={textFieldSx}>
                <InputLabel>Select categories</InputLabel>
                <Select
                  multiple
                  value={form.categoryIds}
                  onChange={(e) => setForm((p) => ({ ...p, categoryIds: e.target.value }))}
                  input={<OutlinedInput label="Select categories" />}
                  renderValue={(selected) =>
                    categories.filter((c) => selected.includes(c.id)).map((c) => c.name).join(", ")
                  }
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      <Checkbox checked={form.categoryIds.includes(cat.id)} sx={{ color: "#9ca3af" }} />
                      <ListItemText primary={cat.name} primaryTypographyProps={{ sx: { color: "#e5e7eb", fontSize: 13 } }} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>

          {/* Author & reading time */}
          <Card sx={cardSx}>
            <CardHeader title={<Typography sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}>Author</Typography>} sx={{ px: 2.5, pt: 2.25, pb: 1 }} />
            <CardContent sx={{ px: 2.5, pb: 2.5 }}>
              <Stack spacing={2}>
                <TextField fullWidth size="small" label="Author Name" value={form.authorName} onChange={set("authorName")} sx={textFieldSx} />
                <TextField fullWidth size="small" type="number" label="Reading Time (min)" value={form.readingTime} onChange={set("readingTime")} sx={textFieldSx} />
              </Stack>
            </CardContent>
          </Card>

          {/* Featured image */}
          <Card sx={cardSx}>
            <CardHeader title={<Typography sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}>Featured Image</Typography>} sx={{ px: 2.5, pt: 2.25, pb: 1 }} />
            <CardContent sx={{ px: 2.5, pb: 2.5 }}>
              <Stack spacing={2}>
                <TextField fullWidth size="small" label="Image URL" value={form.featuredImage} onChange={set("featuredImage")} sx={textFieldSx} />
                <TextField fullWidth size="small" label="Alt Text" value={form.imageAlt} onChange={set("imageAlt")} sx={textFieldSx} />
                {form.featuredImage && (
                  <img src={form.featuredImage} alt={form.imageAlt} style={{ width: "100%", borderRadius: 8, objectFit: "cover", maxHeight: 140 }} />
                )}
              </Stack>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card sx={cardSx}>
            <CardHeader title={<Typography sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}>SEO</Typography>} sx={{ px: 2.5, pt: 2.25, pb: 1 }} />
            <CardContent sx={{ px: 2.5, pb: 2.5 }}>
              <Stack spacing={2}>
                <TextField fullWidth size="small" label="Meta Title" value={form.metaTitle} onChange={set("metaTitle")} sx={textFieldSx}
                  helperText={`${form.metaTitle.length}/60`} FormHelperTextProps={{ sx: { color: form.metaTitle.length > 60 ? "#ef4444" : "#71717A" } }}
                />
                <TextField fullWidth multiline minRows={2} size="small" label="Meta Description" value={form.metaDescription} onChange={set("metaDescription")} sx={textFieldSx}
                  helperText={`${form.metaDescription.length}/160`} FormHelperTextProps={{ sx: { color: form.metaDescription.length > 160 ? "#ef4444" : "#71717A" } }}
                />
                <TextField fullWidth size="small" label="Keywords" value={form.keywords} onChange={set("keywords")} sx={textFieldSx}
                  placeholder="comma, separated, keywords"
                />
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
