const command = new Deno.Command(Deno.execPath(), {
  args: ["eval", "console.log('hello world')"],
  stdin: "piped",
  stdout: "piped",
});

const child = command.spawn();

child.stdout.pipeTo(
  Deno.openSync("output", { write: true, create: true }).writable,
);

child.stdin.close();
const status = await child.status;
console.log(status);
