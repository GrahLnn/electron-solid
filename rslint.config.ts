import { defineConfig, globalIgnores, js, ts } from "@rslint/core";

export default defineConfig([
  globalIgnores(["dist/**", "dist-electron/**"]),
  js.configs.recommended,
  ts.configs.recommended,
]);
