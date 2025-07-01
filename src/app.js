const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");

const app = express(); //instance of express js application

app.use(express.json());

app.post("/signup", async (req, res) => {
  console.log(req.body);

  //creating a new instance of the user model
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User created");
  } catch (error) {
    res.status(400).send("Error creating user");
  }
});

//get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(400).send("User not found");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(400).send("Error fetching user");
  }
});

//feed api - to get all the users from the database
app.get("/feed", async(req, res) => {
  
  try {
    const users=await User.find({})
    res.send(users)
  } catch (error) {
    res.sendStatus(400).send("Error fetching users")
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
