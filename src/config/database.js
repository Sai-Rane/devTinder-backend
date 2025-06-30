const mongoose = require("mongoose");

const connectDB = async () => {
  // to connect to the database we write .connect and pass the cluster connection string
  await mongoose.connect(
    "mongodb+srv://dev_john:874384398432987@nodecluster.fppxqds.mongodb.net/devTinder"
  );
};

module.exports={
    connectDB
}
