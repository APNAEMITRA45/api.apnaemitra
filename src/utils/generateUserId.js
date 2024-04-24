const { v4: uuid } = require("uuid");

exports.generateUserId = (howManyNumbers) => {
  // Generate a full UUID using the v4 method
  const fullUuid = uuid();

  // Remove dashes and take the first 8 characters
  const shortUuid = fullUuid.replace(/-/g, "").substring(0, howManyNumbers);

  // Convert hexadecimal to decimal (base 10)
  const digitsOnly = parseInt(shortUuid, 16);

  return String(digitsOnly).substring(0, howManyNumbers);
};
