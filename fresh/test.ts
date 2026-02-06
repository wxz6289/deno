
const loggerMiddleware = async (ctx) => {
  console.log(`Test log: ${ctx.req.method} ${ctx.req.url}`);
  return await ctx.next();
};

export default loggerMiddleware;