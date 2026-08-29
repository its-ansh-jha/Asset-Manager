import path from "path";
import { cp, mkdir } from "node:fs/promises";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const rawPort = process.env.PORT ?? "5173";
const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) throw new Error(`Invalid PORT value: "${rawPort}"`);
const basePath = process.env.BASE_PATH ?? "/";

const copyRepositoryOutput = (): Plugin => ({
  name: "copy-repository-output",
  async closeBundle() {
    const appOutput = path.resolve(import.meta.dirname, "public");
    const repositoryOutput = path.resolve(import.meta.dirname, "../../public");
    await mkdir(repositoryOutput, { recursive: true });
    await cp(appOutput, repositoryOutput, { recursive: true });
  },
});

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    copyRepositoryOutput(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) => m.cartographer({ root: path.resolve(import.meta.dirname, "..") })),
          await import("@replit/vite-plugin-dev-banner").then((m) => m.devBanner()),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  publicDir: false,
  build: {
    outDir: path.resolve(import.meta.dirname, "public"),
    emptyOutDir: false,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    proxy: { "/api": process.env.API_URL || "http://localhost:4000" },
    allowedHosts: true,
    fs: { strict: true },
  },
  preview: { port, host: "0.0.0.0", allowedHosts: true },
});
