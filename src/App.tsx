import "./App.css";
import { cn } from "cn";
import Topbar from "./topbar";

const App = () => {
  return (
    <main class={cn("flex h-full min-h-0 flex-col")}>
      <Topbar />
      <section
        class={cn("flex min-h-0 flex-1 flex-col items-center justify-center gap-3 p-8 text-center")}
      >
        <h1 class={cn("m-0 text-5xl font-bold tracking-[-0.04em]")}>Rsbuild with Solid</h1>
        <p class={cn("m-0 text-lg opacity-50")}>Start building amazing things with Rsbuild.</p>
      </section>
    </main>
  );
};

export default App;
