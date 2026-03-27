import express, { type Express } from "express";

const PORT = process.env.PORT || 8000;
const app: Express = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
