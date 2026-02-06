import { App, staticFiles } from "fresh";
import { define, type State } from "./utils.ts";

export const app = new App<State>();

app.use(staticFiles());

const loggerMiddleware = define.middleware((ctx) => {
  console.log(`log: ${ctx.req.method} ${ctx.req.url}`);
  return ctx.next();
});

app.use(async (ctx) => {
  ctx.state.shared = "hello";
  return await ctx.next();
});

/* app.get('/', (ctx) => {
  console.dir(ctx.config, { depth: null });
  return new Response("home");
}); */

app.get("/api2/:name", loggerMiddleware, (ctx) => {
  const name = ctx.params.name;
  return new Response(
    `Hello, ${
      name.charAt(0).toUpperCase() + name.slice(1)
    }! ${ctx.state.shared}`,
  );
});

app.get("/test", async (ctx) => {
  const mod = await import("./test.ts");
  return mod.default;
}, (ctx) => {
  return new Response("test");
});

const exampleLoggerMiddleware = define.middleware((ctx) => {
  console.log(`${ctx.req.method} ${ctx.req.url}`);
  return ctx.next();
});
app.use(exampleLoggerMiddleware);

const handler = app.handler();
const response = await handler(new Request("http://localhost:8080/test"));
console.log("handler response", response);

app.fsRoutes();
app.listen({ port: 8082 });
