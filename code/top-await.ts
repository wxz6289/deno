try {
  const data = await Deno.readTextFile('./.env');
  console.log('File content:', data);
} catch (error) {
  console.error('Error reading file:', error);
}