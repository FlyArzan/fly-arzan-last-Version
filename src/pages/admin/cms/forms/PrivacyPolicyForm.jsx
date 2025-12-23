import { useState, useEffect } from "react";
import PropTypes from "prop-types";
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
  DragIndicator as DragIcon,
} from "@mui/icons-material";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useCmsPage, useSaveCmsPage } from "@/hooks/useCms";

// Sortable Section Item Component
function SortableSectionItem({
  section,
  sectionIndex,
  sectionId,
  updateSection,
  removeSection,
  addBulletPoint,
  updateBulletPoint,
  removeBulletPoint,
  inputLabelSx,
  inputSx,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sectionId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "none" : transition,
    opacity: isDragging ? 0 : 1,
    zIndex: isDragging ? 1000 : "auto",
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Accordion
        defaultExpanded={sectionIndex === 0}
        sx={{
          bgcolor: "rgba(255,255,255,0.02)",
          border: isDragging
            ? "1px solid rgba(59, 130, 246, 0.5)"
            : "1px solid rgba(255,255,255,0.05)",
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
            <Box
              {...attributes}
              {...listeners}
              sx={{
                cursor: "grab",
                display: "flex",
                alignItems: "center",
                "&:active": { cursor: "grabbing" },
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <DragIcon sx={{ color: "#6b7280" }} />
            </Box>
            <Typography
              sx={{
                color: "#e5e7eb",
                fontFamily: "Inter",
                flexGrow: 1,
              }}
            >
              {section.heading || `Section ${sectionIndex + 1}`}
            </Typography>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                removeSection(sectionIndex);
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
              label="Section Heading"
              value={section.heading || ""}
              onChange={(e) =>
                updateSection(sectionIndex, "heading", e.target.value)
              }
              InputLabelProps={{ sx: inputLabelSx }}
              inputProps={{ sx: inputSx }}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Section Content"
              value={section.content || ""}
              onChange={(e) =>
                updateSection(sectionIndex, "content", e.target.value)
              }
              InputLabelProps={{ sx: inputLabelSx }}
              inputProps={{ sx: inputSx }}
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
                Bullet Points (optional)
              </Typography>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => addBulletPoint(sectionIndex)}
                sx={{ color: "#3B82F6" }}
              >
                Add Point
              </Button>
            </Box>

            {(section.bulletPoints || []).map((point, bulletIndex) => (
              <Stack
                key={bulletIndex}
                direction="row"
                spacing={1}
                alignItems="center"
              >
                <Typography sx={{ color: "#3B82F6" }}>•</Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={point}
                  onChange={(e) =>
                    updateBulletPoint(sectionIndex, bulletIndex, e.target.value)
                  }
                  InputLabelProps={{ sx: inputLabelSx }}
                  inputProps={{ sx: inputSx }}
                  sx={textFieldSx}
                />
                <IconButton
                  size="small"
                  onClick={() => removeBulletPoint(sectionIndex, bulletIndex)}
                  sx={{ color: "#ef4444" }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

SortableSectionItem.propTypes = {
  section: PropTypes.shape({
    heading: PropTypes.string,
    content: PropTypes.string,
    bulletPoints: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  sectionIndex: PropTypes.number.isRequired,
  sectionId: PropTypes.string.isRequired,
  updateSection: PropTypes.func.isRequired,
  removeSection: PropTypes.func.isRequired,
  addBulletPoint: PropTypes.func.isRequired,
  updateBulletPoint: PropTypes.func.isRequired,
  removeBulletPoint: PropTypes.func.isRequired,
  inputLabelSx: PropTypes.object.isRequired,
  inputSx: PropTypes.object.isRequired,
};

const cardSx = {
  borderRadius: 2,
  bgcolor: "#1A1D23",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
};

// Keep these for backward compatibility with SortableSectionItem component
const inputLabelSx = { color: "#9ca3af" };
const inputSx = { color: "#e5e7eb" };

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
  lastUpdated: "",
  introduction: "",
  sections: [],
};

export default function PrivacyPolicyForm() {
  const slug = "privacy_policy";
  const { data, isLoading, isError } = useCmsPage(slug);
  const saveMutation = useSaveCmsPage();

  const [title, setTitle] = useState("Privacy Policy");
  const [content, setContent] = useState(defaultContent);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (data) {
      setTitle(data.title || "Privacy Policy");
      setContent({ ...defaultContent, ...(data.content || {}) });
    }
  }, [data]);

  const updateField = (field, value) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  const addSection = () => {
    setContent((prev) => ({
      ...prev,
      sections: [
        ...(prev.sections || []),
        { heading: "", content: "", bulletPoints: [] },
      ],
    }));
  };

  const updateSection = (index, field, value) => {
    setContent((prev) => {
      const sections = [...(prev.sections || [])];
      sections[index] = { ...sections[index], [field]: value };
      return { ...prev, sections };
    });
  };

  const removeSection = (index) => {
    setContent((prev) => ({
      ...prev,
      sections: prev.sections?.filter((_, i) => i !== index) || [],
    }));
  };

  const addBulletPoint = (sectionIndex) => {
    setContent((prev) => {
      const sections = [...(prev.sections || [])];
      sections[sectionIndex] = {
        ...sections[sectionIndex],
        bulletPoints: [...(sections[sectionIndex].bulletPoints || []), ""],
      };
      return { ...prev, sections };
    });
  };

  const updateBulletPoint = (sectionIndex, bulletIndex, value) => {
    setContent((prev) => {
      const sections = [...(prev.sections || [])];
      const bulletPoints = [...(sections[sectionIndex].bulletPoints || [])];
      bulletPoints[bulletIndex] = value;
      sections[sectionIndex] = { ...sections[sectionIndex], bulletPoints };
      return { ...prev, sections };
    });
  };

  const removeBulletPoint = (sectionIndex, bulletIndex) => {
    setContent((prev) => {
      const sections = [...(prev.sections || [])];
      sections[sectionIndex] = {
        ...sections[sectionIndex],
        bulletPoints:
          sections[sectionIndex].bulletPoints?.filter(
            (_, i) => i !== bulletIndex
          ) || [],
      };
      return { ...prev, sections };
    });
  };

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Generate unique IDs for sections (use index as fallback)
  const sectionIds = (content.sections || []).map(
    (_, index) => `section-${index}`
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      // Extract index from ID string (e.g., "section-2" -> 2)
      const oldIndex = parseInt(String(active.id).replace("section-", ""), 10);
      const newIndex = parseInt(String(over.id).replace("section-", ""), 10);

      if (!isNaN(oldIndex) && !isNaN(newIndex)) {
        setContent((prev) => ({
          ...prev,
          sections: arrayMove(prev.sections || [], oldIndex, newIndex),
        }));
      }
    }
  };

  // Get the active section for the drag overlay
  const activeSection = activeId
    ? content.sections?.[parseInt(String(activeId).replace("section-", ""), 10)]
    : null;

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
            Privacy Policy Page
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#71717A", mt: 0.5, fontFamily: "Inter" }}
          >
            Manage your privacy policy content ({content.sections?.length || 0}{" "}
            sections)
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
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Page Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              InputLabelProps={{ sx: inputLabelSx }}
              inputProps={{ sx: inputSx }}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Last Updated Date"
              placeholder="e.g., January 15, 2025"
              value={content.lastUpdated || ""}
              onChange={(e) => updateField("lastUpdated", e.target.value)}
              InputLabelProps={{ sx: inputLabelSx }}
              inputProps={{ sx: inputSx }}
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
              Opening paragraph for the privacy policy
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
            InputLabelProps={{ sx: inputLabelSx }}
            inputProps={{ sx: inputSx }}
            sx={textFieldSx}
          />
        </CardContent>
      </Card>

      {/* Policy Sections */}
      <Card sx={cardSx}>
        <CardHeader
          title={
            <Typography
              sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}
            >
              Policy Sections
            </Typography>
          }
          subheader={
            <Typography
              variant="caption"
              sx={{ color: "#71717A", fontFamily: "Inter" }}
            >
              Add sections like Data Collection, Data Usage, Cookies, etc.
            </Typography>
          }
          action={
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={addSection}
              sx={{ color: "#3B82F6" }}
            >
              Add Section
            </Button>
          }
          sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={sectionIds}
              strategy={verticalListSortingStrategy}
            >
              <Stack spacing={2}>
                {(content.sections || []).map((section, sectionIndex) => (
                  <SortableSectionItem
                    key={sectionIds[sectionIndex]}
                    section={section}
                    sectionIndex={sectionIndex}
                    sectionId={sectionIds[sectionIndex]}
                    updateSection={updateSection}
                    removeSection={removeSection}
                    addBulletPoint={addBulletPoint}
                    updateBulletPoint={updateBulletPoint}
                    removeBulletPoint={removeBulletPoint}
                    inputLabelSx={inputLabelSx}
                    inputSx={inputSx}
                  />
                ))}
                {(!content.sections || content.sections.length === 0) && (
                  <Typography
                    variant="body2"
                    sx={{ color: "#71717A", textAlign: "center", py: 3 }}
                  >
                    No sections added yet. Click &ldquo;Add Section&rdquo; to
                    get started.
                  </Typography>
                )}
              </Stack>
            </SortableContext>
            <DragOverlay>
              {activeSection ? (
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "#1A1D23",
                    border: "2px solid #3B82F6",
                    borderRadius: 1,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <DragIcon sx={{ color: "#3B82F6" }} />
                    <Typography sx={{ color: "#e5e7eb", fontFamily: "Inter" }}>
                      {activeSection.heading || "Untitled Section"}
                    </Typography>
                  </Stack>
                </Box>
              ) : null}
            </DragOverlay>
          </DndContext>
        </CardContent>
      </Card>
    </Box>
  );
}
