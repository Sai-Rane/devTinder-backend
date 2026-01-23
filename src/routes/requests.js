const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const requestsRouter = express.Router(); //this is how we create a router

//below api is only for ignored and interested
requestsRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type" + status });
      }

      //check if there is an existing connection request
      const existingConnectionRequest = await ConnectionRequest.findOne({
        fromUserId,
        toUserId,
      });

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: "Connection request sent successfully",
        data: data,
      });
    } catch (error) {
      res.status(400).send("Error sending connection request" + error.message);
    }
  },
);

module.exports = requestsRouter;
