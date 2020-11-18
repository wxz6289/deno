export default {
    async user(ctx) {
        const { value } = await ctx.request.body();
        let result = await value;
        console.log(result);
        
        ctx.response.body = {
            message: "success"
        }
    }
}