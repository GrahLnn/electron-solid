import { cn } from "cn";

export const windowGlassClassName = cn(
  "before:content-[''] before:absolute before:inset-0 before:-z-10",
  "before:bg-gradient-to-b before:from-[var(--app-bg)] before:to-[var(--app-bg)]/60",
  "before:transition-colors before:duration-500 before:ease-in-out",
  "after:content-[''] after:absolute after:inset-0 after:-z-10",
  "after:backdrop-blur-[16px] after:opacity-100 after:origin-top",
  "after:bg-gradient-to-b after:from-transparent after:via-transparent after:to-white/0",
  "after:mask-image-[linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,0)_100%)]",
  "after:transition-colors after:duration-500 after:ease-in-out",
);
