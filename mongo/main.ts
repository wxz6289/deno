import { config } from 'https://deno.land/x/dotenv/mod.ts';
import { Application } from 'https://deno.land/x/oak/mod.ts';
const env = config();

import router from './router.ts';
import notFund from '../rest-api/404.ts';
import authorizeMiddleware from './authorizeMiddleware.ts'
const app = new Application();
app.use(router.routes());
app.use(authorizeMiddleware.authorized);
app.use((ctx:any) => {
    ctx.response.body = "protected routes";
})
app.use(router.allowedMethods());
app.use(notFund);
console.log(`Server runing on port ${env.PORT}`)
await app.listen({port: +env.PORT})