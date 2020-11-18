import db from './database.ts';
import validation from './validation.ts';
import { ObjectId } from "https://deno.land/x/mongo@v0.13.0/mod.ts";
import hash from './util/hash.ts';
import token from './util/token.ts'

const usersCollection = await db.collection("users");

export default {
   async login(ctx: any) {
        const { value } = await ctx.request.body();
        let result  = await value;
        console.log(result, "result");
        
        if(result) {
            const user = await usersCollection.findOne({ email: result.email})
            let pwdMatched = false; 
            console.log(user);
            if(!user) {
                ctx.response.body = { error: "Credential donsn't match out record" };
                return;
            }
            pwdMatched = await hash.verify(user.pwd, result.pwd);
            if(pwdMatched) {
                ctx.status = 200;
                ctx.response.body = await token.generate(user.pwd);
            } else {
                ctx.response.body = "failed";
            }
          
            // if(user) {
            //    
            // } else {
            //    
            // }
            
          // const jwt = await token.generate("King")
            // ctx.response.body = pwdMatched;
        }
    }
}