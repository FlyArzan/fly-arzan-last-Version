import { useState } from "react";
import PropTypes from "prop-types";
import { Box, Button, Chip, Divider, Stack, TextField, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { dividerSx } from "./shared";

/**
 * Identity and terminals.
 *
 * The IATA code is the record's key AND its public URL (/Airport/DXB), which is
 * why it is required here rather than optional metadata.
 */
export default function BasicTab({ draft, setField }) {
  const [terminalInput, setTerminalInput] = useState("");
  const terminals = draft.terminals || [];

  const addTerminal = () => {
    const value = terminalInput.trim();
    if (!value) return;
    if (terminals.some((t) => t.toLowerCase() === value.toLowerCase())) {
      setTerminalInput("");
      return;
    }
    setField("terminals", [...terminals, value]);
    setTerminalInput("");
  };

  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <TextField
          fullWidth
          required
          label="Airport name"
          placeholder="e.g. Dubai International Airport"
          value={draft.name || ""}
          onChange={(e) => setField("name", e.target.value)}
        />
        <TextField
          required
          label="IATA code"
          placeholder="DXB"
          value={draft.iataCode || ""}
          onChange={(e) => setField("iataCode", e.target.value.toUpperCase())}
          inputProps={{ maxLength: 3, style: { textTransform: "uppercase" } }}
          helperText="3 letters · becomes /Airport/DXB"
          sx={{ minWidth: 190 }}
        />
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <TextField
          fullWidth
          label="City"
          placeholder="e.g. Dubai"
          value={draft.city || ""}
          onChange={(e) => setField("city", e.target.value)}
        />
        <TextField
          fullWidth
          label="Country"
          placeholder="e.g. United Arab Emirates"
          value={draft.country || ""}
          onChange={(e) => setField("country", e.target.value)}
        />
        <TextField
          label="Flag emoji"
          placeholder="🇦🇪"
          value={draft.flag || ""}
          onChange={(e) => setField("flag", e.target.value)}
          sx={{ minWidth: 120 }}
        />
      </Stack>

      <Divider sx={dividerSx} />

      <Box>
        <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600, mb: 1 }}>
          Terminals
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 1.5 }}>
          Shown as filter chips on the public page, and offered as options when
          assigning airlines.
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
          <TextField
            size="small"
            placeholder="e.g. T1"
            value={terminalInput}
            onChange={(e) => setTerminalInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTerminal();
              }
            }}
            sx={{ maxWidth: 200 }}
          />
          <Button size="small" startIcon={<AddIcon />} onClick={addTerminal}>
            Add
          </Button>
        </Stack>
        {terminals.length === 0 ? (
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            No terminals yet.
          </Typography>
        ) : (
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {terminals.map((t) => (
              <Chip
                key={t}
                label={t}
                size="small"
                onDelete={() =>
                  setField("terminals", terminals.filter((x) => x !== t))
                }
              />
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  );
}

BasicTab.propTypes = {
  draft: PropTypes.object.isRequired,
  setField: PropTypes.func.isRequired,
};
