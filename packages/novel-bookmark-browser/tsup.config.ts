import { defineConfig } from "tsup";

export default defineConfig({
  target: "es2020",
  entry: ["src/index.ts"],
  format: ["esm"],
  outDir: "dist",
  minify: false,
});
