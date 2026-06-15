import { useRef, useState } from "react";
import { Box, Typography, CircularProgress, IconButton, Alert, TextField } from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  uploadImage,
  deleteUpload,
  validateImageFile,
  keyFromUrl,
  MAX_IMAGE_BYTES,
} from "@/hooks/useUpload";
import { toast } from "sonner";

/**
 * Secure image uploader for the admin CMS.
 * - Direct-to-bucket presigned uploads (file never touches our API server).
 * - Instant local preview, upload spinner, and SEO alt-text field.
 * - Removing/replacing deletes the object from the bucket (spinner replaces the
 *   trash icon while deleting) so we never leave orphaned files behind.
 *
 * Props:
 *   label, helperText
 *   value       current image URL ("" when none)
 *   objectKey   S3 key for the current image (for reliable deletion)
 *   folder      "articles" | "visa-flags" | "visa-destinations"
 *   onChange(url, key)
 *   alt, onAltChange   optional — renders an SEO alt-text field when provided
 */
const ImageUpload = ({
  label = "Image",
  helperText,
  value = "",
  objectKey = "",
  folder = "articles",
  onChange,
  alt,
  onAltChange,
}) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState("");
  const [localPreview, setLocalPreview] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const busy = uploading || removing;
  const preview = localPreview || value;

  const handleFile = async (file) => {
    setError("");
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    setUploading(true);
    try {
      const { url, key } = await uploadImage(file, folder);
      onChange?.(url, key);
      toast.success("Image uploaded");
    } catch (err) {
      setError(err.message || "Upload failed");
      setLocalPreview("");
    } finally {
      URL.revokeObjectURL(objectUrl);
      setLocalPreview("");
      setUploading(false);
    }
  };

  const onInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = ""; // allow re-selecting the same file
  };

  const handleRemove = async () => {
    setRemoving(true);
    setError("");
    const key = objectKey || keyFromUrl(value);
    try {
      await deleteUpload(key);
    } catch {
      // Even if the bucket delete fails (e.g. key from a path-style URL), still
      // clear the field so the editor isn't stuck; warn rather than block.
      toast.warning("Image removed from the record (bucket cleanup may need manual review).");
    } finally {
      onChange?.("", "");
      setRemoving(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (busy) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <Box>
      <Typography sx={{ color: "#9ca3af", fontSize: 13, mb: 0.75, fontFamily: "Inter" }}>
        {label}
      </Typography>

      {preview ? (
        <Box
          sx={{
            position: "relative",
            borderRadius: 1.5,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.1)",
            bgcolor: "#0B0F16",
          }}
        >
          <Box
            component="img"
            src={preview}
            alt={alt || "Selected image preview"}
            sx={{
              display: "block",
              width: "100%",
              maxHeight: 200,
              objectFit: "cover",
              opacity: uploading ? 0.5 : 1,
              transition: "opacity 0.2s",
            }}
          />

          {/* Uploading overlay */}
          {uploading && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                bgcolor: "rgba(11,15,22,0.6)",
              }}
            >
              <CircularProgress size={28} sx={{ color: "#3B82F6" }} />
              <Typography sx={{ color: "#e5e7eb", fontSize: 12 }}>Uploading…</Typography>
            </Box>
          )}

          {/* Remove button (spinner replaces the trash icon while deleting) */}
          {!uploading && (
            <IconButton
              onClick={handleRemove}
              disabled={removing}
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "rgba(11,15,22,0.85)",
                color: "#ef4444",
                "&:hover": { bgcolor: "rgba(11,15,22,0.95)" },
              }}
              aria-label="Remove image"
            >
              {removing ? (
                <CircularProgress size={18} sx={{ color: "#ef4444" }} />
              ) : (
                <DeleteIcon fontSize="small" />
              )}
            </IconButton>
          )}
        </Box>
      ) : (
        <Box
          role="button"
          tabIndex={0}
          onClick={() => !busy && inputRef.current?.click()}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && !busy && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            py: 4,
            px: 2,
            cursor: busy ? "default" : "pointer",
            borderRadius: 1.5,
            border: "1px dashed",
            borderColor: dragOver ? "#3B82F6" : "rgba(255,255,255,0.18)",
            bgcolor: dragOver ? "rgba(59,130,246,0.06)" : "#0B0F16",
            transition: "all 0.15s",
            "&:hover": { borderColor: "#3B82F6" },
          }}
        >
          {uploading ? (
            <CircularProgress size={24} sx={{ color: "#3B82F6" }} />
          ) : (
            <CloudUploadIcon sx={{ color: "#3B82F6", fontSize: 28 }} />
          )}
          <Typography sx={{ color: "#e5e7eb", fontSize: 13, fontWeight: 500 }}>
            {uploading ? "Uploading…" : "Click or drag an image here"}
          </Typography>
          <Typography sx={{ color: "#71717A", fontSize: 11.5 }}>
            JPEG, PNG, WebP, GIF or AVIF · up to {Math.round(MAX_IMAGE_BYTES / 1024 / 1024)} MB
          </Typography>
        </Box>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        onChange={onInputChange}
        style={{ display: "none" }}
      />

      {helperText && !error && (
        <Typography sx={{ color: "#71717A", fontSize: 11.5, mt: 0.75 }}>{helperText}</Typography>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 1, py: 0, fontSize: 12 }}>
          {error}
        </Alert>
      )}

      {/* SEO alt text */}
      {onAltChange && (
        <TextField
          fullWidth
          size="small"
          label="Alt text (for SEO & accessibility)"
          value={alt || ""}
          onChange={(e) => onAltChange(e.target.value)}
          sx={{
            mt: 1.5,
            "& .MuiOutlinedInput-root": {
              bgcolor: "#0B0F16",
              "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
              "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
              "&.Mui-focused fieldset": { borderColor: "#3B82F6", borderWidth: 1 },
            },
            "& .MuiInputLabel-root": { color: "#9ca3af", "&.Mui-focused": { color: "#3B82F6" } },
            "& input": { color: "#e5e7eb" },
          }}
        />
      )}
    </Box>
  );
};

export default ImageUpload;
