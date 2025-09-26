const fileResponse = await fetch("https://deno.com/logo.svg");
if (fileResponse.body) {
  const file = await Deno.open("logo.svg", { write: true, create: true, truncate: true });
  await fileResponse.body.pipeTo(file.writable);
  // file.close();
} else {
  console.log("No response body");
}

const file2 = await Deno.open("logo.svg", { read: true });

await fetch('http://localhost:8000/svg', {
  method: 'POST',
  body: file2.readable,
  headers: {
    'Content-Type': 'image/svg+xml',
  },
});

file2.close();