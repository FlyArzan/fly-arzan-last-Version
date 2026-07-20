import { useRef, useState } from "react";
import { Box, Typography, CircularProgress, IconButton, Alert, Link as MuiLink } from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  PictureAsPdf as PdfIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";
import {
  uploadImage,
  deleteUpload,
  validatePdfFile,
  keyFromUrl,
  MAX_PDF_BYTES,
} from "@/hooks/useUpload";
import { toast } from "sonner";

// Best-effort readable filename from a stored/proxy URL, e.g.
// ".../article-documents/baggage-guide-3f9a1c2b.pdf" -> "baggage-guide-3f9a1c2b.pdf"
const filenameFromUrl = (url) => {
  try {
    const path = new URL(url).pathname;
    return decodeURIComponent(path.split("/").pop() || "Uploaded PDF");
  } catch {
    return "Uploaded PDF";
  }
};

/**
 * Secure PDF uploader for the admin CMS — used by PDF-type articles instead
 * of the rich-text body.
 * - Direct-to-bucket presigned uploads (file never touches our API server).
 * - Removing deletes the object from the bucket; replacing deletes the old
 *   object first, then uploads the new one — never leaves orphaned files.
 *
 * Props:
 *   value       current PDF URL ("" when none)
 *   objectKey   S3 key for the current file (for reliable deletion)
 *   folder      defaults to "article-documents"
 *   onChange(url, key)
 */
const PdfUpload = ({
  label = "PDF File",
  helperText,
  value = "",
  objectKey = "",
  folder = "article-documents",
  onChange,
}) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState("");

  const busy = uploading || removing;

  const handleFile = async (file) => {
    setError("");
    const validationError = validatePdfFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    try {
      // Replacing an existing PDF: remove the old object first so we never
      // orphan it in the bucket.
      if (value) {
        const oldKey = objectKey || keyFromUrl(value);
        await deleteUpload(oldKey).catch(() => {});
      }
      const { url, key } = await uploadImage(file, folder);
      onChange?.(url, key);
      toast.success("PDF uploaded");
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
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
      toast.success("PDF removed");
    } catch {
      toast.error("Failed to remove PDF");
    } finally {
      onChange?.("", "");
      setRemoving(false);
    }
  };

  return (
    <Box>
      <Typography sx={{ color: "#9ca3af", fontSize: 13, mb: 0.75, fontFamily: "Inter" }}>
        {label}
      </Typography>

      {value ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            borderRadius: 1.5,
            border: "1px solid rgba(255,255,255,0.1)",
            bgcolor: "#0B0F16",
            p: 2,
          }}
        >
          <PdfIcon sx={{ color: "#ef4444", fontSize: 32, flexShrink: 0 }} />
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ color: "#e5e7eb", fontSize: 13, fontWeight: 500, wordBreak: "break-all" }}>
              {filenameFromUrl(value)}
            </Typography>
            <MuiLink
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, fontSize: 12, color: "#3B82F6" }}
            >
              View PDF <OpenInNewIcon sx={{ fontSize: 13 }} />
            </MuiLink>
          </Box>
          {uploading ? (
            <CircularProgress size={20} sx={{ color: "#3B82F6" }} />
          ) : (
            <IconButton
              onClick={handleRemove}
              disabled={removing}
              size="small"
              sx={{ color: "#ef4444" }}
              aria-label="Remove PDF"
            >
              {removing ? <CircularProgress size={18} sx={{ color: "#ef4444" }} /> : <DeleteIcon fontSize="small" />}
            </IconButton>
          )}
        </Box>
      ) : (
        <Box
          role="button"
          tabIndex={0}
          onClick={() => !busy && inputRef.current?.click()}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && !busy && inputRef.current?.click()}
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
            borderColor: "rgba(255,255,255,0.18)",
            bgcolor: "#0B0F16",
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
            {uploading ? "Uploading…" : "Click to upload a PDF"}
          </Typography>
          <Typography sx={{ color: "#71717A", fontSize: 11.5 }}>
            PDF only · up to {Math.round(MAX_PDF_BYTES / 1024 / 1024)} MB
          </Typography>
        </Box>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
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
    </Box>
  );
};

export default PdfUpload;
