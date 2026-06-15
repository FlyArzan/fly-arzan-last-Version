import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box, Typography, Button, TextField, Stack, Card, CardHeader,
  CardContent, Alert, FormControl, InputLabel, Select, MenuItem,
  IconButton, Accordion, AccordionSummary, AccordionDetails, Divider,
} from "@mui/material";
import {
  Save as SaveIcon, ArrowBack as ArrowBackIcon,
  Add as AddIcon, Delete as DeleteIcon, ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { useAdminVisaCountry, useSaveVisaCountry } from "@/hooks/useVisa";
import ImageUpload from "@/components/admin/ImageUpload";
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

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();

const defaultForm = {
  countryName: "", countrySlug: "", countryCode: "",
  flagImage: "", flagImageKey: "", destinationImage: "", destinationImageKey: "", travelIntroduction: "",
  visaRequired: "check", eVisaAvailable: "", visaOnArrival: "",
  passportValidity: "", typicalProcessingTime: "", approximateVisaFee: "",
  officialApplicationLink: "", travelWarning: "",
  metaTitle: "", metaDescription: "", status: "draft",
  requiredDocuments: [], faqs: [],
  detailedSections: {
    visaTypes: [], applicationSteps: [], officialLinks: [], travelWarnings: [],
    visaRequirementDetail: "",
    touristVisa: { eligibility: "", validity: "", stayDuration: "", entryType: "", requirements: "", applicationMethod: "" },
    businessVisa: { purpose: "", invitationLetter: "", businessDocuments: "", processingTime: "", applicationMethod: "" },
    transitVisa: { whenRequired: "", airportTransitRules: "", connectingFlightConditions: "", exceptions: "" },
    eVisaDetails: { available: "", officialLink: "", applicationSteps: "", processingTime: "", requiredDocuments: "", warnings: "" },
    visaOnArrivalDetails: { available: "", eligibleTravellers: "", requiredDocuments: "", paymentMethod: "", availability: "", notes: "" },
    passportValidityDetail: "",
    processingTimeDetail: "",
  },
};

// Empty templates used when loading an existing record that predates these fields.
const EMPTY_TOURIST = { eligibility: "", validity: "", stayDuration: "", entryType: "", requirements: "", applicationMethod: "" };
const EMPTY_BUSINESS = { purpose: "", invitationLetter: "", businessDocuments: "", processingTime: "", applicationMethod: "" };
const EMPTY_TRANSIT = { whenRequired: "", airportTransitRules: "", connectingFlightConditions: "", exceptions: "" };
const EMPTY_EVISA = { available: "", officialLink: "", applicationSteps: "", processingTime: "", requiredDocuments: "", warnings: "" };
const EMPTY_VOA = { available: "", eligibleTravellers: "", requiredDocuments: "", paymentMethod: "", availability: "", notes: "" };

export default function VisaCountryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id && id !== "new");

  const { data: existing, isLoading } = useAdminVisaCountry(isEdit ? id : null);
  const saveMutation = useSaveVisaCountry();

  const [form, setForm] = useState(defaultForm);
  const [slugManuallySet, setSlugManuallySet] = useState(false);

  useEffect(() => {
    if (isEdit && existing) {
      const ds = existing.detailedSections || {};
      setForm({
        countryName: existing.countryName || "",
        countrySlug: existing.countrySlug || "",
        countryCode: existing.countryCode || "",
        flagImage: existing.flagImage || "",
        flagImageKey: "",
        destinationImage: existing.destinationImage || "",
        destinationImageKey: "",
        travelIntroduction: existing.travelIntroduction || "",
        visaRequired: existing.visaRequired || "check",
        eVisaAvailable: existing.eVisaAvailable || "",
        visaOnArrival: existing.visaOnArrival || "",
        passportValidity: existing.passportValidity || "",
        typicalProcessingTime: existing.typicalProcessingTime || "",
        approximateVisaFee: existing.approximateVisaFee || "",
        officialApplicationLink: existing.officialApplicationLink || "",
        travelWarning: existing.travelWarning || "",
        metaTitle: existing.metaTitle || "",
        metaDescription: existing.metaDescription || "",
        status: existing.status || "draft",
        requiredDocuments: Array.isArray(existing.requiredDocuments) ? existing.requiredDocuments : [],
        faqs: Array.isArray(existing.faqs) ? existing.faqs : [],
        detailedSections: {
          visaTypes: Array.isArray(ds.visaTypes) ? ds.visaTypes : [],
          applicationSteps: Array.isArray(ds.applicationSteps) ? ds.applicationSteps : [],
          officialLinks: Array.isArray(ds.officialLinks) ? ds.officialLinks : [],
          travelWarnings: Array.isArray(ds.travelWarnings) ? ds.travelWarnings : [],
          visaRequirementDetail: ds.visaRequirementDetail || "",
          touristVisa: { ...EMPTY_TOURIST, ...(ds.touristVisa || {}) },
          businessVisa: { ...EMPTY_BUSINESS, ...(ds.businessVisa || {}) },
          transitVisa: { ...EMPTY_TRANSIT, ...(ds.transitVisa || {}) },
          eVisaDetails: { ...EMPTY_EVISA, ...(ds.eVisaDetails || {}) },
          visaOnArrivalDetails: { ...EMPTY_VOA, ...(ds.visaOnArrivalDetails || {}) },
          passportValidityDetail: ds.passportValidityDetail || "",
          processingTimeDetail: ds.processingTimeDetail || "",
        },
      });
      setSlugManuallySet(true);
    }
  }, [isEdit, existing]);

  const set = (field) => (e) => {
    const val = e.target ? e.target.value : e;
    setForm((prev) => {
      const next = { ...prev, [field]: val };
      if (field === "countryName" && !slugManuallySet) next.countrySlug = slugify(val);
      return next;
    });
  };

  const setDs = (field) => (val) =>
    setForm((p) => ({ ...p, detailedSections: { ...p.detailedSections, [field]: val } }));

  // Set a single string field directly on detailedSections (e.g. detail prose).
  const setDsString = (field) => (e) =>
    setForm((p) => ({ ...p, detailedSections: { ...p.detailedSections, [field]: e.target.value } }));

  // Set a sub-field on a nested detailedSections object (tourist/business/etc).
  const setDsObj = (objKey, field, val) =>
    setForm((p) => ({
      ...p,
      detailedSections: {
        ...p.detailedSections,
        [objKey]: { ...p.detailedSections[objKey], [field]: val },
      },
    }));

  // --- Docs ---
  const addDoc = () => setForm((p) => ({ ...p, requiredDocuments: [...p.requiredDocuments, ""] }));
  const setDoc = (i, v) => setForm((p) => { const d = [...p.requiredDocuments]; d[i] = v; return { ...p, requiredDocuments: d }; });
  const removeDoc = (i) => setForm((p) => ({ ...p, requiredDocuments: p.requiredDocuments.filter((_, idx) => idx !== i) }));

  // --- FAQs ---
  const addFaq = () => setForm((p) => ({ ...p, faqs: [...p.faqs, { question: "", answer: "" }] }));
  const setFaq = (i, f, v) => setForm((p) => { const faqs = [...p.faqs]; faqs[i] = { ...faqs[i], [f]: v }; return { ...p, faqs }; });
  const removeFaq = (i) => setForm((p) => ({ ...p, faqs: p.faqs.filter((_, idx) => idx !== i) }));

  // --- Visa types ---
  const addVt = () => setDs("visaTypes")([...form.detailedSections.visaTypes, { type: "", description: "", validity: "", stayDuration: "", requirements: "" }]);
  const setVt = (i, f, v) => {
    const vts = [...form.detailedSections.visaTypes];
    vts[i] = { ...vts[i], [f]: v };
    setDs("visaTypes")(vts);
  };
  const removeVt = (i) => setDs("visaTypes")(form.detailedSections.visaTypes.filter((_, idx) => idx !== i));

  // --- Steps ---
  const addStep = () => setDs("applicationSteps")([...form.detailedSections.applicationSteps, ""]);
  const setStep = (i, v) => { const s = [...form.detailedSections.applicationSteps]; s[i] = v; setDs("applicationSteps")(s); };
  const removeStep = (i) => setDs("applicationSteps")(form.detailedSections.applicationSteps.filter((_, idx) => idx !== i));

  // --- Official links ---
  const addLink = () => setDs("officialLinks")([...form.detailedSections.officialLinks, { label: "", url: "" }]);
  const setLink = (i, f, v) => { const ls = [...form.detailedSections.officialLinks]; ls[i] = { ...ls[i], [f]: v }; setDs("officialLinks")(ls); };
  const removeLink = (i) => setDs("officialLinks")(form.detailedSections.officialLinks.filter((_, idx) => idx !== i));

  // --- Travel warnings ---
  const addWarn = () => setDs("travelWarnings")([...form.detailedSections.travelWarnings, ""]);
  const setWarn = (i, v) => { const ws = [...form.detailedSections.travelWarnings]; ws[i] = v; setDs("travelWarnings")(ws); };
  const removeWarn = (i) => setDs("travelWarnings")(form.detailedSections.travelWarnings.filter((_, idx) => idx !== i));

  const handleSave = () => {
    if (!form.countrySlug || !form.countryName) {
      toast.error("Country name and slug are required");
      return;
    }
    saveMutation.mutate(
      { id: isEdit ? id : null, data: form },
      {
        onSuccess: (data) => {
          toast.success(isEdit ? "Country updated" : "Country created");
          if (!isEdit) navigate(`/admin/visa-db/${data.id}`);
        },
        onError: (err) => toast.error(err.message || "Failed to save"),
      }
    );
  };

  if (isEdit && isLoading) return <Box sx={{ p: 4, color: "#9ca3af" }}>Loading…</Box>;

  const selectField = (label, field, options) => (
    <FormControl fullWidth size="small" sx={textFieldSx}>
      <InputLabel>{label}</InputLabel>
      <Select value={form[field] || ""} label={label} onChange={set(field)}>
        <MenuItem value="">Not set</MenuItem>
        {options.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
      </Select>
    </FormControl>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton onClick={() => navigate("/admin/visa-db")} sx={{ color: "#9ca3af" }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#FFFFFF", fontFamily: "Inter" }}>
            {isEdit ? `Edit: ${form.countryName}` : "Add Visa Country"}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button variant="outlined" onClick={() => { form.status === "published" ? set("status")("draft")() : null; handleSave(); }}
            disabled={saveMutation.isPending} sx={{ color: "#9ca3af", borderColor: "rgba(255,255,255,0.1)", textTransform: "none" }}>
            Save Draft
          </Button>
          <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}
            disabled={saveMutation.isPending}
            sx={{ bgcolor: "#3B82F6", "&:hover": { bgcolor: "#2563EB" }, textTransform: "none" }}>
            {saveMutation.isPending ? "Saving…" : "Save"}
          </Button>
        </Stack>
      </Box>

      {saveMutation.isError && <Alert severity="error">Failed to save</Alert>}

      {/* Country basics */}
      <Card sx={cardSx}>
        <CardHeader title={<Typography sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}>Country Details</Typography>} sx={{ px: 2.5, pt: 2.25, pb: 1 }} />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <Stack spacing={2}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField fullWidth label="Country Name *" value={form.countryName}
                onChange={(e) => { setSlugManuallySet(false); set("countryName")(e); }} sx={textFieldSx} />
              <TextField fullWidth label="Country Slug *" value={form.countrySlug}
                onChange={(e) => { setSlugManuallySet(true); setForm((p) => ({ ...p, countrySlug: slugify(e.target.value) })); }} sx={textFieldSx}
                helperText="/visa-information/[slug]" FormHelperTextProps={{ sx: { color: "#71717A" } }}
              />
              <TextField label="ISO Code" placeholder="TR" value={form.countryCode}
                onChange={(e) => setForm((p) => ({ ...p, countryCode: e.target.value.toUpperCase().slice(0, 2) }))}
                inputProps={{ maxLength: 2 }} sx={{ ...textFieldSx, minWidth: 100 }} />
            </Stack>
            <TextField fullWidth multiline minRows={3} label="Travel Introduction" value={form.travelIntroduction} onChange={set("travelIntroduction")} sx={textFieldSx} />
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <Box sx={{ flex: 1 }}>
                <ImageUpload
                  label="Flag Image"
                  folder="visa-flags"
                  value={form.flagImage}
                  objectKey={form.flagImageKey}
                  onChange={(url, key) => setForm((p) => ({ ...p, flagImage: url, flagImageKey: key }))}
                  helperText="Square country flag. Falls back to an emoji flag if empty."
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <ImageUpload
                  label="Destination Image"
                  folder="visa-destinations"
                  value={form.destinationImage}
                  objectKey={form.destinationImageKey}
                  onChange={(url, key) => setForm((p) => ({ ...p, destinationImage: url, destinationImageKey: key }))}
                  helperText="Hero background for the country page."
                />
              </Box>
            </Stack>
            <FormControl fullWidth size="small" sx={textFieldSx}>
              <InputLabel>Status</InputLabel>
              <Select value={form.status} label="Status" onChange={set("status")}>
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="published">Published</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </CardContent>
      </Card>

      {/* Visa summary */}
      <Card sx={cardSx}>
        <CardHeader title={<Typography sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}>Visa Summary</Typography>} sx={{ px: 2.5, pt: 2.25, pb: 1 }} />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <Stack spacing={2}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              {selectField("Visa Required", "visaRequired", [
                { value: "yes", label: "Yes — Visa Required" },
                { value: "no", label: "No — Visa Free" },
                { value: "depends", label: "Depends on Nationality" },
                { value: "check", label: "Check Requirements" },
              ])}
              {selectField("eVisa Available", "eVisaAvailable", [
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ])}
              {selectField("Visa on Arrival", "visaOnArrival", [
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ])}
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField fullWidth size="small" label="Passport Validity" placeholder="e.g. 6 months" value={form.passportValidity} onChange={set("passportValidity")} sx={textFieldSx} />
              <TextField fullWidth size="small" label="Processing Time" placeholder="e.g. 5-10 working days" value={form.typicalProcessingTime} onChange={set("typicalProcessingTime")} sx={textFieldSx} />
              <TextField fullWidth size="small" label="Approximate Fee" placeholder="e.g. $50 USD" value={form.approximateVisaFee} onChange={set("approximateVisaFee")} sx={textFieldSx} />
            </Stack>
            <TextField fullWidth size="small" label="Official Application Link" value={form.officialApplicationLink} onChange={set("officialApplicationLink")} sx={textFieldSx} />
            <TextField fullWidth multiline minRows={2} label="Top-level Travel Warning" placeholder="e.g. Travel Advisory in effect…" value={form.travelWarning} onChange={set("travelWarning")} sx={textFieldSx} />
          </Stack>
        </CardContent>
      </Card>

      {/* Required documents */}
      <Card sx={cardSx}>
        <CardHeader
          title={<Typography sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}>Required Documents</Typography>}
          action={<Button size="small" startIcon={<AddIcon />} onClick={addDoc} sx={{ color: "#3B82F6" }}>Add</Button>}
          sx={{ px: 2.5, pt: 2.25, pb: 1 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <Stack spacing={1.5}>
            {form.requiredDocuments.length === 0 && (
              <Typography sx={{ color: "#71717A", fontSize: 13, fontFamily: "Inter" }}>No documents added yet.</Typography>
            )}
            {form.requiredDocuments.map((doc, i) => (
              <Stack key={i} direction="row" spacing={1} alignItems="center">
                <TextField fullWidth size="small" placeholder="e.g. Valid passport" value={doc}
                  onChange={(e) => setDoc(i, e.target.value)} sx={textFieldSx} />
                <IconButton size="small" onClick={() => removeDoc(i)} sx={{ color: "#ef4444" }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Visa types */}
      <Card sx={cardSx}>
        <CardHeader
          title={<Typography sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}>Visa Types</Typography>}
          action={<Button size="small" startIcon={<AddIcon />} onClick={addVt} sx={{ color: "#3B82F6" }}>Add Type</Button>}
          sx={{ px: 2.5, pt: 2.25, pb: 1 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <Stack spacing={1.5}>
            {form.detailedSections.visaTypes.length === 0 && (
              <Typography sx={{ color: "#71717A", fontSize: 13 }}>No visa types added yet.</Typography>
            )}
            {form.detailedSections.visaTypes.map((vt, i) => (
              <Accordion key={i} sx={{ bgcolor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", "&:before": { display: "none" } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#9ca3af" }} />}>
                  <Stack direction="row" alignItems="center" sx={{ width: "100%" }} spacing={2}>
                    <Typography sx={{ color: "#e5e7eb", fontFamily: "Inter", flexGrow: 1 }}>
                      {vt.type || `Visa Type ${i + 1}`}
                    </Typography>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); removeVt(i); }} sx={{ color: "#ef4444" }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={1.5}>
                    <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
                      <TextField fullWidth size="small" label="Visa Type" placeholder="e.g. Tourist Visa" value={vt.type} onChange={(e) => setVt(i, "type", e.target.value)} sx={textFieldSx} />
                      <TextField fullWidth size="small" label="Validity" placeholder="e.g. 30 days" value={vt.validity} onChange={(e) => setVt(i, "validity", e.target.value)} sx={textFieldSx} />
                      <TextField fullWidth size="small" label="Stay Duration" placeholder="e.g. 30 days" value={vt.stayDuration} onChange={(e) => setVt(i, "stayDuration", e.target.value)} sx={textFieldSx} />
                    </Stack>
                    <TextField fullWidth size="small" multiline minRows={2} label="Description" value={vt.description} onChange={(e) => setVt(i, "description", e.target.value)} sx={textFieldSx} />
                    <TextField fullWidth size="small" multiline minRows={2} label="Requirements" value={vt.requirements} onChange={(e) => setVt(i, "requirements", e.target.value)} sx={textFieldSx} />
                  </Stack>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Detailed visa sections (spec C–G, A, I, J) */}
      <Card sx={cardSx}>
        <CardHeader
          title={<Typography sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}>Detailed Visa Sections</Typography>}
          subheader={<Typography sx={{ color: "#71717A", fontSize: 12.5 }}>Optional. Each filled section renders as its own block on the public page.</Typography>}
          sx={{ px: 2.5, pt: 2.25, pb: 1 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <Stack spacing={2}>
            <TextField fullWidth size="small" multiline minRows={2} label="Visa Requirement (overview)"
              placeholder="Explain whether a visa is required and what to check before travel…"
              value={form.detailedSections.visaRequirementDetail} onChange={setDsString("visaRequirementDetail")} sx={textFieldSx} />

            <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
            <Typography sx={{ color: "#9ca3af", fontSize: 13, fontWeight: 600 }}>Tourist Visa</Typography>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
              <TextField fullWidth size="small" label="Eligibility" value={form.detailedSections.touristVisa.eligibility} onChange={(e) => setDsObj("touristVisa", "eligibility", e.target.value)} sx={textFieldSx} />
              <TextField fullWidth size="small" label="Validity" value={form.detailedSections.touristVisa.validity} onChange={(e) => setDsObj("touristVisa", "validity", e.target.value)} sx={textFieldSx} />
              <TextField fullWidth size="small" label="Stay Duration" value={form.detailedSections.touristVisa.stayDuration} onChange={(e) => setDsObj("touristVisa", "stayDuration", e.target.value)} sx={textFieldSx} />
            </Stack>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
              <TextField fullWidth size="small" label="Entry Type" placeholder="Single / Multiple" value={form.detailedSections.touristVisa.entryType} onChange={(e) => setDsObj("touristVisa", "entryType", e.target.value)} sx={textFieldSx} />
              <TextField fullWidth size="small" label="Application Method" value={form.detailedSections.touristVisa.applicationMethod} onChange={(e) => setDsObj("touristVisa", "applicationMethod", e.target.value)} sx={textFieldSx} />
            </Stack>
            <TextField fullWidth size="small" multiline minRows={2} label="Main Requirements" value={form.detailedSections.touristVisa.requirements} onChange={(e) => setDsObj("touristVisa", "requirements", e.target.value)} sx={textFieldSx} />

            <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
            <Typography sx={{ color: "#9ca3af", fontSize: 13, fontWeight: 600 }}>Business Visa</Typography>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
              <TextField fullWidth size="small" label="Purpose" value={form.detailedSections.businessVisa.purpose} onChange={(e) => setDsObj("businessVisa", "purpose", e.target.value)} sx={textFieldSx} />
              <TextField fullWidth size="small" label="Processing Time" value={form.detailedSections.businessVisa.processingTime} onChange={(e) => setDsObj("businessVisa", "processingTime", e.target.value)} sx={textFieldSx} />
            </Stack>
            <TextField fullWidth size="small" label="Invitation Letter" value={form.detailedSections.businessVisa.invitationLetter} onChange={(e) => setDsObj("businessVisa", "invitationLetter", e.target.value)} sx={textFieldSx} />
            <TextField fullWidth size="small" multiline minRows={2} label="Business Documents" value={form.detailedSections.businessVisa.businessDocuments} onChange={(e) => setDsObj("businessVisa", "businessDocuments", e.target.value)} sx={textFieldSx} />
            <TextField fullWidth size="small" label="Application Method" value={form.detailedSections.businessVisa.applicationMethod} onChange={(e) => setDsObj("businessVisa", "applicationMethod", e.target.value)} sx={textFieldSx} />

            <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
            <Typography sx={{ color: "#9ca3af", fontSize: 13, fontWeight: 600 }}>Transit Visa</Typography>
            <TextField fullWidth size="small" label="When Required" value={form.detailedSections.transitVisa.whenRequired} onChange={(e) => setDsObj("transitVisa", "whenRequired", e.target.value)} sx={textFieldSx} />
            <TextField fullWidth size="small" multiline minRows={2} label="Airport Transit Rules" value={form.detailedSections.transitVisa.airportTransitRules} onChange={(e) => setDsObj("transitVisa", "airportTransitRules", e.target.value)} sx={textFieldSx} />
            <TextField fullWidth size="small" label="Connecting Flight Conditions" value={form.detailedSections.transitVisa.connectingFlightConditions} onChange={(e) => setDsObj("transitVisa", "connectingFlightConditions", e.target.value)} sx={textFieldSx} />
            <TextField fullWidth size="small" label="Important Exceptions" value={form.detailedSections.transitVisa.exceptions} onChange={(e) => setDsObj("transitVisa", "exceptions", e.target.value)} sx={textFieldSx} />

            <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
            <Typography sx={{ color: "#9ca3af", fontSize: 13, fontWeight: 600 }}>eVisa Details</Typography>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
              <TextField fullWidth size="small" label="Available" placeholder="Yes / No" value={form.detailedSections.eVisaDetails.available} onChange={(e) => setDsObj("eVisaDetails", "available", e.target.value)} sx={textFieldSx} />
              <TextField fullWidth size="small" label="Processing Time" value={form.detailedSections.eVisaDetails.processingTime} onChange={(e) => setDsObj("eVisaDetails", "processingTime", e.target.value)} sx={textFieldSx} />
            </Stack>
            <TextField fullWidth size="small" label="Official eVisa Link" value={form.detailedSections.eVisaDetails.officialLink} onChange={(e) => setDsObj("eVisaDetails", "officialLink", e.target.value)} sx={textFieldSx} />
            <TextField fullWidth size="small" multiline minRows={2} label="Application Steps" value={form.detailedSections.eVisaDetails.applicationSteps} onChange={(e) => setDsObj("eVisaDetails", "applicationSteps", e.target.value)} sx={textFieldSx} />
            <TextField fullWidth size="small" label="Required Documents" value={form.detailedSections.eVisaDetails.requiredDocuments} onChange={(e) => setDsObj("eVisaDetails", "requiredDocuments", e.target.value)} sx={textFieldSx} />
            <TextField fullWidth size="small" label="Warnings (unofficial sites)" value={form.detailedSections.eVisaDetails.warnings} onChange={(e) => setDsObj("eVisaDetails", "warnings", e.target.value)} sx={textFieldSx} />

            <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
            <Typography sx={{ color: "#9ca3af", fontSize: 13, fontWeight: 600 }}>Visa on Arrival Details</Typography>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
              <TextField fullWidth size="small" label="Available" placeholder="Yes / No" value={form.detailedSections.visaOnArrivalDetails.available} onChange={(e) => setDsObj("visaOnArrivalDetails", "available", e.target.value)} sx={textFieldSx} />
              <TextField fullWidth size="small" label="Payment Method" value={form.detailedSections.visaOnArrivalDetails.paymentMethod} onChange={(e) => setDsObj("visaOnArrivalDetails", "paymentMethod", e.target.value)} sx={textFieldSx} />
            </Stack>
            <TextField fullWidth size="small" label="Eligible Travellers" value={form.detailedSections.visaOnArrivalDetails.eligibleTravellers} onChange={(e) => setDsObj("visaOnArrivalDetails", "eligibleTravellers", e.target.value)} sx={textFieldSx} />
            <TextField fullWidth size="small" label="Required Documents" value={form.detailedSections.visaOnArrivalDetails.requiredDocuments} onChange={(e) => setDsObj("visaOnArrivalDetails", "requiredDocuments", e.target.value)} sx={textFieldSx} />
            <TextField fullWidth size="small" label="Airport / Border Availability" value={form.detailedSections.visaOnArrivalDetails.availability} onChange={(e) => setDsObj("visaOnArrivalDetails", "availability", e.target.value)} sx={textFieldSx} />
            <TextField fullWidth size="small" label="Important Notes" value={form.detailedSections.visaOnArrivalDetails.notes} onChange={(e) => setDsObj("visaOnArrivalDetails", "notes", e.target.value)} sx={textFieldSx} />

            <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
            <TextField fullWidth size="small" multiline minRows={2} label="Passport Validity (detail)" value={form.detailedSections.passportValidityDetail} onChange={setDsString("passportValidityDetail")} sx={textFieldSx} />
            <TextField fullWidth size="small" multiline minRows={2} label="Processing Time (detail)" value={form.detailedSections.processingTimeDetail} onChange={setDsString("processingTimeDetail")} sx={textFieldSx} />
          </Stack>
        </CardContent>
      </Card>

      {/* Application steps */}
      <Card sx={cardSx}>
        <CardHeader
          title={<Typography sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}>Application Steps</Typography>}
          action={<Button size="small" startIcon={<AddIcon />} onClick={addStep} sx={{ color: "#3B82F6" }}>Add Step</Button>}
          sx={{ px: 2.5, pt: 2.25, pb: 1 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <Stack spacing={1.5}>
            {form.detailedSections.applicationSteps.length === 0 && (
              <Typography sx={{ color: "#71717A", fontSize: 13 }}>No steps added yet.</Typography>
            )}
            {form.detailedSections.applicationSteps.map((step, i) => (
              <Stack key={i} direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 28, height: 28, borderRadius: "50%", bgcolor: "rgba(59,130,246,0.1)", color: "#3B82F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                  {i + 1}
                </Box>
                <TextField fullWidth size="small" placeholder="Step description" value={step}
                  onChange={(e) => setStep(i, e.target.value)} sx={textFieldSx} />
                <IconButton size="small" onClick={() => removeStep(i)} sx={{ color: "#ef4444" }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Official links */}
      <Card sx={cardSx}>
        <CardHeader
          title={<Typography sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}>Official Links</Typography>}
          action={<Button size="small" startIcon={<AddIcon />} onClick={addLink} sx={{ color: "#3B82F6" }}>Add Link</Button>}
          sx={{ px: 2.5, pt: 2.25, pb: 1 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <Stack spacing={1.5}>
            {form.detailedSections.officialLinks.length === 0 && (
              <Typography sx={{ color: "#71717A", fontSize: 13 }}>No links added yet.</Typography>
            )}
            {form.detailedSections.officialLinks.map((lnk, i) => (
              <Stack key={i} direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ sm: "center" }}>
                <TextField size="small" label="Label" placeholder="e.g. Embassy Website" value={lnk.label} onChange={(e) => setLink(i, "label", e.target.value)} sx={{ ...textFieldSx, minWidth: 200 }} />
                <TextField fullWidth size="small" label="URL" placeholder="https://…" value={lnk.url} onChange={(e) => setLink(i, "url", e.target.value)} sx={textFieldSx} />
                <IconButton size="small" onClick={() => removeLink(i)} sx={{ color: "#ef4444" }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Travel warnings list */}
      <Card sx={cardSx}>
        <CardHeader
          title={<Typography sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}>Travel Warnings</Typography>}
          action={<Button size="small" startIcon={<AddIcon />} onClick={addWarn} sx={{ color: "#3B82F6" }}>Add Warning</Button>}
          sx={{ px: 2.5, pt: 2.25, pb: 1 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <Stack spacing={1.5}>
            {form.detailedSections.travelWarnings.length === 0 && (
              <Typography sx={{ color: "#71717A", fontSize: 13 }}>No warnings added yet.</Typography>
            )}
            {form.detailedSections.travelWarnings.map((w, i) => (
              <Stack key={i} direction="row" spacing={1} alignItems="center">
                <TextField fullWidth size="small" multiline placeholder="Warning text…" value={w}
                  onChange={(e) => setWarn(i, e.target.value)} sx={textFieldSx} />
                <IconButton size="small" onClick={() => removeWarn(i)} sx={{ color: "#ef4444" }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* FAQs */}
      <Card sx={cardSx}>
        <CardHeader
          title={<Typography sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}>FAQs</Typography>}
          action={<Button size="small" startIcon={<AddIcon />} onClick={addFaq} sx={{ color: "#3B82F6" }}>Add FAQ</Button>}
          sx={{ px: 2.5, pt: 2.25, pb: 1 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <Stack spacing={2}>
            {form.faqs.length === 0 && (
              <Typography sx={{ color: "#71717A", fontSize: 13 }}>No FAQs added yet.</Typography>
            )}
            {form.faqs.map((faq, i) => (
              <Box key={i} sx={{ p: 2, bgcolor: "rgba(255,255,255,0.02)", borderRadius: 1.5, border: "1px solid rgba(255,255,255,0.05)" }}>
                <Stack spacing={1.5}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ color: "#9ca3af", fontSize: 12 }}>FAQ {i + 1}</Typography>
                    <IconButton size="small" onClick={() => removeFaq(i)} sx={{ color: "#ef4444" }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <TextField fullWidth size="small" label="Question" value={faq.question} onChange={(e) => setFaq(i, "question", e.target.value)} sx={textFieldSx} />
                  <TextField fullWidth multiline minRows={2} size="small" label="Answer" value={faq.answer} onChange={(e) => setFaq(i, "answer", e.target.value)} sx={textFieldSx} />
                </Stack>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* SEO */}
      <Card sx={cardSx}>
        <CardHeader title={<Typography sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}>SEO</Typography>} sx={{ px: 2.5, pt: 2.25, pb: 1 }} />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <Stack spacing={2}>
            <TextField fullWidth size="small" label="Meta Title" value={form.metaTitle} onChange={set("metaTitle")} sx={textFieldSx}
              helperText={`${form.metaTitle.length}/60`} FormHelperTextProps={{ sx: { color: form.metaTitle.length > 60 ? "#ef4444" : "#71717A" } }} />
            <TextField fullWidth multiline minRows={2} size="small" label="Meta Description" value={form.metaDescription} onChange={set("metaDescription")} sx={textFieldSx}
              helperText={`${form.metaDescription.length}/160`} FormHelperTextProps={{ sx: { color: form.metaDescription.length > 160 ? "#ef4444" : "#71717A" } }} />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
