/* console.log(Deno.cwd());
Deno.chdir('D:\\learn');
console.log(Deno.cwd()); */

/* const mode = await Deno.chmod('.\\greet.txt', 0o666 );
console.log(mode); */

// const file = await Deno.open("./greet.txt");
// Deno.close(file.rid);

// const conn1 = await Deno.connect({ hostname: "baidu.com", port: 80 });

// const src = await Deno.open('greet.txt');
// const buf = new Deno.Buffer();
// const dst = await Deno.copy(src, Deno.stdout);
// const dst2 = await Deno.copy(src, buf);

/* let file = await Deno.create("./test.txt");
console.log(file); */

/* const file = await Deno.open("./test.txt", { read: true, write: true, create: true });
await Deno.write(file.rid, new TextEncoder().encode("Hello World2"));
// await Deno.fdatasync(file.rid);
console.log(new TextDecoder().decode(await Deno.readFile('./test.txt'))); */

// const obj = {};
// obj.name = "King";
// obj.age = 20;
// const objs = Deno.inspect(obj);
// console.log(objs);

class A {
  x = 10;
  y = "Hi";
  [Symbol.for("Deno.customInspect")](): string {
    return `x=${this.x}, y=${this.y}`;
  }
}

const ins = Deno.inspect(new A());
console.log(ins);
