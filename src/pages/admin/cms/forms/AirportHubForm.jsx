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
  Flight as FlightIcon,
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
  airports: [],
};

export default function AirportHubForm() {
  const slug = "airport_info";
  const { data, isLoading, isError } = useCmsPage(slug);
  const saveMutation = useSaveCmsPage();

  const [title, setTitle] = useState("Airport Information Hub");
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    if (data) {
      setTitle(data.title || "Airport Information Hub");
      setContent({ ...defaultContent, ...(data.content || {}) });
    }
  }, [data]);

  const updateHero = (field, value) => {
    setContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }));
  };

  const addAirport = () => {
    setContent((prev) => ({
      ...prev,
      airports: [
        ...(prev.airports || []),
        {
          name: "",
          iataCode: "",
          city: "",
          country: "",
          flag: "",
          introduction: "",
          sections: [],
          tips: [],
        },
      ],
    }));
  };

  const updateAirport = (index, field, value) => {
    setContent((prev) => {
      const airports = [...(prev.airports || [])];
      airports[index] = { ...airports[index], [field]: value };
      return { ...prev, airports };
    });
  };

  const removeAirport = (index) => {
    setContent((prev) => ({
      ...prev,
      airports: prev.airports?.filter((_, i) => i !== index) || [],
    }));
  };

  const addSection = (airportIndex) => {
    setContent((prev) => {
      const airports = [...(prev.airports || [])];
      airports[airportIndex] = {
        ...airports[airportIndex],
        sections: [
          ...(airports[airportIndex].sections || []),
          { title: "", content: "" },
        ],
      };
      return { ...prev, airports };
    });
  };

  const updateSection = (airportIndex, sectionIndex, field, value) => {
    setContent((prev) => {
      const airports = [...(prev.airports || [])];
      const sections = [...(airports[airportIndex].sections || [])];
      sections[sectionIndex] = { ...sections[sectionIndex], [field]: value };
      airports[airportIndex] = { ...airports[airportIndex], sections };
      return { ...prev, airports };
    });
  };

  const removeSection = (airportIndex, sectionIndex) => {
    setContent((prev) => {
      const airports = [...(prev.airports || [])];
      airports[airportIndex] = {
        ...airports[airportIndex],
        sections:
          airports[airportIndex].sections?.filter((_, i) => i !== sectionIndex) ||
          [],
      };
      return { ...prev, airports };
    });
  };

  const addTip = (airportIndex) => {
    setContent((prev) => {
      const airports = [...(prev.airports || [])];
      airports[airportIndex] = {
        ...airports[airportIndex],
        tips: [...(airports[airportIndex].tips || []), ""],
      };
      return { ...prev, airports };
    });
  };

  const updateTip = (airportIndex, tipIndex, value) => {
    setContent((prev) => {
      const airports = [...(prev.airports || [])];
      const tips = [...(airports[airportIndex].tips || [])];
      tips[tipIndex] = value;
      airports[airportIndex] = { ...airports[airportIndex], tips };
      return { ...prev, airports };
    });
  };

  const removeTip = (airportIndex, tipIndex) => {
    setContent((prev) => {
      const airports = [...(prev.airports || [])];
      airports[airportIndex] = {
        ...airports[airportIndex],
        tips: airports[airportIndex].tips?.filter((_, i) => i !== tipIndex) || [],
      };
      return { ...prev, airports };
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
            Airport Information Hub
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#71717A", mt: 0.5, fontFamily: "Inter" }}
          >
            Manage information for {content.airports?.length || 0} airports
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

      {/* Airports */}
      <Card sx={cardSx}>
        <CardHeader
          title={
            <Typography
              sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}
            >
              Airport Information
            </Typography>
          }
          subheader={
            <Typography
              variant="caption"
              sx={{ color: "#71717A", fontFamily: "Inter" }}
            >
              Add detailed information for each airport (100+ airports supported)
            </Typography>
          }
          action={
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={addAirport}
              sx={{ color: "#3B82F6" }}
            >
              Add Airport
            </Button>
          }
          sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <Stack spacing={2}>
            {(content.airports || []).map((airport, airportIndex) => (
              <Accordion
                key={airportIndex}
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
                    <FlightIcon sx={{ color: "#3B82F6" }} />
                    <Typography
                      sx={{
                        color: "#e5e7eb",
                        fontFamily: "Inter",
                        flexGrow: 1,
                      }}
                    >
                      {airport.name || `Airport ${airportIndex + 1}`}
                      {airport.iataCode && ` (${airport.iataCode})`}
                    </Typography>
                    {airport.city && (
                      <Chip
                        label={`${airport.city}${airport.country ? `, ${airport.country}` : ""}`}
                        size="small"
                        sx={{
                          bgcolor: "rgba(59, 130, 246, 0.1)",
                          color: "#3B82F6",
                        }}
                      />
                    )}
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeAirport(airportIndex);
                      }}
                      sx={{ color: "#ef4444" }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    {/* Basic Info */}
                    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                      <TextField
                        fullWidth
                        label="Airport Name"
                        placeholder="e.g., Dubai International Airport"
                        value={airport.name || ""}
                        onChange={(e) =>
                          updateAirport(airportIndex, "name", e.target.value)
                        }
                        sx={textFieldSx}
                      />
                      <TextField
                        label="IATA Code"
                        placeholder="e.g., DXB"
                        value={airport.iataCode || ""}
                        onChange={(e) =>
                          updateAirport(
                            airportIndex,
                            "iataCode",
                            e.target.value.toUpperCase()
                          )
                        }
                        inputProps={{
                          style: { textTransform: "uppercase" },
                          maxLength: 3,
                        }}
                        sx={{ ...textFieldSx, minWidth: 150 }}
                      />
                    </Stack>

                    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                      <TextField
                        fullWidth
                        label="City"
                        placeholder="e.g., Dubai"
                        value={airport.city || ""}
                        onChange={(e) =>
                          updateAirport(airportIndex, "city", e.target.value)
                        }
                        sx={textFieldSx}
                      />
                      <TextField
                        fullWidth
                        label="Country"
                        placeholder="e.g., United Arab Emirates"
                        value={airport.country || ""}
                        onChange={(e) =>
                          updateAirport(airportIndex, "country", e.target.value)
                        }
                        sx={textFieldSx}
                      />
                      <TextField
                        label="Flag Emoji"
                        placeholder="🇦🇪"
                        value={airport.flag || ""}
                        onChange={(e) =>
                          updateAirport(airportIndex, "flag", e.target.value)
                        }
                        sx={{ ...textFieldSx, minWidth: 100 }}
                      />
                    </Stack>

                    <TextField
                      fullWidth
                      multiline
                      minRows={3}
                      label="Introduction"
                      placeholder="General information about this airport..."
                      value={airport.introduction || ""}
                      onChange={(e) =>
                        updateAirport(
                          airportIndex,
                          "introduction",
                          e.target.value
                        )
                      }
                      sx={textFieldSx}
                    />

                    <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

                    {/* Sections */}
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
                        Information Sections
                      </Typography>
                      <Button
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => addSection(airportIndex)}
                        sx={{ color: "#3B82F6" }}
                      >
                        Add Section
                      </Button>
                    </Box>

                    {(airport.sections || []).map((section, sectionIndex) => (
                      <Stack
                        key={sectionIndex}
                        spacing={1}
                        sx={{
                          p: 2,
                          bgcolor: "rgba(255,255,255,0.02)",
                          borderRadius: 1,
                          border: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="flex-start"
                        >
                          <TextField
                            fullWidth
                            size="small"
                            label="Section Title"
                            placeholder="e.g., Terminals, Transportation"
                            value={section.title || ""}
                            onChange={(e) =>
                              updateSection(
                                airportIndex,
                                sectionIndex,
                                "title",
                                e.target.value
                              )
                            }
                            sx={textFieldSx}
                          />
                          <IconButton
                            size="small"
                            onClick={() =>
                              removeSection(airportIndex, sectionIndex)
                            }
                            sx={{ color: "#ef4444" }}
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
                          placeholder="Detailed information..."
                          value={section.content || ""}
                          onChange={(e) =>
                            updateSection(
                              airportIndex,
                              sectionIndex,
                              "content",
                              e.target.value
                            )
                          }
                          sx={textFieldSx}
                        />
                      </Stack>
                    ))}

                    <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

                    {/* Tips */}
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
                        Travel Tips
                      </Typography>
                      <Button
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => addTip(airportIndex)}
                        sx={{ color: "#3B82F6" }}
                      >
                        Add Tip
                      </Button>
                    </Box>

                    {(airport.tips || []).map((tip, tipIndex) => (
                      <Stack
                        key={tipIndex}
                        direction="row"
                        spacing={1}
                        alignItems="center"
                      >
                        <Typography sx={{ color: "#3B82F6" }}>•</Typography>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="e.g., Arrive 3 hours early for international flights"
                          value={tip}
                          onChange={(e) =>
                            updateTip(airportIndex, tipIndex, e.target.value)
                          }
                          sx={textFieldSx}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeTip(airportIndex, tipIndex)}
                          sx={{ color: "#ef4444" }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    ))}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            ))}
            {(!content.airports || content.airports.length === 0) && (
              <Typography
                variant="body2"
                sx={{ color: "#71717A", textAlign: "center", py: 3 }}
              >
                No airports added yet. Click &ldquo;Add Airport&rdquo; to get
                started.
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
