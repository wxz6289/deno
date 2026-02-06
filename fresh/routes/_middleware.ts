import { define } from "../utils";

export const loggerMiddleware1 = define.middleware(async (ctx) => {
  console.log(`middleware1 log: ${ctx.req.method} ${ctx.req.url}`);
  return await ctx.next();
});

export const loggerMiddleware2 = define.middleware(async (ctx) => {
  console.log(`middleware2 log: ${ctx.req.method} ${ctx.req.url}`);
  return await ctx.next();
});

export default [loggerMiddleware1, loggerMiddleware2];