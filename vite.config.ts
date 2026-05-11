import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const resolvePath = (value: string, suffix: string) =>
  value.replace(new RegExp(`${suffix}/?$`), "");

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiBase = env.VITE_API_BASE_URL ?? "http://localhost:5009/api";
  const hubUrl =
    env.VITE_SIGNALR_HUB_URL ?? "http://localhost:5009/signalr/device-hub";
  const apiTarget = resolvePath(apiBase, "/api");
  const hubTarget = resolvePath(hubUrl, "/signalr/device-hub");

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@core": path.resolve(__dirname, "src/core"),
        "@infra": path.resolve(__dirname, "src/infrastructure"),
        "@app": path.resolve(__dirname, "src/application"),
        "@ui": path.resolve(__dirname, "src/presentation/design-system"),
        "@pages": path.resolve(__dirname, "src/presentation/pages"),
        "@layouts": path.resolve(__dirname, "src/presentation/layouts"),
        "@shared": path.resolve(__dirname, "src/shared"),
      },
    },
    build: {
      sourcemap: mode === "development",
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: [
              "react",
              "react-dom",
              "react-router",
              "zustand",
              "@tanstack/react-query",
            ],
            recharts: ["recharts"],
            signalr: ["@microsoft/signalr"],
          },
        },
      },
    },
    server: {
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
        },
        "/signalr": {
          target: hubTarget,
          changeOrigin: true,
          ws: true,
        },
      },
    },
  };
});
