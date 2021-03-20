import token from '../util/token.ts'

export default {
    async authorized( ctx:any, next) {
        const authorization = ctx.request.headers.get('authorization');
        if(!authorization) {
            ctx.response.status = 401;
            ctx.response.body = { error: "Unauthorized"};
            return
        }
        const headerToken = authorization.replace("Bearer ", '').trim();
        console.log(headerToken, "headerToken");
        
        let isTokenValidate =  await token.validate(headerToken, '');
        console.log(">>>>>>>>>>>>>>",authorization, headerToken, isTokenValidate);
        if(!isTokenValidate) {
            ctx.response.status = 401;
            ctx.response.body = { error: "Unauthorized"};
            return;
        }
        await next();
    }
} 