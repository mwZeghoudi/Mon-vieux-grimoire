const express = require("express");
require("dotenv").config({ path: "./config/.env" });
require("./config/db");

const app = express();

app.listen(process.env.PORT, () => {
  console.log(`ca marche ${process.env.PORT}`);
});