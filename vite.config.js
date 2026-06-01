import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Compress raster/SVG assets at build time. Plugin defaults are quality:100
    // (near-lossless = little savings), so we set real quality values here.
    // Format is preserved; it skips any image whose optimized size is larger.
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      webp: { lossless: false, quality: 80 },
      avif: { lossless: false, quality: 70 },
      // svg uses the plugin's safe svgo preset by default
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-mui": [
            "@mui/material",
            "@mui/icons-material",
            "@emotion/react",
            "@emotion/styled",
            "@mui/styled-engine-sc",
          ],
          "vendor-antd": ["antd"],
          "vendor-radix": [
            "@radix-ui/react-accordion",
            "@radix-ui/react-alert-dialog",
            "@radix-ui/react-avatar",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-collapsible",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-label",
            "@radix-ui/react-popover",
            "@radix-ui/react-select",
            "@radix-ui/react-separator",
            "@radix-ui/react-slider",
            "@radix-ui/react-slot",
            "@radix-ui/react-switch",
            "@radix-ui/react-tabs",
            "@radix-ui/react-toast",
            "@radix-ui/react-tooltip",
          ],
          "vendor-charts": ["recharts", "chart.js", "react-chartjs-2"],
          "vendor-motion": ["framer-motion"],
          "vendor-query": [
            "@tanstack/react-query",
            "@tanstack/react-query-devtools",
          ],
          "vendor-i18n": ["i18next", "react-i18next"],
          "vendor-forms": ["react-hook-form", "@hookform/resolvers", "yup"],
          "vendor-date": [
            "react-datepicker",
            "react-day-picker",
            "react-calendar",
            "date-fns",
          ],
          "vendor-icons": ["react-icons", "lucide-react"],
          "vendor-maps": ["@react-google-maps/api"],
          "vendor-dnd": [
            "@dnd-kit/core",
            "@dnd-kit/modifiers",
            "@dnd-kit/sortable",
            "@dnd-kit/utilities",
          ],
          "vendor-paypal": ["@paypal/react-paypal-js"],
        },
      },
    },
  },
});
