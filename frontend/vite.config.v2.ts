import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      {
        find: "@/app/App",
        replacement: path.resolve(__dirname, "./src/app/AppV2.tsx"),
      },
      {
        find: "@/pages/FraudPage",
        replacement: path.resolve(__dirname, "./src/pages/FraudPageV2.tsx"),
      },
      {
        find: "@/features/loan/loanMetadata",
        replacement: path.resolve(
          __dirname,
          "./src/features/loan/loanMetadataV2.ts",
        ),
      },
      {
        find: "@/features/loan/loanSchema",
        replacement: path.resolve(
          __dirname,
          "./src/features/loan/loanSchemaV2.ts",
        ),
      },
      {
        find: "@",
        replacement: path.resolve(__dirname, "./src"),
      },
    ],
  },
});

