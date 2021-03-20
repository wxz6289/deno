export default {
   async validate(ctx) {
       let errors = [];
       if(!ctx.request.hasBody){
           ctx.response.status = 400;
           ctx.response.body = {
               error: "Please provide valid data."
           };
           return;
       }
       const { value } = await ctx.request.body();
       const data = await value;
       console.log(data, "value");
       
    //    const data = JSON.parse(originvalue);
       console.log(data, "data");
       
       const fileds = ["name", "pwd", "email", "createAt"];
       for (let index = 0; index < fileds.length; index++) {
          if(!data[fileds[index]]) {
              errors.push({ [fileds[index]]: `${fileds[index]} filed is required`});
          } 
       }
       if(errors.length) {
           ctx.response.status = 422;
           ctx.response.body = { errors };
           return;
       }
       return data;
    },
    async validateLogin(ctx) {
       let errors = [];
       if(!ctx.request.hasBody){
           ctx.response.status = 400;
           ctx.response.body = {
               error: "Please provide valid data."
           };
           return;
       }
       const { value } = await ctx.request.body();
       const data = await value;
       console.log(data, "value");
       
    //    const data = JSON.parse(originvalue);
       console.log(data, "data");
       
       const fileds = ["pwd", "email"];
       for (let index = 0; index < fileds.length; index++) {
          if(!data[fileds[index]]) {
              errors.push({ [fileds[index]]: `${fileds[index]} filed is required`});
          } 
       }
       if(errors.length) {
           ctx.response.status = 422;
           ctx.response.body = { errors };
           return;
       }
       return data;
    }
}