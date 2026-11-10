export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        rf: {
          bg: "var(--bg-app)",
          surface: "var(--bg-surface)",
          "surface-alt": "var(--bg-surface-alt)",
          border: "var(--border-app)",
          primary: "var(--color-primary)",
          "primary-hover": "var(--color-primary-hover)",
          accent: "var(--color-accent)",
          "accent-hover": "var(--color-accent-hover)",
          text: "var(--text-primary)",
          muted: "var(--text-secondary)",
          error: "var(--color-error)",
          "badge-bg": "var(--badge-verified-bg)",
          "badge-text": "var(--badge-verified-text)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        button: "8px",
        card: "12px",
      },
    },
  },
  plugins: [],
};
