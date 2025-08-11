const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not valid");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = ["firstName", "lastName", "about", "skills", "age"];

  const isAllowedEdit = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isAllowedEdit;
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
};
