import {
  create,
  decode,
  getNumericDate,
  verify,
} from "https://deno.land/x/djwt@v1.9/mod.ts";

// const jwt = await create({ alg: "HS512", typ: "JWT" }, { foo: "bar" }, "secret")

// console.log(jwt, typeof jwt);
// let jwt2 = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.IiQyYSQxMCQ5QXYvanVxUS5Ib0pQVENsOWwwaTAuVnB5UGtrNjZVamxYMzMyYzVmb1UwZHJMS0hNVC9wUyI.9Ufm4DpVh7jzzLIj4XYh2Vcte0ygUnJlCKThND-gWfuEk56ER_W7TftNUr304wUcYhpb0HNgmyqyiu0kGmdDJA"
// // let j = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIifQ.WePl7achkd0oGNB8XRF_LJwxlyiPZqpdNgdKpDboAjSTsWq-aOGNynTp8TOv8KjonFym8vwFwppXOLoLXbkIaQ"
// const payload = await verify(jwt2, 'king', "HS512");
// console.log(payload);

// const { payload: p, signature, header } = await decode(jwt);
// console.log(p, signature, header);

export default {
  async generate(uid: string): string {
    const header = { alg: "HS512", typ: "JWT" };
    const payload = {
      uid,
      exp: getNumericDate(new Date("2020-11-19 23:50:00")),
    };
    const secret = "king";
    let jwt = await create(header, payload, secret);
    console.log(jwt, payload);
    return jwt;
  },
  async validate(token: string, key: string) {
    console.log(token, "token12");
    let { payload } = await decode(token);
    console.log(payload, "t");

    // let payload =  await verify(token,  key, "HS512");
    // console.log(payload, "payload");
    return payload;
  },
  async fetchUserId(token) {
    const { payload } = await decode(token);
    return payload;
  },
};
