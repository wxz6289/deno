import { TextLineStream } from "@std/streams";
import { toTransformStream } from "@std/streams/to-transform-stream";

const res = await fetch("https://deno.com");

if (res.body) {
  const lines = res.body
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream())
    .pipeThrough(toTransformStream(async function* (src) {
      for await (const line of src) {
        if (line.trim() === "") continue;
        console.log(line);
        yield line;
      }
    }));
  const reader = lines.getReader();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    console.log("Received line:", value);
  }
} else {
  console.log("No response body");
}