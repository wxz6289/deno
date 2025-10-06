const home = Deno.env.get("HOME") || "Unknown";
console.log(`Home directory: ${home}`);

export {};
