import { defineConfig } from "@rsbuild/core";
import { pluginSolid } from "@rsbuild/plugin-solid";
import { pluginTailwindcss } from "@rsbuild/plugin-tailwindcss";

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [pluginSolid(), pluginTailwindcss()],
  output: {
    assetPrefix: "auto",
  },
  server: {
    host: "127.0.0.1",
    port: 3000,
    strictPort: true,
    open: false,
  },
});
