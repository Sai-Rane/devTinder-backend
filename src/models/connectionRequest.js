const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is not a valid status type`,
      },
    },
  },
  { timestamps: true },
);

// Compound Index
// since we are computing a value using fromUserId and toUserId together we have used a compound index on it
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

//this will be called every time a before saving a connection request
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;

  //check if the fromUserId and toUserId are same
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection request to yourself");
  }
  next(); //dont forget to call this next() because it is a middleware
});

const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema,
);

module.exports = ConnectionRequestModel;
