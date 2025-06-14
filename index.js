const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello, Suggesto Server is running!");
});

app.listen(port, () => {
  console.log(`Suggesto Server is running on http://localhost:${port}`);
});
