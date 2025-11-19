/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fondo principal dark mode
        dark: "#0E0F12",

        // Superficies glass
        glassLight: "rgba(255,255,255,0.06)",
        glassMedium: "rgba(255,255,255,0.12)",
        borderGlass: "rgba(255,255,255,0.15)",

        // Estados de tareas
        success: "#22C55E", // completed
        warning: "#F59E0B", // pending
        progress: "#FCD34D", // in-progress
      },

      // Blur personalizado para el efecto glass
      backdropBlur: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
      },

      // Border radius estilo bubble
      borderRadius: {
        bubble: "20px",
      },

      // Sombras sutiles elegantes
      boxShadow: {
        bubble: "0 4px 20px rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [],
};