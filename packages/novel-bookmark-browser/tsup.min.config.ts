import { defineConfig } from "tsup";

export default defineConfig({
  target: "es2020",
  entry: {
    "index.min": "src/index.ts",
  },
  format: ["esm"],
  outDir: "dist",
  minify: true,
});
