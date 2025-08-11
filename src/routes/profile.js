const express = require("express");
const { validateEditProfileData } = require("../utils/validation");
const { userAuth } = require("../middlewares/auth");

const profileRouter = express.Router(); //this is how we create a router

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Error logging in " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid data"); //whenever we throw a error, the catch block will catch this error
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save(); //save the changes to the database

    res.json({
      message: `${loggedInUser.firstName} , Profile updated successfully`,
      data: loggedInUser,
    });
    console.log("loggedInUser", loggedInUser);
  } catch (error) {
    res.status(400).send("Error editing profile " + error.message);
  }
});

module.exports = profileRouter;
