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
    <div className="fresh-gradient min-h-screen py-12">
      <div className="container">
        <Head>
          <title>Fresh counter</title>
        </Head>
        <div className="text-center">
          <h1 className="text-3xl font-semibold">Dinosaur Gallery</h1>
          <p className="text-muted mt-2">
            轻量示例：使用 Fresh 的 islands 架构
          </p>
        </div>

        <div className="mt-6">
          <div className="counter">
            <Counter count={count} />
          </div>
        </div>

        <div className="dinosaur-list">
          {data.map((dinosaur) => (
            <div key={dinosaur.name} className="dinosaur-card">
              <Button
                href={`/dinosaurs/${dinosaur.name.toLowerCase()}`}
                class="bg-indigo-600 text-white hover:bg-indigo-700 btn-block"
              >
                {dinosaur.name}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
