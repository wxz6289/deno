import { define } from "../utils.ts";
import Countdown from "../islands/Countdown.tsx";

export default define.page(function About() {
  return (
    <main>
      <h1>About</h1>
      <p>This is the about page</p>
      <Countdown target="2025-10-12T12:00:00Z" />
    </main>
  );
});
