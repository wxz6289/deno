import db from './database.ts';
import validation from './validation.ts';
import { ObjectId } from "https://deno.land/x/mongo@v0.13.0/mod.ts";
import hash from './util/hash.ts';

const users = await db.collection("users");

export default {
    async index({ response }) {
        let data = await users.find();
        response.body = data;
    },
    async show({ params, response}) {
        try { 
            const data = await users.findOne({ _id: ObjectId(params.id)});
            response.body = data;
        } catch(e) {
            response.status = 404;
            response.body = {
                error: `Database is't support ${params.id}`
            }
        }
       
    },
    async store(ctx) {
        console.log("fuck");
        
        const insertData = await validation.validate(ctx);
        console.log(insertData, "insertData");
        
        if(insertData){
            insertData.createAt = Number.parseInt((new Date().getTime() / 1000).toString());
            insertData.pwd = await hash.bcrypt(insertData.pwd);
            const result = await users.insertOne(insertData);
            ctx.response.status = 201;
            ctx.response.body = result;
        }

    },
    async update({ request, params, response }) {
        if(!request.hasBody) {
            response.status = 400;
            response.body = { error: "Please provide valid data!"};
            return;
        } 
        const { value } = await request.body();
        const updateValue = await value;
        const result = await users.updateOne({ _id: { $oid: params.id}}, { $set: updateValue});
        response.status = 201;
        response.body = result;
    },
    async destory({ params, response }) {
        try {
            await users.deleteOne({ _id: ObjectId(params.id)});
            response.status = 204;
            response.body = { message: "success"};
        } catch (error) {
            response.status = 404;
            response.body = {
                error: `${params.id} isn't fund`
            }
        }
    }
}