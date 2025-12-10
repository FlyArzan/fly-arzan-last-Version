/**
 * Consistent Dashboard Styles
 * Use these across all admin pages for UI consistency
 */

// Card styles
export const cardStyles = {
  base: {
    borderRadius: 2,
    bgcolor: "#1A1D23",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
  },
  // Stat card - for KPI cards with equal heights
  stat: {
    height: "100%",
    minHeight: 140,
    borderRadius: 2,
    bgcolor: "#1A1D23",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
  },
  gradient: {
    blue: {
      borderRadius: 2,
      bgcolor: "#1A1D23",
      background:
        "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0.02) 100%)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    },
    purple: {
      borderRadius: 2,
      bgcolor: "#1A1D23",
      background:
        "linear-gradient(135deg, rgba(147, 51, 234, 0.05) 0%, rgba(147, 51, 234, 0.02) 100%)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    },
    green: {
      borderRadius: 2,
      bgcolor: "#1A1D23",
      background:
        "linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(34, 197, 94, 0.02) 100%)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    },
    orange: {
      borderRadius: 2,
      bgcolor: "#1A1D23",
      background:
        "linear-gradient(135deg, rgba(249, 115, 22, 0.05) 0%, rgba(249, 115, 22, 0.02) 100%)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    },
    red: {
      borderRadius: 2,
      bgcolor: "#1A1D23",
      background:
        "linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.02) 100%)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    },
  },
  // Stat card with gradient - combines stat sizing with gradient
  statGradient: {
    blue: {
      height: "100%",
      minHeight: 140,
      borderRadius: 2,
      bgcolor: "#1A1D23",
      background:
        "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0.02) 100%)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    },
    purple: {
      height: "100%",
      minHeight: 140,
      borderRadius: 2,
      bgcolor: "#1A1D23",
      background:
        "linear-gradient(135deg, rgba(147, 51, 234, 0.05) 0%, rgba(147, 51, 234, 0.02) 100%)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    },
    green: {
      height: "100%",
      minHeight: 140,
      borderRadius: 2,
      bgcolor: "#1A1D23",
      background:
        "linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(34, 197, 94, 0.02) 100%)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    },
    orange: {
      height: "100%",
      minHeight: 140,
      borderRadius: 2,
      bgcolor: "#1A1D23",
      background:
        "linear-gradient(135deg, rgba(249, 115, 22, 0.05) 0%, rgba(249, 115, 22, 0.02) 100%)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    },
    red: {
      height: "100%",
      minHeight: 140,
      borderRadius: 2,
      bgcolor: "#1A1D23",
      background:
        "linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.02) 100%)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    },
  },
};

// Input/TextField styles
export const inputStyles = {
  base: {
    "& .MuiOutlinedInput-root": {
      bgcolor: "#0B0F16",
      borderRadius: 2,
      fontSize: 14,
      fontFamily: "Inter",
      "& fieldset": {
        borderColor: "rgba(255, 255, 255, 0.1)",
      },
      "&:hover fieldset": {
        borderColor: "rgba(255, 255, 255, 0.2)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#3B82F6",
        borderWidth: 1,
      },
      "& input": {
        color: "#FFFFFF",
      },
      "& input::placeholder": {
        color: "#71717A",
        opacity: 1,
      },
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
  },
  search: {
    "& .MuiOutlinedInput-root": {
      bgcolor: "#0B0F16",
      borderRadius: 2,
      fontSize: 14,
      fontFamily: "Inter",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      "& fieldset": {
        border: "none",
      },
      "& input": {
        color: "#FFFFFF",
      },
      "& input::placeholder": {
        color: "#71717A",
        opacity: 1,
      },
    },
  },
  // Dark input style for modals and forms
  dark: {
    "& .MuiOutlinedInput-root": {
      bgcolor: "#0B0F16",
      borderRadius: 2,
      fontSize: 14,
      fontFamily: "Inter",
      "& fieldset": {
        borderColor: "rgba(255, 255, 255, 0.15)",
      },
      "&:hover fieldset": {
        borderColor: "rgba(255, 255, 255, 0.25)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#3B82F6",
        borderWidth: 1,
      },
      "& input, & textarea": {
        color: "#FFFFFF",
        border: "none",
        outline: "none",
        boxShadow: "none",
      },
      "& input:focus, & textarea:focus": {
        border: "none",
        outline: "none",
        boxShadow: "none",
      },
      "& input::placeholder, & textarea::placeholder": {
        color: "#71717A",
        opacity: 1,
      },
    },
    "& .MuiInputLabel-root": {
      color: "#9ca3af",
      fontFamily: "Inter",
      "&.Mui-focused": {
        color: "#3B82F6",
      },
    },
    "& .MuiFormHelperText-root": {
      color: "#71717A",
      fontFamily: "Inter",
    },
  },
};

// Select styles
export const selectStyles = {
  base: {
    bgcolor: "#0B0F16",
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Inter",
    borderRadius: 2,
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255, 255, 255, 0.08)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255, 255, 255, 0.15)",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#3B82F6",
      borderWidth: 1,
    },
    "& .MuiSelect-icon": {
      color: "#71717A",
    },
  },
  menuProps: {
    PaperProps: {
      sx: {
        bgcolor: "#1A1D23",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: 2,
        mt: 0.5,
        "& .MuiMenuItem-root": {
          fontFamily: "Inter",
          fontSize: 14,
          color: "#FFFFFF",
          "&:hover": {
            bgcolor: "rgba(59, 130, 246, 0.1)",
          },
          "&.Mui-selected": {
            bgcolor: "rgba(59, 130, 246, 0.15)",
            "&:hover": {
              bgcolor: "rgba(59, 130, 246, 0.2)",
            },
          },
        },
      },
    },
  },
};

// Button styles
export const buttonStyles = {
  primary: {
    bgcolor: "#3B82F6",
    color: "#FFFFFF",
    fontFamily: "Inter",
    fontWeight: 500,
    textTransform: "none",
    borderRadius: 2,
    px: 2,
    py: 1,
    "&:hover": {
      bgcolor: "#2563EB",
    },
  },
  secondary: {
    bgcolor: "transparent",
    color: "#3B82F6",
    fontFamily: "Inter",
    fontWeight: 500,
    textTransform: "none",
    borderRadius: 2,
    px: 2,
    py: 1,
    border: "1px solid rgba(59, 130, 246, 0.3)",
    "&:hover": {
      bgcolor: "rgba(59, 130, 246, 0.1)",
      borderColor: "#3B82F6",
    },
  },
  danger: {
    bgcolor: "rgba(239, 68, 68, 0.1)",
    color: "#EF4444",
    fontFamily: "Inter",
    fontWeight: 500,
    textTransform: "none",
    borderRadius: 2,
    px: 2,
    py: 1,
    border: "1px solid rgba(239, 68, 68, 0.3)",
    "&:hover": {
      bgcolor: "rgba(239, 68, 68, 0.2)",
      borderColor: "#EF4444",
    },
  },
};

// Chip styles
export const chipStyles = {
  default: {
    bgcolor: "rgba(59, 130, 246, 0.1)",
    color: "#3B82F6",
    border: "1px solid rgba(59, 130, 246, 0.2)",
    borderRadius: 2,
    fontFamily: "Inter",
    fontSize: "0.75rem",
    fontWeight: 500,
  },
  success: {
    bgcolor: "rgba(34, 197, 94, 0.1)",
    color: "#22C55E",
    border: "1px solid rgba(34, 197, 94, 0.2)",
    borderRadius: 2,
    fontFamily: "Inter",
    fontSize: "0.75rem",
    fontWeight: 500,
  },
  warning: {
    bgcolor: "rgba(249, 115, 22, 0.1)",
    color: "#F97316",
    border: "1px solid rgba(249, 115, 22, 0.2)",
    borderRadius: 2,
    fontFamily: "Inter",
    fontSize: "0.75rem",
    fontWeight: 500,
  },
  danger: {
    bgcolor: "rgba(239, 68, 68, 0.1)",
    color: "#EF4444",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    borderRadius: 2,
    fontFamily: "Inter",
    fontSize: "0.75rem",
    fontWeight: 500,
  },
  neutral: {
    bgcolor: "rgba(113, 113, 122, 0.1)",
    color: "#A1A1AA",
    border: "1px solid rgba(113, 113, 122, 0.2)",
    borderRadius: 2,
    fontFamily: "Inter",
    fontSize: "0.75rem",
    fontWeight: 500,
  },
};

// Table styles
export const tableStyles = {
  headerCell: {
    color: "#71717A",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    fontSize: "0.75rem",
    fontFamily: "Inter",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    py: 2,
  },
  bodyCell: {
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "Inter",
    py: 2,
  },
  row: {
    cursor: "pointer",
    "&:hover": {
      bgcolor: "rgba(59, 130, 246, 0.05)",
    },
  },
};

// Typography styles
export const typographyStyles = {
  pageTitle: {
    fontWeight: 700,
    color: "#FFFFFF",
    fontFamily: "Inter",
  },
  pageSubtitle: {
    color: "#71717A",
    mt: 0.5,
    fontFamily: "Inter",
  },
  cardTitle: {
    color: "#FFFFFF",
    fontWeight: 600,
    fontFamily: "Inter",
  },
  cardSubtitle: {
    color: "#71717A",
    fontFamily: "Inter",
  },
  label: {
    color: "#71717A",
    fontSize: 12,
    fontFamily: "Inter",
  },
  value: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Inter",
  },
};

// Menu styles
export const menuStyles = {
  paper: {
    mt: 1,
    bgcolor: "#1A1D23",
    color: "#FFFFFF",
    minWidth: 200,
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: 2,
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
    "& .MuiMenuItem-root": {
      fontFamily: "Inter",
      fontSize: "0.875rem",
      py: 1.5,
      "&:hover": {
        bgcolor: "rgba(59, 130, 246, 0.1)",
      },
    },
  },
};

// Role colors
export const roleColors = {
  admin: {
    bg: "rgba(239, 68, 68, 0.1)",
    color: "#EF4444",
    border: "rgba(239, 68, 68, 0.2)",
  },
  moderator: {
    bg: "rgba(249, 115, 22, 0.1)",
    color: "#F59E0B",
    border: "rgba(249, 115, 22, 0.2)",
  },
  user: {
    bg: "rgba(59, 130, 246, 0.1)",
    color: "#3B82F6",
    border: "rgba(59, 130, 246, 0.2)",
  },
  owner: {
    bg: "rgba(249, 115, 22, 0.1)",
    color: "#F97316",
    border: "rgba(249, 115, 22, 0.2)",
  },
  analyst: {
    bg: "rgba(34, 197, 94, 0.1)",
    color: "#22C55E",
    border: "rgba(34, 197, 94, 0.2)",
  },
  support: {
    bg: "rgba(147, 51, 234, 0.1)",
    color: "#A855F7",
    border: "rgba(147, 51, 234, 0.2)",
  },
};

// Status colors
export const statusColors = {
  active: { bg: "rgba(34, 197, 94, 0.1)", color: "#22C55E" },
  inactive: { bg: "rgba(113, 113, 122, 0.1)", color: "#71717A" },
  banned: { bg: "rgba(239, 68, 68, 0.1)", color: "#EF4444" },
  pending: { bg: "rgba(249, 115, 22, 0.1)", color: "#F97316" },
};

// Get role chip style
export const getRoleChipStyle = (role) => {
  const normalizedRole = (role || "user").toLowerCase();
  const colors = roleColors[normalizedRole] || roleColors.user;
  return {
    bgcolor: colors.bg,
    color: colors.color,
    border: `1px solid ${colors.border}`,
    borderRadius: 2,
    fontFamily: "Inter",
    fontSize: "0.75rem",
    fontWeight: 500,
  };
};

// Get status chip style
export const getStatusChipStyle = (status) => {
  const normalizedStatus = (status || "inactive").toLowerCase();
  const colors = statusColors[normalizedStatus] || statusColors.inactive;
  return {
    bgcolor: colors.bg,
    color: colors.color,
    borderRadius: 2,
    fontFamily: "Inter",
    fontSize: "0.75rem",
    fontWeight: 500,
  };
};
