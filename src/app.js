const express = require("express");

const app = express(); //instance of express js application

//the below function is known as the request handler for "/user"
app.get("/user", (req, res) => {
  console.log(req.query);
  console.log(req.params);
  res.send({
    firstName: "John",
    lastName: "Doe",
  });
});

// : means its a dynamic route
app.get("/user/:id", (req, res) => {
  console.log(req.params);
  res.send("ab?c");
});

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
