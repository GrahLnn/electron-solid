import { mkdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

// Storybook also installs a tsc binary; use the declared compiler's own entry.
const typeScriptPackageUrl = import.meta.resolve("typescript/package.json");
const { bin } = await Bun.file(new URL(typeScriptPackageUrl)).json();
const typeScriptCli = fileURLToPath(new URL(bin.tsc, typeScriptPackageUrl));

await rm("dist-electron", { recursive: true, force: true });
await mkdir("dist-electron", { recursive: true });

const typeScript = Bun.spawn([process.execPath, typeScriptCli, "-p", "electron/tsconfig.json"], {
  stdio: ["inherit", "inherit", "inherit"],
});
const exitCode = await typeScript.exited;

if (exitCode !== 0) {
  process.exit(exitCode);
}

await writeFile("dist-electron/package.json", '{"type":"commonjs"}\n');
