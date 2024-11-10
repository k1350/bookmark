import { defineConfig } from "tsup";

export default defineConfig({
  target: "es2020",
  entry: {
    "initializeButtonAndListPage.min": "src/initializeButtonAndListPage.ts",
    "initializeButtonOnlyPage.min": "src/initializeButtonOnlyPage.ts",
    "initializeListOnlyPage.min": "src/initializeListOnlyPage.ts",
    "inner/index.min": "src/inner/index.ts",
  },
  format: ["esm"],
  outDir: "dist/js",
  minify: true,
  splitting: false,
});
