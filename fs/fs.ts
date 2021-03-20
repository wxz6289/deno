// await Deno.mkdir('test/fs', { recursive: true });

// Deno.mkdirSync('test/fs1', { recursive: true });

// 创建临时目录
// const tempDirName0 = await Deno.makeTempDir();
// console.log(tempDirName0);
// const temp = Deno.makeTempDirSync({ prefix: "king_"});
// console.log(temp);

// 删除目录|文件
// await Deno.remove('C:\\Users\\Dreamer\\AppData\\Local\\Temp\\5b2a3d4f')
// Deno.removeSync("C036531 q:\\Users\\Dreamer\\AppData\\Local\\Temp\\king_f10c17ea")

// console.table(Deno.metrics());

for await (const dir of Deno.readDir('./test')) {
    console.log(dir.name)
}