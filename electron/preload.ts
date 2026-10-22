import { contextBridge, ipcRenderer } from "electron";
import type { WindowState } from "./window-state";

contextBridge.exposeInMainWorld("electronAPI", {
  platform: process.platform,
  electronVersion: process.versions.electron,
  minimize: () => ipcRenderer.invoke("window:minimize"),
  toggleMaximize: () => ipcRenderer.invoke("window:toggle-maximize"),
  close: () => ipcRenderer.invoke("window:close"),
  onWindowState: (callback: (state: WindowState) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, state: WindowState) => {
      callback(state);
    };
    ipcRenderer.on("window:state", listener);
    ipcRenderer.send("window:observe");
    return () => ipcRenderer.removeListener("window:state", listener);
  },
});
