import { Application, Router } from 'https://deno.land/x/oak/mod.ts';
const port = 5000;

const app = new Application();

const router = new Router();

app.use(router.routes());
app.use(router.allowMethods());

router.get('/api/v1/products', ({ response }: { response: any}) => { 
    response.body = "Hello Deno!";
});

