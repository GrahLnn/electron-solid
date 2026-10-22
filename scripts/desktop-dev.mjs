import electronBinary from "electron";
import { createRsbuild, loadConfig } from "@rsbuild/core";
import { spawn } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const bun = process.execPath;
const port = Number(process.env.INKA_DEV_SERVER_PORT ?? 3000);
const cdpPort = Number(process.env.INKA_CDP_PORT ?? 9222);
const electronEntry = path.join(root, "dist-electron", "main.js");

function run(command, args, options = {}) {
  return spawn(command, args, {
    cwd: root,
    stdio: "inherit",
    ...options,
  });
}

function waitForExit(child) {
  return new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("exit", (code, signal) => resolve({ code, signal }));
  });
}

let server;
let electron;
let shuttingDown = false;

async function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  if (electron && electron.exitCode === null) electron.kill();
  await server?.close();
  process.exit(exitCode);
}

process.once("SIGINT", () => void shutdown(0));
process.once("SIGTERM", () => void shutdown(0));

try {
  const buildResult = await waitForExit(run(bun, ["scripts/build-electron.mjs"]));
  if (buildResult.code !== 0) {
    await shutdown(buildResult.code ?? 1);
  }

  const { content } = await loadConfig({ command: "dev" });
  const rsbuild = await createRsbuild({
    rsbuildConfig: {
      ...content,
      mode: "development",
      server: { ...content.server, host: "127.0.0.1", port, strictPort: true, open: false },
    },
  });
  const started = await rsbuild.startDevServer();
  server = started.server;

  electron = run(electronBinary, [`--remote-debugging-port=${cdpPort}`, electronEntry], {
    env: {
      ...process.env,
      INKA_DEV_SERVER_URL: started.urls[0],
    },
  });
  const electronResult = await waitForExit(electron);
  await shutdown(electronResult.code ?? 0);
} catch (error) {
  console.error(error);
  await shutdown(1);
}
