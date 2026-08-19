import PropTypes from "prop-types";
import { Box, Button, Divider, IconButton, Stack, TextField, Typography } from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { dividerSx, subCardSx } from "./shared";

/** Editorial prose: the introduction, information sections and travel tips. */
export default function ContentTab({ draft, setField }) {
  const sections = draft.sections || [];
  const tips = draft.tips || [];

  const updateSection = (i, field, value) =>
    setField(
      "sections",
      sections.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)),
    );

  return (
    <Stack spacing={2.5}>
      <TextField
        fullWidth
        multiline
        minRows={3}
        label="Introduction"
        placeholder="General information about this airport…"
        helperText="Also used as the page's meta description in search results."
        value={draft.introduction || ""}
        onChange={(e) => setField("introduction", e.target.value)}
      />

      <Divider sx={dividerSx} />

      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
            Information sections
          </Typography>
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setField("sections", [...sections, { title: "", content: "" }])}
          >
            Add section
          </Button>
        </Box>
        <Stack spacing={2}>
          {sections.map((section, index) => (
            <Stack key={index} spacing={1} sx={subCardSx}>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <TextField
                  fullWidth
                  size="small"
                  label="Section title"
                  placeholder="e.g. Terminals, Transport, Lounges"
                  value={section.title || ""}
                  onChange={(e) => updateSection(index, "title", e.target.value)}
                />
                <IconButton
                  size="small"
                  onClick={() =>
                    setField("sections", sections.filter((_, idx) => idx !== index))
                  }
                  sx={{ color: "#ef4444" }}
                  aria-label="Remove section"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
              <TextField
                fullWidth
                multiline
                minRows={2}
                size="small"
                label="Content"
                value={section.content || ""}
                onChange={(e) => updateSection(index, "content", e.target.value)}
              />
            </Stack>
          ))}
        </Stack>
      </Box>

      <Divider sx={dividerSx} />

      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
            Travel tips
          </Typography>
          <Button size="small" startIcon={<AddIcon />} onClick={() => setField("tips", [...tips, ""])}>
            Add tip
          </Button>
        </Box>
        <Stack spacing={1.5}>
          {tips.map((tip, index) => (
            <Stack key={index} direction="row" spacing={1} alignItems="center">
              <Typography sx={{ color: "primary.main" }}>•</Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. Arrive 3 hours early for international flights"
                value={tip}
                onChange={(e) =>
                  setField("tips", tips.map((t, idx) => (idx === index ? e.target.value : t)))
                }
              />
              <IconButton
                size="small"
                onClick={() => setField("tips", tips.filter((_, idx) => idx !== index))}
                sx={{ color: "#ef4444" }}
                aria-label="Remove tip"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}

ContentTab.propTypes = {
  draft: PropTypes.object.isRequired,
  setField: PropTypes.func.isRequired,
};
