import { Router } from "https://deno.land/x/oak/mod.ts";
import {
  addProduct,
  deleteProduct,
  getProduct,
  getProducts,
  mock,
  updateProduct,
} from "./controllers/product.ts";
import test from "./controllers/test.ts";
const router = new Router();
router.get("/api/v1/products", getProducts)
  .get("/api/v1/products/:id", getProduct)
  // .post('/api/v1/products', mock)
  .post("/api/v1/products", addProduct)
  .put("/api/v1/products/:id", updateProduct)
  .delete("/api/v1/products/:id", deleteProduct)
  .get("/test", test.user)
  .post("/test", test.user);
// router.get('/user', (ctx) => {
//     ctx.response.body = {
//         name: "King",
//         email: "dreaming@gmail.com"
//     }
// })

export default router;
