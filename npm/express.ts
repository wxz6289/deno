import express from 'npm:express';

const app = express();
app.get('/', (req, res) => {
  res.send("Hello express");
});

app.listen(8000, () => {
  console.log("server runing at localhost:8000");
})