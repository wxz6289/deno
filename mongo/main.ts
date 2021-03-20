import { config } from 'https://deno.land/x/dotenv/mod.ts';
import { Application } from 'https://deno.land/x/oak/mod.ts';
const env = config();

import router from './router/normal.ts';
import prouter from './router/protected.ts'
import notFund from '../rest-api/404.ts';
import authorizeMiddleware from './middleware/authorize.ts'
const app = new Application();
app.use(router.routes());
app.use( (ctx, next) => authorizeMiddleware.authorized(ctx, next));
app.use(prouter.routes())
app.use(router.allowedMethods());
app.use(notFund);
console.log(`Server runing on port ${env.PORT}`)
await app.listen({port: +env.PORT})