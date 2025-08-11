const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const { userAuth } = require("../middlewares/auth");

const profileRouter = express.Router(); //this is how we create a router

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Error logging in " + error.message);
  }
});

module.exports = profileRouter;
