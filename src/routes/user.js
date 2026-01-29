const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

const USER_SAFE_DATA = ["firstName", "lastName", "photoUrl", "about", "skills"];

//get all the pending connection requests of the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "photoUrl",
      "about",
      "skills",
    ]);

    res.json({ message: "success", data: connectionRequests });
  } catch (error) {
    res.status(400).json({ message: "error", error: error });
  }
});

//for the loggedIn user you have to get all the connections
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    //suppose say elon send a connection request to rohit and that request is in accepted state
    //suppose say rohit send a connection request to mark and that request is in accepted state

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row?.fromUserId?._id.equals(loggedInUser?._id)) {
        return row?.toUserId;
      }
      return row?.fromUserId;
    });
    res.json({ message: "success", data: data });
  } catch (error) {
    res.status(400).json({ message: "error", error: error });
  }
});

module.exports = userRouter;
