import PropTypes from "prop-types";
import { Box, Divider, Stack, TextField, Typography } from "@mui/material";
import AirlineLogo from "@/components/ui/airline-logo";
import { dividerSx } from "./shared";

/**
 * Identity and contact details for an airline.
 *
 * The IATA code is the record's key AND its public URL (/Airlines/EK) and the
 * logo key (/logos/EK.png), which is why it is required here.
 */
export default function AirlineBasicTab({ draft, setField }) {
  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <TextField
          fullWidth
          required
          label="Airline name"
          placeholder="e.g. Emirates"
          value={draft.name || ""}
          onChange={(e) => setField("name", e.target.value)}
        />
        <TextField
          required
          label="IATA code"
          placeholder="EK"
          value={draft.iata || ""}
          onChange={(e) => setField("iata", e.target.value.toUpperCase())}
          inputProps={{ maxLength: 3, style: { textTransform: "uppercase" } }}
          helperText="2–3 letters · becomes /Airlines/EK and /logos/EK.png"
          sx={{ minWidth: 190 }}
        />
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <TextField
          fullWidth
          label="ICAO code"
          placeholder="EK"
          value={draft.icao || ""}
          onChange={(e) => setField("icao", e.target.value.toUpperCase())}
          inputProps={{ maxLength: 4, style: { textTransform: "uppercase" } }}
        />
        <TextField
          fullWidth
          label="Country"
          placeholder="e.g. United Arab Emirates"
          value={draft.country || ""}
          onChange={(e) => setField("country", e.target.value)}
        />
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <TextField
          label="Country code (ISO)"
          placeholder="AE"
          value={draft.countryCode || ""}
          onChange={(e) => setField("countryCode", e.target.value.toUpperCase())}
          inputProps={{ maxLength: 2, style: { textTransform: "uppercase" } }}
          sx={{ minWidth: 160 }}
        />
        <TextField
          label="Flag emoji"
          placeholder="🇦🇪"
          value={draft.flag || ""}
          onChange={(e) => setField("flag", e.target.value)}
          sx={{ minWidth: 120 }}
        />
      </Stack>

      <TextField
        fullWidth
        label="Website"
        placeholder="emirates.com"
        value={draft.website || ""}
        onChange={(e) => setField("website", e.target.value)}
      />

      <Divider sx={dividerSx} />

      <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
        <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
          Logo preview
        </Typography>
        <Box
          sx={{
            width: 80,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            bgcolor: "#ffffff",
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <AirlineLogo
            code={draft.iata}
            name={draft.name}
            fallback="plane"
            className="tw:w-16 tw:h-auto tw:shrink-0"
            fallbackClassName="tw:w-16 tw:h-6"
          />
        </Box>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          Resolved from /logos/&lt;IATA&gt;.png — upload the PNG to that public path
          to replace it.
        </Typography>
      </Box>
    </Stack>
  );
}

AirlineBasicTab.propTypes = {
  draft: PropTypes.object.isRequired,
  setField: PropTypes.func.isRequired,
};
