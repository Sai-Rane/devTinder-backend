const express = require("express");
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");

const authRouter = express.Router(); //this is how we create a router

authRouter.post("/signup", async (req, res) => {
  //Validation of data
  validateSignUpData(req);

  const { firstName, lastName, emailId, password } = req.body;

  //Encrypt the password
  const passwordHash = await bcrypt.hash(password, 10);

  // earlier the instance was like this
  // const user = new User(req.body);

  //creating a new instance of the user model
  const user = new User({
    firstName,
    lastName,
    emailId,
    password: passwordHash,
  }); //only the fields passed in this object will be saved in DB

  // const user=User.create(req.body)

  try {
    await user.save();
    res.send("User created");
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Incorrect EmailId");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = await user.getJWT();

      // you can set a cookie using res.cookie
      res.cookie(
        "token",
        token,
        {
          expires: new Date(Date.now() + 8 * 3600000),
        },
        { httpOnly: true }
      );
      res.send("Login Successfull");
    } else {
      throw new Error("Incorrect Password");
    }
  } catch (error) {
    res.status(400).send("Error logging in " + error.message);
  }
});

authRouter.post("/logout", (req, res) => {
  try {
    res.cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.send("Logout Successfull");
  } catch (error) {}
});

module.exports = authRouter;
