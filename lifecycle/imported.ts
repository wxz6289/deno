const handler = (e: Event) => {
  console.log(`got ${e.type} event in event handler {imported}`);
};

globalThis.addEventListener("load", handler);
globalThis.addEventListener("beforeunload", handler);
globalThis.addEventListener("unload", handler);

globalThis.onload = (e: Event) => {
  console.log(`got ${e.type} event in onload function {imported}`);
};

globalThis.onbeforeunload = (e: Event) => {
  console.log(`got ${e.type} event in beforeunload function {imported}`);
};

globalThis.onunload = (e: Event) => {
  console.log(`got ${e.type} event in onunload function {imported}`);
};

console.log("log from the imported");

/*
Listeners for load events can be asynchronous and will be awaited. Listeners for unload events need to be synchronous. Both events cannot be cancelled.

All listeners added using window.addEventListener were run, but window.onload and window.onunload defined in main.ts overrode handlers defined in imported.ts.

In other words, you can register multiple window.addEventListener "load" or "unload" events, but only the last loaded window.onload or window.onunload event handlers will be executed. It is preferable to use addEventListener when possible for this reason.

*/
