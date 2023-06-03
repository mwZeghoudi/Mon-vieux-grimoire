const mongoose = require("mongoose");
require("dotenv").config({ path: "./config/.env" });

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PW}@mvg.insgtmy.mongodb.net/mon-vieux-grimoire`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("Failed to connect to DB " + err));
