import { createTheme } from "@mui/material/styles";

/**
 * Global dark theme for the /admin dashboard.
 *
 * Individual admin pages have historically hand-rolled their own dark
 * styling via inline `sx` (see src/pages/admin/styles/dashboard-styles.js
 * and ~11 near-duplicate local `textFieldSx`/`cardSx` constants). That only
 * covers the elements a page remembers to style directly — it never reaches
 * portal-rendered pieces like a Select's dropdown Menu/Popover, so those
 * silently fall back to MUI's default *light* theme (white popup, black
 * chevron icon, low-contrast default Chip) even on pages that otherwise
 * look fully dark. Setting `palette.mode: "dark"` plus a few component
 * overrides here fixes every current AND future admin component in one
 * place, portals included, since MUI reads the theme via React context
 * (unaffected by where in the DOM a portal renders).
 */
const adminTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#3B82F6" },
    background: { default: "#0B0F16", paper: "#1A1D23" },
    text: { primary: "#e5e7eb", secondary: "#9ca3af" },
    divider: "rgba(255, 255, 255, 0.08)",
  },
  typography: {
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
    // Covers every Select dropdown, Menu, and Autocomplete popup — including
    // ones with no local MenuProps at all (e.g. a plain multi-select
    // checkbox list), which is what was rendering as an unreadable white box.
    MuiPopover: {
      styleOverrides: {
        paper: {
          backgroundColor: "#1A1D23",
          color: "#e5e7eb",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          backgroundImage: "none",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "#1A1D23",
          color: "#e5e7eb",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          backgroundImage: "none",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: 14,
          "&:hover": { backgroundColor: "rgba(59, 130, 246, 0.1)" },
          "&.Mui-selected": {
            backgroundColor: "rgba(59, 130, 246, 0.15)",
            "&:hover": { backgroundColor: "rgba(59, 130, 246, 0.2)" },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#0B0F16",
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.1)" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.2)" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#3B82F6", borderWidth: 1 },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#9ca3af",
          "&.Mui-focused": { color: "#3B82F6" },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: { color: "#9ca3af" },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: { color: "#9ca3af" },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: { color: "#71717A" },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: "rgba(255, 255, 255, 0.08)", fontSize: 13 },
        head: {
          fontSize: 12,
          fontWeight: 600,
          color: "#9ca3af",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { backgroundColor: "#1A1D23", backgroundImage: "none" },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#1A1D23",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          fontSize: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none" },
      },
    },
  },
});

export default adminTheme;
