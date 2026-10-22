import type { WindowState } from "../electron/window-state";

declare global {
  interface Window {
    electronAPI: {
      platform: string;
      electronVersion: string;
      minimize: () => Promise<void>;
      toggleMaximize: () => Promise<void>;
      close: () => Promise<void>;
      onWindowState: (callback: (state: WindowState) => void) => () => void;
    };
  }
}
