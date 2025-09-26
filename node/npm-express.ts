import express from 'npm:express';

const app = express();
const PORT = process.env.PORT || 8000;

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express on Deno!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});