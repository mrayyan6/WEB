const express = require("express");
const x = require("./routes/users");
const app = express();

app.use("/users", x);

app.listen(3000, () => {
  console.log("Running on http://localhost:3000/users/Rayyan");
});