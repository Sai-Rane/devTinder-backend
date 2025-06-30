const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");

const app = express(); //instance of express js application

app.post("/signup",async (req, res) => {
  const user = new User({
    firstName: "Katrina",
    lastName: "kaif",
    emailId: "katrina@yopmail.com",
    password: "123456",
  }); //creating a new instance of User model

  try {
    await user.save();  // this will save dummy data in database
    res.send("User created");
  } catch (error) {
    res.status(400).send("Error creating user");
  }

});

connectDB()
  .then(() => {
    console.log("Connected to the database");

    //listen to the port after successfull connection to the database
    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((err) => console.log("Failed to connect to the database"));
