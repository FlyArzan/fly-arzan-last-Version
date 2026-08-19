import { useState } from "react";
import PropTypes from "prop-types";
import {
  Alert,
  Autocomplete,
  Box,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import AirlineLogo from "@/components/ui/airline-logo";
import { useAirlineSearch } from "@/hooks/useAirlines";
import { subCardSx } from "./shared";

/**
 * Which airlines serve this airport, and from which terminal.
 *
 * There is no airport-to-airline relation in the database, so this is authored
 * by hand — but the airline REFERENCE table is already seeded, so the search
 * box fills in the IATA code and website for you. The code is what resolves the
 * logo at /logos/<IATA>.png, hence the live preview on every row.
 */
export default function AirlinesTab({ draft, setField }) {
  const [query, setQuery] = useState("");
  const { data, isFetching } = useAirlineSearch(query);

  const airlines = draft.airlines || [];
  const terminals = draft.terminals || [];
  const options = data?.airlines || [];

  const setAirlines = (next) => setField("airlines", next);

  const addAirline = (option) => {
    const row =
      typeof option === "string" || !option
        ? { name: String(option || "").trim(), iata: "", terminal: "", website: "" }
        : {
            name: option.name || "",
            iata: (option.iata || "").toUpperCase(),
            terminal: "",
            website: option.website || "",
          };
    if (!row.name && !row.iata) return;
    setAirlines([...airlines, row]);
    setQuery("");
  };

  const updateAirline = (i, field, value) =>
    setAirlines(
      airlines.map((a, idx) =>
        idx === i ? { ...a, [field]: field === "iata" ? value.toUpperCase() : value } : a,
      ),
    );

  return (
    <Stack spacing={2.5}>
      <Alert severity="info" icon={false}>
        Logos are matched from the airline&apos;s 2-letter IATA code. A code with
        no logo on file falls back to a plane icon — the preview on each row shows
        which you&apos;ll get.
      </Alert>

      <Autocomplete
        freeSolo
        options={options}
        loading={isFetching}
        filterOptions={(x) => x} // the server already filtered
        inputValue={query}
        onInputChange={(_, value) => setQuery(value)}
        getOptionLabel={(option) =>
          typeof option === "string"
            ? option
            : `${option.name}${option.iata ? ` (${option.iata})` : ""}`
        }
        renderOption={(props, option) => (
          <Box component="li" {...props} key={option.id}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: "100%" }}>
              <AirlineLogo
                code={option.iata}
                name={option.name}
                fallback="plane"
                className="tw:w-16 tw:h-auto tw:shrink-0"
                fallbackClassName="tw:w-16 tw:h-6"
              />
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: 13 }}>{option.name}</Typography>
                <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
                  {[option.iata, option.countryName].filter(Boolean).join(" · ")}
                </Typography>
              </Box>
            </Stack>
          </Box>
        )}
        onChange={(_, value) => value && addAirline(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Add airline"
            placeholder="Search the airline database by name or code…"
            helperText="Pick a match to fill in the code and website, or type a name and press Enter."
          />
        )}
      />

      {airlines.length === 0 ? (
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          No airlines added yet.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {airlines.map((airline, index) => (
            <Stack key={index} spacing={1.5} sx={subCardSx}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                {/* White plate so dark-on-transparent logos stay legible in the
                    dark admin theme. */}
                <Box
                  sx={{
                    width: 72,
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
                    code={airline.iata}
                    name={airline.name}
                    fallback="plane"
                    className="tw:w-16 tw:h-auto tw:shrink-0"
                    fallbackClassName="tw:w-16 tw:h-6"
                  />
                </Box>
                <TextField
                  fullWidth
                  size="small"
                  label="Airline name"
                  value={airline.name || ""}
                  onChange={(e) => updateAirline(index, "name", e.target.value)}
                />
                <TextField
                  size="small"
                  label="IATA"
                  value={airline.iata || ""}
                  onChange={(e) => updateAirline(index, "iata", e.target.value)}
                  inputProps={{ maxLength: 3, style: { textTransform: "uppercase" } }}
                  sx={{ width: 110 }}
                />
                <IconButton
                  size="small"
                  onClick={() => setAirlines(airlines.filter((_, idx) => idx !== index))}
                  sx={{ color: "#ef4444" }}
                  aria-label="Remove airline"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <TextField
                  select
                  size="small"
                  label="Terminal"
                  value={airline.terminal || ""}
                  onChange={(e) => updateAirline(index, "terminal", e.target.value)}
                  sx={{ minWidth: 160 }}
                  helperText={terminals.length ? undefined : "Add terminals on the Basic tab first"}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {terminals.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  size="small"
                  label="Website"
                  placeholder="emirates.com"
                  value={airline.website || ""}
                  onChange={(e) => updateAirline(index, "website", e.target.value)}
                />
              </Stack>
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
  );
}

AirlinesTab.propTypes = {
  draft: PropTypes.object.isRequired,
  setField: PropTypes.func.isRequired,
};
