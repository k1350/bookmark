import { defineConfig } from "tsup";

export default defineConfig({
  target: "es2020",
  entry: [
    "src/initializeButtonAndListPage.ts",
    "src/initializeButtonOnlyPage.ts",
    "src/initializeListOnlyPage.ts",
  ],
  format: ["esm"],
  outDir: "dist/js",
  minify: false,
  splitting: false,
});
