import { defineConfig } from "@playwright/test";

export default defineConfig({
  timeout: 60 * 1000, 
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,

    // Guardar evidencia siempre que falle
    video: "retain-on-failure",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  reporter: [["html", { open: "always" }]],
});