import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    "process.env": {},
  },
  build: {
    cssCodeSplit: false,
    lib: {
      entry: "./src/embed.jsx",
      name: "ChatWidget",
      formats: ["umd"],
      fileName: () => "chat-widget.js",
    },
  },
});
