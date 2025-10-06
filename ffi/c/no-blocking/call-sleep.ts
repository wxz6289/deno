const library = Deno.dlopen(
  "./libsleep.so",
  {
    sleep: {
      parameters: ["u32"],
      result: "void",
      nonblocking
    },
  } as const,
);

kibrary