import { Router} from 'https://deno.land/x/oak/mod.ts';
import { ObjectId } from "https://deno.land/x/mongo@v0.13.0/mod.ts";
import token from '../util/token.ts';
import db from '../database.ts';
const usersCollection = await db.collection("users");
const prouters = new Router();

prouters.get('/me', (ctx: any) => {
     const authorization = ctx.request.headers.get('authorization');
     const headerToken = authorization.replace("Bearer ", '').trim();
    const payload = token.fetchUserId(headerToken);
    if(payload) {
        const uid = payload.uid;
        const user = usersCollection.findOne({_id: ObjectId(uid)});
        ctx.response.body = user;
    }
});


export default prouters;