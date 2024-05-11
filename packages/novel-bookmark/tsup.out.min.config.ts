import { defineConfig } from "tsup";

export default defineConfig({
  target: "es2020",
  entry: {
    "index.min": "src/browser/index.ts",
  },
  format: ["esm"],
  outDir: "out",
  minify: true,
});
