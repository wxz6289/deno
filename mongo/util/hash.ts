import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";

export default {
  async bcrypt(str2hash: string) {
    const hash = await bcrypt.hash(str2hash);
    return hash;
  },
  async verify(hash: string, text: string) {
    console.log(hash, text, "verify");

    const result = await bcrypt.compare(text, hash);

    return result;
  },
};
