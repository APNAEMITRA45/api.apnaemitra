const { config } = require("dotenv");

config();

module.exports.MONGODB_URI = process.env.MONGODB_URI;
module.exports.TOQUICK_API_KEY = process.env.TOQUICK_API_KEY;
module.exports.SENDER_PHONE = process.env.SENDER_PHONE;
module.exports.TOQUICK_URL = process.env.TOQUICK_URL;
module.exports.IMAGE_BASE_URL = process.env.IMAGE_BASE_URL;
module.exports.GOOGLE_APPLICATION_CREDENTIALS =
  process.env.GOOGLE_APPLICATION_CREDENTIALS;
