import { IS_BROWSER } from "fresh/runtime";

export default function MyIsland() {
  if (!IS_BROWSER) return <div>Server</div>;
  return <div>Client</div>;
}
