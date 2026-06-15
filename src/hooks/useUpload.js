/**
 * Image upload helpers — secure, direct-to-bucket uploads via presigned URLs.
 *
 * Flow:
 *   1. Ask our API for a short-lived presigned PUT URL (admin-only).
 *   2. PUT the file straight to the S3-compatible bucket (never through our API).
 *   3. Store the returned public URL on the record.
 * Cancelling/replacing calls deleteUpload(key) so we never orphan objects.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

// 5 MB — generous for web imagery, small enough to keep pages fast.
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const api = async (path, options = {}) => {
  const res = await fetch(`${API_BASE_URL}/api${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {
      // keep default message
    }
    throw new Error(message);
  }
  return res.json();
};

// Validate a File before we even talk to the server.
export const validateImageFile = (file) => {
  if (!file) return "No file selected.";
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Unsupported file type. Use JPEG, PNG, WebP, GIF or AVIF.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return `Image is too large (max ${Math.round(MAX_IMAGE_BYTES / 1024 / 1024)} MB).`;
  }
  return null;
};

// Presign + PUT to the bucket. Returns { url, key }.
export const uploadImage = async (file, folder, { signal } = {}) => {
  const { uploadUrl, key, publicUrl, contentType } = await api(
    "/admin/uploads/presign",
    {
      method: "POST",
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type,
        folder,
      }),
    },
  );

  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    // No credentials — this goes straight to the bucket, not our API.
    headers: { "Content-Type": contentType },
    body: file,
    signal,
  });

  if (!putRes.ok) {
    throw new Error("Upload to storage failed. Check bucket CORS configuration.");
  }

  return { url: publicUrl, key };
};

// Delete an uploaded object by key.
export const deleteUpload = async (key) => {
  if (!key) return;
  await api("/admin/uploads", {
    method: "DELETE",
    body: JSON.stringify({ key }),
  });
};

// Best-effort key recovery from a stored public URL (for removing images that
// were saved in a previous session, where we no longer hold the key in memory).
export const keyFromUrl = (url) => {
  if (!url) return "";
  try {
    const path = new URL(url).pathname.replace(/^\/+/, "");
    return path;
  } catch {
    return "";
  }
};
