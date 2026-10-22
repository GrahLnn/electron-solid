# Rsbuild project

## Setup

Install the dependencies:

```bash
bun install
```

## Get started

Start the desktop app in development mode. The Rsbuild renderer server listens on `127.0.0.1:3000`, and Electron exposes CDP on port `9222`.

```bash
bun run dev
```

Build the app for production:

```bash
bun run build
```

The production build includes the renderer bundle and the compiled Electron main and preload processes.

Preview the production build locally:

```bash
bun run preview
```

## Learn more

To learn more about Rsbuild, check out the following resources:

- [Rsbuild documentation](https://rsbuild.rs) - explore Rsbuild features and APIs.
- [Rsbuild GitHub repository](https://github.com/web-infra-dev/rsbuild) - your feedback and contributions are welcome!
