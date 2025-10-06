let count = 0;
globalThis.addEventListener("beforeunload", (e: Event) => {
  count++;
  console.log(`got ${e.type} event in event handler {beforeunload.ts} count=${count}`);
});

globalThis.onbeforeunload = (e: Event) => {
  count++;
  console.log(`got ${e.type} event in onbeforeunload function {beforeunload.ts} count=${count}`);
};

globalThis.addEventListener("unload", (e: Event) => {
  console.log(`got ${e.type} event in event handler {beforeunload.ts} count=${count}`);
});

count++;
