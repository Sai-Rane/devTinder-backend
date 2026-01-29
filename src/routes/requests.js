const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestsRouter = express.Router(); //this is how we create a router

//below api is only for ignored and interested
requestsRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      console.log("toUserId", toUserId);
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type" + status });
      }

      //the fromUserId should not be equal to toUserId
      // if (fromUserId.equals(toUserId)) {
      //   return res
      //     .status(400)
      //     .json({ message: "Cannot send request to yourself" });
      // }

      //checking if the toUserID exists in my DB
      const toUser = await User.findById(toUserId);
      console.log("toUser", toUser);
      if (!toUser) {
        return res.status(404).json({ message: "User not found" });
      }

      //check if there is an existing connection request
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          {
            //checking whether the two userID's exist in DB
            fromUserId,
            toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection request already exists" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: `${req.user.firstName} sent a connection request to ${toUser.firstName}`,
        data: data,
      });
    } catch (error) {
      console.error(error);
      res.status(400).send("Error sending connection request" + error.message);
    }
  },
);

//below api is for accepted and rejected
requestsRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    // if Virat is sending a request to Elon ======> Elon
    // check if the loggedInUser is Elon i.e loggedInUserId = toUserId
    // the status should be interested
    // validate the status (it should not be apart from accept or reject)
    // check if the toUserId is valid
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type " + req.params.status });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId, //to check this requestId exists in DB
        toUserId: loggedInUser._id, // this is making sure that the loggedInUser is accepting the request
        status: "interested", // this is making sure that the request is interested
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({
        message: "Connection request reviewed successfully",
        data: data,
      });
    } catch (error) {
      res
        .status(400)
        .send("Error reviewing connection request" + error.message);
    }
  },
);

module.exports = requestsRouter;
