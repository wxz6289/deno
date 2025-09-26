self.addEventListener('message', async (event) => {
  const { filename } = event.data;
  const text = await Deno.readTextFile(filename);
  self.postMessage({ text });
  self.close();
});
