import { create, verify, decode  } from 'https://deno.land/x/djwt@v1.9/mod.ts';

// const jwt = await create({ alg: "HS512", typ: "JWT" }, { foo: "bar" }, "secret")

// console.log(jwt);

// const payload = await verify(jwt, 'secret', "HS512");
// console.log(payload);

// const { payload: p, signature, header } = await decode(jwt);
// console.log(p, signature, header);

export default {
    async generate(payload: any): string {
        const header = { alg: "HS512", typ: "JWT" };
        const secret = "king";
        let jwt = await create(header, payload, secret);
        console.log(jwt, payload);
        return jwt
    },
    async validate(token: string) {
        console.log(token, "token");
        let  payload;
        // try {
            payload =  await verify(token, 'king', "HS512");
        // } catch (error) {
            // console.log(error);
            
        // }
    
        console.log(payload, "payload");
        
        return  payload;
       
    }
}