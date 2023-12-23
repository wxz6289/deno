/* const filenames = Deno.args;
for (const filename of filenames) {
  const file = await Deno.open(filename);
  await file.readable.pipeTo(Deno.stdout.writable, { preventClose: true });
}
 */

import { copy } from "https://deno.land/std@0.196.0/streams/copy.ts";
const filenames = Deno.args;
for (const filename of filenames) {
  const file = await Deno.open(filename);
  await copy(file, Deno.stdout);
  file.close();
}
