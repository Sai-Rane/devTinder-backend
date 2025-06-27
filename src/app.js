const express = require("express");

const app = express(); //instance of express js application

//the below function is known as the request handler for "/user"
app.get("/user", (req, res) => {
  res.send({
    firstName: "John",
    lastName: "Doe",
  });
});

app.post("/user", (req, res) => {
  res.send("User created");
});

app.delete("/user", (req, res) => {
  res.send("User deleted");
});

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
