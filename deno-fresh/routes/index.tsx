import { useSignal } from "@preact/signals";
import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import Counter from "../islands/Counter.tsx";
import data from "./api/data.json" with { type: "json" };
import { Button } from "../components/Button.tsx";

export default define.page(function Home(ctx) {
  const count = useSignal(3);

  console.log("Shared value " + ctx.state.shared);

  return (
    <div className="px-4 py-8 mx-auto fresh-gradient min-h-screen">
      <Head>
        <title>Fresh counter</title>
      </Head>
      {/* <Counter count={count} /> */}
      <div className="dinosaur-list">
        {data.map((dinosaur) => (
          <div key={dinosaur.name} className="dinosaur-card flex flex-row">
            <Button href={`/dinosaurs/${dinosaur.name.toLowerCase()}`}>
              {dinosaur.name}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
});

import type { ComponentChildren } from "preact";
export interface ButtonProps {
  id?: string;
  href?: string;
  class?: string;
  onClick?: () => void;
  children?: ComponentChildren;
  disabled?: boolean;
}

export function Button({ class: className, ...props }: ButtonProps) {
  return (
    <a
      {...props}
      className={`inline-block  px-2 m-2 py-1 border-gray-500 border-2 rounded-sm bg-white hover:bg-gray-200 transition-colors ${
        className ?? ""
      }`}
    />
  );
}
