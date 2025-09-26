import { Application, Router } from '@oak/oak';
import { oakCors } from '@tajpouria/cors';
import routeStaticFileFrom from './util/routeStaticFilesFrom.ts';
import data from './data.json' with { type: "json" };

export const app = new Application();
const router = new Router();

router.get('/api/dinosaurs', (context: any) => {
  context.response.body = data;
});

router.get('/api/dinosaurs/:dinosaur', (context: any) => {
  const dinosaur = context.params?.dinosaur;
  if (!dinosaur) {
    context.response.status = 400;
    context.response.body = { message: 'Dinosaur name is required' };
    return;
  }
  const foundDinosaur = data.find(d => d.name.toLowerCase() === dinosaur.toLowerCase());
  if (foundDinosaur) {
    context.response.body = foundDinosaur;
  } else {
    context.response.status = 404;
    context.response.body = { message: 'Dinosaur not found' };
  }
});

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

app.use(routeStaticFileFrom([
  `${Deno.cwd()}/dist`,
  `${Deno.cwd()}/public`
]));

if (import.meta.main) {
  const PORT = Deno.env.get('PORT') || 8000;
  console.log(`Server is running on http://localhost:${PORT}`);
  await app.listen({ port: +PORT });
}