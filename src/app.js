const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

const app = express(); //instance of express js application

app.use(express.json());

app.post("/signup", async (req, res) => {
  // console.log(req.body);

  //Validation of data
  validateSignUpData(req);

  const { firstName, lastName, emailId, password } = req.body;

  //Encrypt the password
  const passwordHash = await bcrypt.hash(password, 10);
  console.log("passwordHash", passwordHash);

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

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Incorrect EmailId");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      res.send("Login Successfull");
    } else {
      throw new Error("Incorrect Password");
    }
  } catch (error) {
    res.status(400).send("Error logging in " + error.message);
  }
});

//get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  console.log("userEmail", userEmail);

  try {
    const users = await User.find({ emailId: userEmail }); //.find method will return all the users with the given emailId
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
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.sendStatus(400).send("Error fetching users");
  }
});

// api for deleting a user
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (error) {
    console.log("error", error);
    res.status(400).send("Error deleting user");
  }
});

// api to update a user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "age", "gender", "skills"];

    const isUpdateAllowed = Object.keys(data).every((ele) =>
      ALLOWED_UPDATES?.includes(ele)
    );

    if (!isUpdateAllowed) {
      throw new Error("Invalid update");
    }

    if (data?.skills.length > 10) {
      throw new Error("Skills array can have max 10 skills");
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send("Error updating user" + error.message);
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
