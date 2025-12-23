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
  Alert,
  IconButton,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
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
  address: { line1: "", line2: "", city: "", country: "" },
  contactInfo: [],
  socialLinks: [],
  formSettings: { title: "", subtitle: "" },
};

const contactTypes = [
  { value: "email", label: "Email", icon: EmailIcon },
  { value: "phone", label: "Phone", icon: PhoneIcon },
  { value: "address", label: "Address", icon: LocationIcon },
];

const socialTypes = [
  { value: "facebook", label: "Facebook", icon: FacebookIcon },
  { value: "twitter", label: "Twitter/X", icon: TwitterIcon },
  { value: "instagram", label: "Instagram", icon: InstagramIcon },
  { value: "linkedin", label: "LinkedIn", icon: LinkedInIcon },
];

export default function ContactForm() {
  const slug = "contact";
  const { data, isLoading, isError } = useCmsPage(slug);
  const saveMutation = useSaveCmsPage();

  const [title, setTitle] = useState("Contact");
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    if (data) {
      setTitle(data.title || "Contact");
      setContent({ ...defaultContent, ...(data.content || {}) });
    }
  }, [data]);

  const updateHero = (field, value) => {
    setContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }));
  };

  const updateAddress = (field, value) => {
    setContent((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const updateFormSettings = (field, value) => {
    setContent((prev) => ({
      ...prev,
      formSettings: { ...prev.formSettings, [field]: value },
    }));
  };

  const addContactInfo = () => {
    setContent((prev) => ({
      ...prev,
      contactInfo: [
        ...(prev.contactInfo || []),
        { type: "email", label: "", value: "" },
      ],
    }));
  };

  const updateContactInfo = (index, field, value) => {
    setContent((prev) => {
      const contactInfo = [...(prev.contactInfo || [])];
      contactInfo[index] = { ...contactInfo[index], [field]: value };
      return { ...prev, contactInfo };
    });
  };

  const removeContactInfo = (index) => {
    setContent((prev) => ({
      ...prev,
      contactInfo: prev.contactInfo?.filter((_, i) => i !== index) || [],
    }));
  };

  const addSocialLink = () => {
    setContent((prev) => ({
      ...prev,
      socialLinks: [...(prev.socialLinks || []), { type: "facebook", url: "" }],
    }));
  };

  const updateSocialLink = (index, field, value) => {
    setContent((prev) => {
      const socialLinks = [...(prev.socialLinks || [])];
      socialLinks[index] = { ...socialLinks[index], [field]: value };
      return { ...prev, socialLinks };
    });
  };

  const removeSocialLink = (index) => {
    setContent((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks?.filter((_, i) => i !== index) || [],
    }));
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
            Contact Page
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#71717A", mt: 0.5, fontFamily: "Inter" }}
          >
            Manage contact information and social links
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
              The main banner at the top of the contact page
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

      {/* Address */}
      <Card sx={cardSx}>
        <CardHeader
          title={
            <Typography
              sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}
            >
              Office Address
            </Typography>
          }
          subheader={
            <Typography
              variant="caption"
              sx={{ color: "#71717A", fontFamily: "Inter" }}
            >
              Your physical office location
            </Typography>
          }
          sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line 1"
                value={content.address?.line1 || ""}
                onChange={(e) => updateAddress("line1", e.target.value)}
                sx={textFieldSx}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line 2 (optional)"
                value={content.address?.line2 || ""}
                onChange={(e) => updateAddress("line2", e.target.value)}
                sx={textFieldSx}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="City"
                value={content.address?.city || ""}
                onChange={(e) => updateAddress("city", e.target.value)}
                sx={textFieldSx}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Country"
                value={content.address?.country || ""}
                onChange={(e) => updateAddress("country", e.target.value)}
                sx={textFieldSx}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card sx={cardSx}>
        <CardHeader
          title={
            <Typography
              sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}
            >
              Contact Information
            </Typography>
          }
          subheader={
            <Typography
              variant="caption"
              sx={{ color: "#71717A", fontFamily: "Inter" }}
            >
              Email addresses, phone numbers, etc.
            </Typography>
          }
          action={
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={addContactInfo}
              sx={{ color: "#3B82F6" }}
            >
              Add Contact
            </Button>
          }
          sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <Stack spacing={2}>
            {(content.contactInfo || []).map((info, index) => (
              <Stack
                key={index}
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems="flex-start"
              >
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel sx={{ color: "#9ca3af" }}>Type</InputLabel>
                  <Select
                    value={info.type || "email"}
                    label="Type"
                    onChange={(e) =>
                      updateContactInfo(index, "type", e.target.value)
                    }
                    sx={{
                      color: "#e5e7eb",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255,255,255,0.1)",
                      },
                      "& .MuiSelect-icon": { color: "#9ca3af" },
                    }}
                  >
                    {contactTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Label"
                  placeholder="e.g., Support Email"
                  value={info.label || ""}
                  onChange={(e) =>
                    updateContactInfo(index, "label", e.target.value)
                  }
                  sx={textFieldSx}
                />
                <TextField
                  fullWidth
                  label="Value"
                  placeholder="e.g., support@flyarzan.com"
                  value={info.value || ""}
                  onChange={(e) =>
                    updateContactInfo(index, "value", e.target.value)
                  }
                  sx={textFieldSx}
                />
                <IconButton
                  onClick={() => removeContactInfo(index)}
                  sx={{ color: "#ef4444", mt: { xs: 0, md: 1 } }}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            ))}
            {(!content.contactInfo || content.contactInfo.length === 0) && (
              <Typography
                variant="body2"
                sx={{ color: "#71717A", textAlign: "center", py: 2 }}
              >
                No contact info added yet. Click &ldquo;Add Contact&rdquo; to
                create one.
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card sx={cardSx}>
        <CardHeader
          title={
            <Typography
              sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}
            >
              Social Media Links
            </Typography>
          }
          subheader={
            <Typography
              variant="caption"
              sx={{ color: "#71717A", fontFamily: "Inter" }}
            >
              Links to your social media profiles
            </Typography>
          }
          action={
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={addSocialLink}
              sx={{ color: "#3B82F6" }}
            >
              Add Social Link
            </Button>
          }
          sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <Stack spacing={2}>
            {(content.socialLinks || []).map((link, index) => (
              <Stack
                key={index}
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems="flex-start"
              >
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel sx={{ color: "#9ca3af" }}>Platform</InputLabel>
                  <Select
                    value={link.type || "facebook"}
                    label="Platform"
                    onChange={(e) =>
                      updateSocialLink(index, "type", e.target.value)
                    }
                    sx={{
                      color: "#e5e7eb",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255,255,255,0.1)",
                      },
                      "& .MuiSelect-icon": { color: "#9ca3af" },
                    }}
                  >
                    {socialTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="URL"
                  placeholder="https://..."
                  value={link.url || ""}
                  onChange={(e) =>
                    updateSocialLink(index, "url", e.target.value)
                  }
                  sx={textFieldSx}
                />
                <IconButton
                  onClick={() => removeSocialLink(index)}
                  sx={{ color: "#ef4444", mt: { xs: 0, md: 1 } }}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            ))}
            {(!content.socialLinks || content.socialLinks.length === 0) && (
              <Typography
                variant="body2"
                sx={{ color: "#71717A", textAlign: "center", py: 2 }}
              >
                No social links added yet. Click &ldquo;Add Social Link&rdquo;
                to create one.
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Contact Form Settings */}
      <Card sx={cardSx}>
        <CardHeader
          title={
            <Typography
              sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter" }}
            >
              Contact Form Settings
            </Typography>
          }
          subheader={
            <Typography
              variant="caption"
              sx={{ color: "#71717A", fontFamily: "Inter" }}
            >
              Customize the contact form appearance
            </Typography>
          }
          sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
        />
        <CardContent sx={{ px: 2.5, pb: 2.5 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Form Title"
              value={content.formSettings?.title || ""}
              onChange={(e) => updateFormSettings("title", e.target.value)}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Form Subtitle"
              value={content.formSettings?.subtitle || ""}
              onChange={(e) => updateFormSettings("subtitle", e.target.value)}
              sx={textFieldSx}
            />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
