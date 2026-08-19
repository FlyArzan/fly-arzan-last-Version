import PropTypes from "prop-types";
import { Alert, Box, Button, Divider, IconButton, Stack, TextField, Typography } from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import PdfUpload from "@/components/admin/PdfUpload";
import { dividerSx, subCardSx } from "./shared";

/**
 * Baggage rules plus an optional PDF guide.
 *
 * The PDF goes to the `article-documents` folder, which is already allowlisted
 * by the uploads presign endpoint, the /api/media proxy and keyFromUrl — so no
 * backend change is needed to store one here.
 */
export default function BaggageTab({ baggage, onPatch }) {
  const allowances = baggage.allowances || [];

  const setAllowances = (next) => onPatch({ allowances: next });
  const updateAllowance = (i, field, value) =>
    setAllowances(allowances.map((a, idx) => (idx === i ? { ...a, [field]: value } : a)));

  return (
    <Stack spacing={2.5}>
      <Alert severity="info" icon={false}>
        Baggage is the most-read part of an airport page, so it renders as a
        highlighted panel with its own download button. Everything here is
        optional — the panel is hidden entirely when left empty.
      </Alert>

      <TextField
        fullWidth
        multiline
        minRows={3}
        label="Baggage summary"
        placeholder="Carry-on and checked baggage rules travellers should know…"
        value={baggage.summary || ""}
        onChange={(e) => onPatch({ summary: e.target.value })}
      />

      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
            Allowances
          </Typography>
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setAllowances([...allowances, { title: "", content: "" }])}
          >
            Add allowance
          </Button>
        </Box>
        <Stack spacing={2}>
          {allowances.map((item, index) => (
            <Stack key={index} spacing={1} sx={subCardSx}>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <TextField
                  fullWidth
                  size="small"
                  label="Allowance title"
                  placeholder="e.g. Cabin baggage, Checked baggage, Excess fees"
                  value={item.title || ""}
                  onChange={(e) => updateAllowance(index, "title", e.target.value)}
                />
                <IconButton
                  size="small"
                  onClick={() =>
                    setAllowances(allowances.filter((_, idx) => idx !== index))
                  }
                  sx={{ color: "#ef4444" }}
                  aria-label="Remove allowance"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
              <TextField
                fullWidth
                multiline
                minRows={2}
                size="small"
                label="Details"
                placeholder="e.g. 7 kg, max 55 x 38 x 20 cm"
                value={item.content || ""}
                onChange={(e) => updateAllowance(index, "content", e.target.value)}
              />
            </Stack>
          ))}
        </Stack>
      </Box>

      <Divider sx={dividerSx} />

      <PdfUpload
        label="Baggage guide PDF (optional)"
        value={baggage.pdfUrl || ""}
        objectKey={baggage.pdfKey || ""}
        onChange={(url, key) => onPatch({ pdfUrl: url, pdfKey: key })}
        helperText="Shown inline on the airport page with a download button. Uploading a new file replaces the previous one; removing deletes it from storage."
      />
    </Stack>
  );
}

BaggageTab.propTypes = {
  baggage: PropTypes.object.isRequired,
  /** Merges the given partial into the airport's baggage object. */
  onPatch: PropTypes.func.isRequired,
};
