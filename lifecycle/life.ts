import "./imported.ts";

const handler = (e: Event) => {
  console.log(`got ${e.type} event in event handler {main}`);
};

globalThis.addEventListener("load", handler);
globalThis.addEventListener("beforeunload", handler);
globalThis.addEventListener("unload", handler);

globalThis.onload = (e: Event) => {
  console.log(`got ${e.type} event in onload function {main}`);
};

globalThis.onbeforeunload = (e: Event) => {
  console.log(`got ${e.type} event in beforeunload function {main}`);
};

globalThis.onunload = (e: Event) => {
  console.log(`got ${e.type} event in onunload function {main}`);
};

console.log("log from the life.ts");
