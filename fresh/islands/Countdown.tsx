import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

interface CountdownProps {
  target: string;
}

export default function Countdown(props?: CountdownProps) {
  const count = useSignal(10);

  useEffect(() => {
    const interval = setInterval(() => {
      count.value--;
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (count.value <= 0) {
    return <div>Time's up!</div>;
  }

  return <div>{count.value}</div>;
}
