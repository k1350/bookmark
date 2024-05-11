import { defineConfig } from "tsup";

export default defineConfig({
  target: "es2020",
  entry: ["src", "!src/**/*.test.*"],
  format: ["esm"],
  clean: true,
  sourcemap: true,
});
