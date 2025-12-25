import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Für GitHub Pages:
// export default defineConfig({ plugins: [react()], base: "/REPO_NAME/" });

export default defineConfig({
  plugins: [react()],
});
