import { greet } from "./greet.ts";

Deno.test("greet function", () => {
  const name = "Alice";
  const expectedGreeting = `Hello, ${name}!`;
  const actualGreeting = greet(name);

  if (actualGreeting !== expectedGreeting) {
    throw new Error(`Expected "${expectedGreeting}", but got "${actualGreeting}"`);
  }
}
);