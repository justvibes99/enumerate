import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __ANTHROPIC_API_KEY__: JSON.stringify(process.env.ANTHROPIC_API_KEY ?? ""),
  },
});
