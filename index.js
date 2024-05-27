import express from "express";
const app = express()
import dotenv from "dotenv"
dotenv.config()
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
