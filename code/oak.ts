import { Application } from "@oak/oak";
import { Router } from "@oak/oak/router";

const router = new Router();
router.get("/", (context) => {
  context.response.body = "Hello from Oak on Deno!";
});

router.post('/svg', async (context) => {
  try {
    const stream = context.request.body({ type: 'stream' }).value;
    const file = await Deno.open("uploaded_logo.svg", { write: true, create: true, truncate: true });
    await stream.pipeTo(file.writable);
    file.close();
    context.response.status = 200;
    context.response.body = { message: 'SVG received and saved as uploaded_logo.svg' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error handling /svg POST request:", error);
    context.response.status = 500;
    context.response.body = { message: 'Failed to process SVG upload', error: errorMessage };
  }
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
console.log(`server is running on http://localhost:8000`);
app.listen({ port: 8000 });