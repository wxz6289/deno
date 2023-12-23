import { MongoClient } from "https://deno.land/x/mongo@v0.13.0/mod.ts";

const client = new MongoClient();
client.connectWithUri("mongodb://47.114.162.228:27017");

const db = client.database("deno");
export default db;
