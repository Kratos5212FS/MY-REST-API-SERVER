const cards = require("./routes/cards");
const auth = require("./routes/auth");
const users = require("./routes/users");
const express = require("express");
const app = express();
const http = require("http").Server(app);
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/my_rest_api", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to the MongoDB !!!"))
  .catch((err) => console.log("Could not connect to the DB", err));
app.use(express.json());
app.use("/api/users", users);
app.use("./api/auth", auth);
app.use("/api/cards", cards);

const port = process.env.PORT || 3000;
http.listen(port, () =>
  console.log(`Listening to port ${port}, click http://localhost:${port}`)
);
