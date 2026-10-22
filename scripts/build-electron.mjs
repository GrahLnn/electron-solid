import { mkdir, rm, writeFile } from "node:fs/promises";

await rm("dist-electron", { recursive: true, force: true });
await mkdir("dist-electron", { recursive: true });

const typeScript = Bun.spawn([process.execPath, "x", "tsc", "-p", "electron/tsconfig.json"], {
  stdio: ["inherit", "inherit", "inherit"],
});
const exitCode = await typeScript.exited;

if (exitCode !== 0) {
  process.exit(exitCode);
}

await writeFile("dist-electron/package.json", '{"type":"commonjs"}\n');
