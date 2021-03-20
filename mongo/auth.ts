import db from './database.ts';
import validation from './validation.ts';
import { ObjectId } from "https://deno.land/x/mongo@v0.13.0/mod.ts";
import hash from './util/hash.ts';
import token from './util/token.ts';

const usersCollection = await db.collection("users");

export default {
   async login(ctx: any) {
       // validation
       let result = await validation.validateLogin(ctx);
       if(!result) {
           ctx.response.status = 422;
           ctx.response.body = { error: "Please provide required data" };
           return;
       }
       
       // fetch user
        const user = await usersCollection.findOne({ email: result.email})
        if(!user) {
            ctx.response.status =422; 
            ctx.response.body = { error: "Credential donsn't match out record" };
            return;
        }

        // varify password
        let pwdMatched = await hash.verify(user.pwd, result.pwd);
        if(!pwdMatched) {
            ctx.response.body = { error: "Password is incorrect" }; 
            return;
        }
        
        ctx.status = 200;
        ctx.response.body = await token.generate(user.pwd);
    }
}