const worker = new Worker(new URL('./worker.ts', import.meta.url).href, {
  type: 'module',
  deno: {
    permissions: {
      read: [new URL('./.env', import.meta.url)]
    }
  }
});

worker.addEventListener('message', (event) => {
  const { text } = event.data;
  console.log('File content received from worker:');
  console.log(text);
});

worker.postMessage({ filename: './.env' });

const worker2 = new Worker(new URL('./worker.ts', import.meta.url).href, {
  type: 'module',
  deno: {
    permissions: {
      read: [new URL('./api.md', import.meta.url)],
      write: [new URL('./logo.svg', import.meta.url)]
    }
  }
});

worker2.addEventListener('message', (event) => {
  const { text } = event.data;
  console.log('File content received from worker2:');
  console.log(text);
});

worker2.postMessage({ filename: './api.md' });