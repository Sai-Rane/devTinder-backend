const jwt = require("jsonwebtoken");
const User = require("../models/user");

const adminAuth = (req, res, next) => {
  console.log("auth is getting checked");
  const token = "dasjkd";
  const isAdminAuthorized = token === "dasjkd";
  if (!isAdminAuthorized) {
    res.status(401).send("Unauthorized access");
  } else {
    next();
  }
};

const userAuth = async (req, res, next) => {
  // the job of this middleware is to read the token from the req cookies

  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is not valid");
    }

    const decodedObj = await jwt.verify(token, "DEV@Tinder$790");

    const { _id } = decodedObj;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user; //attach the user to the req object
    next(); //means the user is authenticated and we can proceed to the next middleware or route handler
  } catch (error) {
    res.status(400).send("Unauthorized access: " + error.message);
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
