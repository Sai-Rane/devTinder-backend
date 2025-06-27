const adminAuth=(req, res, next) => {
    console.log("auth is getting checked")
  const token = "dasjkd";
  const isAdminAuthorized = token === "dasjkd";
  if (!isAdminAuthorized) {
    res.status(401).send("Unauthorized access");
  } else {
    next();
  }
}

const userAuth=(req, res, next) => {
    console.log("auth is getting checked")
  const token = "dasjkd";
  const isAdminAuthorized = token === "dasjkd";
  if (!isAdminAuthorized) {
    res.status(401).send("Unauthorized access");
  } else {
    next();
  }
}

module.exports={
    adminAuth,
    userAuth,
}