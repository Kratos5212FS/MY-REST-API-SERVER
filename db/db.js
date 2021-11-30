const mongoose = require("mongoose");

const db = mongoose
  .connect("mongodb://127.0.0.1:27017/my-rest-api-hackapella", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB - my-rest-api-hackapella....."))
  .catch((error) => console.log("Could not connect to MongoDB....", error));

module.exports = db;
