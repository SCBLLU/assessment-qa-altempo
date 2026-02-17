import { defineConfig } from "@playwright/test";

export default defineConfig({
  // Tiempo límite para cada test (30 segundos)
  timeout: 30 * 1000,

  use: {
    // Ejecutar
    headless: true,
    // Tamaño de pantalla estándar
    viewport: { width: 1280, height: 720 },
    // Ignorar errores de certificado SSL si los hubiera
    ignoreHTTPSErrors: true,
    // Graba video si falla
    video: "on-first-retry",
    // Genera un archivo de rastreo si falla
    trace: "retain-on-failure",
    // Toma una foto exacta del error
    screenshot: "only-on-failure",
  },
});
