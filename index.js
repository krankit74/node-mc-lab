const express = require("express");
const app = express();

app.get("/", (_, res) => {
  res.send(`Hello from Node.js! DB_HOST=${process.env.DB_HOST||"n/a"} DB_PORT=${process.env.DB_PORT||"n/a"}`);
});

app.get("/health", (_, res) => res.status(200).send("ok"));

app.listen(3000, () => console.log("Web listening on :3000"));