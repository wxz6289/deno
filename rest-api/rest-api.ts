import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Application } from "https://deno.land/x/oak/mod.ts";
const env = config();

import router from "./routes.ts";
import notFund from "./404.ts";
const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
app.use(notFund);

console.log(`Server runing on port ${env.PORT}`);

await app.listen({ port: +env.PORT });
