import { Context, Next } from 'jsr:@oak/oak';

export default function routeStaticFileFrom(staticPaths: string[]) {
  return async (context: Context, next: Next) => {
    for (const staticPath of staticPaths) {
      try {
        await context.send({
          root: staticPath,
          index: "index.html",
          // fallback: "404.html"
        });
      } catch {
        continue;
        // console.error(`Error serving static file from ${staticPath}:`, error);
      }
    }
    await next();
  };
}
