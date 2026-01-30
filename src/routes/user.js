const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

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

//feed API
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    //lets build logic of this API
    // suppose you have loggedIn by Virat, then virat should see all the cards of user whom Virat has not sent friend(connection) request
    // Virat should not see his own card in the feed
    //if Virat has ignored profile of elon then elon should not be visible to Virat
    // Virat should also not see the list of friends with whom he has already been friends
    //example : new user is Ram=[Virat,Rohit,Elon,Jensen]
    // Ram --> Virat, then he should see Rohit,Elon,Jensen

    //finding all connection requests either i have sent or i have received, beacause i dont want to show these cards in my feed
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser?._id }, { toUserId: loggedInUser?._id }],
    }).select("fromUserId toUserId");
    // [
    //   {
    //     _id: "697a3f8c65058375dfaee2ed",
    //     fromUserId: "697a3f4465058375dfaee2e6",
    //     toUserId: "697a3f1365058375dfaee2e2",
    //   },
    //   {
    //     _id: "697c4dc52051136b2ff88131",
    //     fromUserId: "697a3f4465058375dfaee2e6",
    //     toUserId: "697a3f2c65058375dfaee2e4",
    //   },
    // ];

    const hideUsersFromFeed = new Set(); //set will always have unique elements,removes duplicates
    connectionRequests.forEach((row) => {
      hideUsersFromFeed.add(row.fromUserId._id.toString());
      hideUsersFromFeed.add(row.toUserId._id.toString());
    });
    console.log(hideUsersFromFeed);

    //finding all the users whose id is not present in hideUsersFromFeed and whose id is not equal to loggedInUser._id
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(USER_SAFE_DATA); //select sends the fields only that you want
    res.send(users);
  } catch (error) {
    res.status(400).json({ message: "error", error: error });
  }
});

module.exports = userRouter;
