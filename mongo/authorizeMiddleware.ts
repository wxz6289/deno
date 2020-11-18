import token from './util/token.ts'

export default {
    async authorized( ctx:any, next) {
        const authorization = ctx.request.headers.get('authorization');
        if(!authorization) {
            await next();
            return
        }
        const headerToken = authorization.replace("Bearer ", '');
        console.log(headerToken, "headerToken");
        
        const isTokenValidate = await token.validate(headerToken);
        console.log(authorization, headerToken, isTokenValidate);
        if(!isTokenValidate) {
            ctx.response.status = 401;
            ctx.response.body = { error: "Unauthorized"};
            return;
        }
        await next();
    }
} 