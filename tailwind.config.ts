import type { Config } from "tailwindcss";
import formsPlugin from "@tailwindcss/forms";
import typographyPlugin from "@tailwindcss/typography";
import aspectRatioPlugin from "@tailwindcss/aspect-ratio";
import containerQueriesPlugin from "@tailwindcss/container-queries";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          50: "#f7f7f7",
          100: "#e3e3e3",
          200: "#c8c8c8",
          300: "#a4a4a4",
          400: "#818181",
          500: "#666666",
          600: "#515151",
          700: "#434343",
          800: "#383838",
          900: "#1a1a1a",
          950: "#0d0d0d",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        "dark-lg":
          "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
      },
    },
  },
  plugins: [
    formsPlugin({
      strategy: "class",
    }),
    typographyPlugin,
    aspectRatioPlugin,
    containerQueriesPlugin,
  ],
  darkMode: "class",
};

export default config;
