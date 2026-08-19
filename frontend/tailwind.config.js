/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: "var(--border-color)",
        input: "var(--border-color)",
        ring: "hsl(var(--ring))",
        background: "var(--bg-page)",
        foreground: "var(--text-primary)",

        // Exact Surface Hierarchy
        surface: {
          sidebar: "var(--bg-sidebar)",
          1: "var(--surface-1)",
          2: "var(--surface-2)",
          3: "var(--surface-3)",
        },

        // Exact Typography Tokens
        content: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },

        // Palette Specific Colors (Light Mode Palette: #845EC2, #4B4453, #B0A8B9, #C34A36, #FF8066)
        palette: {
          purple: "#845EC2",
          charcoal: "#4B4453",
          mist: "#B0A8B9",
          terracotta: "#C34A36",
          coral: "#FF8066",
        },

        // Primary & Secondary Brand Accents
        brand: {
          DEFAULT: "var(--tag-typescript-text)",
          hover: "#845EC2",
          light: "#B0A8B9",
          dark: "#4B4453"
        },

        // Semantic Tag Tokens
        tag: {
          typescript: {
            text: "var(--tag-typescript-text)",
            bg: "var(--tag-typescript-bg)",
          },
          p2p: {
            text: "var(--tag-p2p-text)",
            bg: "var(--tag-p2p-bg)",
          },
          iot: {
            text: "var(--tag-iot-text)",
            bg: "var(--tag-iot-bg)",
          },
          security: {
            text: "var(--tag-security-text)",
            bg: "var(--tag-security-bg)",
          },
          dependencies: {
            text: "var(--tag-dependencies-text)",
            bg: "var(--tag-dependencies-bg)",
          },
        },

        risk: {
          high: "#C34A36",
          medium: "#FF8066",
          low: "#10b981",
        }
      },
      backgroundImage: {
        'gradient-palette': "var(--grad-primary)",
        'gradient-hero': "var(--grad-hero)",
        'gradient-purple': "var(--grad-purple)",
        'gradient-coral': "var(--grad-coral)",
        'gradient-soft': "var(--grad-soft)",
        'icon-indigo': "var(--grad-indigo)",
        'icon-purple': "var(--grad-purple)",
        'icon-teal': "var(--grad-teal)",
        'icon-pink': "var(--grad-pink)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
