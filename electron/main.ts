import { app, BrowserWindow, ipcMain } from "electron";
import type { IpcMainEvent, IpcMainInvokeEvent } from "electron";
import path from "node:path";
import type { WindowState } from "./window-state";

const developmentUrl = process.env.INKA_DEV_SERVER_URL;
let mainWindow: BrowserWindow | null = null;

app.enableSandbox();

function getOwnedWindow(event: IpcMainEvent | IpcMainInvokeEvent): BrowserWindow | null {
  const window = BrowserWindow.fromWebContents(event.sender);
  return window === mainWindow && event.senderFrame === window?.webContents.mainFrame
    ? window
    : null;
}

function publishWindowState(window: BrowserWindow): void {
  const state: WindowState = {
    focused: window.isFocused(),
    maximized: window.isMaximized(),
  };
  window.webContents.send("window:state", state);
}

ipcMain.handle("window:minimize", (event) => {
  getOwnedWindow(event)?.minimize();
});

ipcMain.handle("window:toggle-maximize", (event) => {
  const window = getOwnedWindow(event);
  if (!window) return;

  if (window.isMaximized()) {
    window.unmaximize();
  } else {
    window.maximize();
  }
});

ipcMain.on("window:observe", (event) => {
  const window = getOwnedWindow(event);
  if (window) publishWindowState(window);
});

ipcMain.handle("window:close", (event) => {
  getOwnedWindow(event)?.close();
});

function isAllowedNavigation(url: string): boolean {
  if (developmentUrl) {
    return url.startsWith(developmentUrl);
  }

  return url.startsWith("file://");
}

function createWindow(): void {
  const window = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: false,
    frame: false,
    backgroundColor: "#f5f8fa",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  mainWindow = window;
  window.removeMenu();

  window.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  window.webContents.on("will-navigate", (event, url) => {
    if (!isAllowedNavigation(url)) {
      event.preventDefault();
    }
  });
  const publish = () => publishWindowState(window);
  window.on("maximize", publish);
  window.on("unmaximize", publish);
  window.on("focus", publish);
  window.on("blur", publish);
  window.once("ready-to-show", () => window.show());
  window.on("closed", () => {
    mainWindow = null;
  });

  const loadPromise = developmentUrl
    ? window.loadURL(developmentUrl)
    : window.loadFile(path.join(__dirname, "..", "dist", "index.html"));
  void loadPromise.catch((error: unknown) => {
    console.error("Failed to load the renderer:", error);
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
