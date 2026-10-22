import { cn } from "cn";
import { createSignal, onSettled, Show } from "solid-js";
import type { JSX } from "@solidjs/web";
import type { WindowState } from "../electron/window-state";
import electronIcon from "./assets/electron-icon.png";
import { windowGlassClassName } from "./window-glass";

const dragRegion = "ink-app-region-drag [app-region:drag] [-webkit-app-region:drag]";
const controlRegion =
  "ink-app-region-no-drag [app-region:no-drag] [-webkit-app-region:no-drag] select-none";

type WindowControlProps = {
  label: string;
  onClick: () => void;
  children: JSX.Element;
  focused: boolean;
  close?: boolean;
};

function WindowControl(props: WindowControlProps) {
  return (
    <div
      class={cn(!props.focused && "opacity-30 hover:opacity-100", "transition-all duration-300")}
    >
      <button
        type="button"
        aria-label={props.label}
        title={props.label}
        class={cn(
          "h-8 w-11.5 flex items-center justify-center",
          "opacity-60 hover:opacity-100",
          "text-[#090909] dark:text-[#f6f6f6] transition-all pointer-events-auto",
          controlRegion,
          props.close
            ? "hover:bg-(--hover-bg-color) hover:text-(--hover-text-color)"
            : "hover:bg-black/5 dark:hover:bg-white/5",
        )}
        style={
          props.close
            ? { "--hover-bg-color": "#e81123", "--hover-text-color": "#f0f0f0" }
            : undefined
        }
        onClick={() => props.onClick()}
      >
        {props.children}
      </button>
    </div>
  );
}

function MinimizeIcon() {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 18 18">
      <g
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        stroke="currentColor"
      >
        <line x1="3.25" y1="9" x2="14.75" y2="9" />
      </g>
    </svg>
  );
}

function MaximizeIcon(props: { maximized: boolean }) {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 18 18">
      <g
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        stroke="currentColor"
      >
        <Show
          when={props.maximized}
          fallback={<rect x="2.75" y="2.75" width="12.5" height="12.5" rx="2" ry="2" />}
        >
          <rect x="2.75" y="4.75" width="10" height="10" rx="2" ry="2" />
          <path d="M15.25 11.25v-5a4 4 0 0 0-4-4h-5" />
        </Show>
      </g>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18">
      <g
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        stroke="currentColor"
      >
        <line x1="14" y1="4" x2="4" y2="14" />
        <line x1="4" y1="4" x2="14" y2="14" />
      </g>
    </svg>
  );
}

export default function Topbar() {
  const [state, setState] = createSignal<WindowState>({ focused: true, maximized: false });

  onSettled(() => window.electronAPI?.onWindowState(setState));

  const minimize = () => void window.electronAPI?.minimize();
  const toggleMaximize = () => void window.electronAPI?.toggleMaximize();
  const close = () => void window.electronAPI?.close();

  return (
    <header
      class={cn("flex flex-none relative w-full h-8 z-[100] select-none", windowGlassClassName)}
      data-ink-topbar="true"
    >
      <div
        class={cn(
          "grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] w-full h-full",
          !state().focused && "opacity-30",
          "transition duration-300 ease-in-out",
        )}
      >
        <div class={cn("flex min-w-0 justify-start pl-1")} data-ink-topbar-left="true">
          <div class={cn("flex h-full shrink-0 items-center px-1", dragRegion)}>
            <img
              src={electronIcon}
              alt="Electron"
              class={cn("size-4 shrink-0")}
              draggable={false}
            />
          </div>
          <div class={cn("h-full flex-1", dragRegion)} />
        </div>

        <div class={cn("flex min-w-0 justify-center", dragRegion)} data-ink-topbar-middle="true" />

        <div class={cn("flex justify-end")} data-ink-topbar-right="true">
          <div class={cn("h-full flex-1", dragRegion)} />
          <div
            class={cn(controlRegion, "flex items-center z-9999 relative transition duration-300")}
            data-ink-window-controls="windows"
          >
            <WindowControl label="Minimize" onClick={minimize} focused={state().focused}>
              <MinimizeIcon />
            </WindowControl>
            <WindowControl
              label={state().maximized ? "Restore" : "Maximize"}
              onClick={toggleMaximize}
              focused={state().focused}
            >
              <MaximizeIcon maximized={state().maximized} />
            </WindowControl>
            <WindowControl label="Close" onClick={close} focused={state().focused} close>
              <CloseIcon />
            </WindowControl>
          </div>
        </div>
      </div>
    </header>
  );
}
