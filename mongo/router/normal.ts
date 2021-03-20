import { Router } from 'https://deno.land/x/oak/mod.ts';
import user from '../user.ts';
import auth from '../auth.ts';

const router = new Router();
router.get('/user', user.index)
      .get('/user/:id', user.show)
      .post('/user', user.store)
      .put("/user/:id", user.update)
      .delete('/user/:id', user.destory) 
      .post("/login", auth.login) 
    // .get('/api/v1/products/:id', getProduct)
    // .post('/api/v1/products', addProduct)
    // .put('/api/v1/products/:id', updateProduct)
    // .delete('/api/v1/products/:id', deleteProduct)
    // .get('/test', test.user)
    // .post('/test', test.user)

export default router;