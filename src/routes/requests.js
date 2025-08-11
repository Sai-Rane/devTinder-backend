const express = require("express");
const { userAuth } = require("../middlewares/auth");

const requestsRouter = express.Router(); //this is how we create a router

requestsRouter.post("/sendConnectionRequets", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + " sent the connection request");
  } catch (error) {
    res.status(400).send("Error sending connection request" + error.message);
  }
});

module.exports = requestsRouter;
