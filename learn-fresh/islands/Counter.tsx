import type { Signal } from "@preact/signals";
import { Button } from "../components/Button.tsx";

interface CounterProps {
  count: Signal<number>;
}

export default function Counter(props: CounterProps) {
  return (
    <div class="flex gap-4 items-center py-4">
      <Button
        onClick={() => props.count.value -= 1}
        class="bg-gray-200 hover:bg-gray-300"
      >
        -
      </Button>
      <p class="text-3xl tabular-nums font-medium">{props.count.value}</p>
      <Button
        onClick={() => props.count.value += 1}
        class="bg-indigo-600 text-white hover:bg-indigo-700"
      >
        +
      </Button>
    </div>
  );
}
