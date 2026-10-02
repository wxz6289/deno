Deno.cron("five minutes", { minute: { every: 1 } }, async () => {
  console.log("cron time");
});