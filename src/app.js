const express = require("express");

const app = express(); //instance of express js application

const { adminAuth, userAuth } = require("./middlewares/auth");

// handle auth middleware for all http requests
// we will use app.use for writing middleware, because anything starting from /admin will go throught this handler. We are writing this middleware fo all requests because i want all my requests to be authorized
app.use("/admin", adminAuth);
app.use("/user", userAuth);

app.use("/user/login", (req, res) => {
  res.send("User logged in successfully");
});

app.get("/user", userAuth, (req, res) => {
  res.send("User is authorized");
});

app.get("/admin/getAllData", (req, res) => {
  // logic of checking if the request is authorized
  res.send("All data fetched successfully");
});

app.delete("/admin/deleteUser", (req, res) => {
  //logic of deleting user
  res.send("User deleted successfully");
});

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
