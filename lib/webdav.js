require("dotenv").config();

const { createClient } = require("webdav");

const webdav = createClient(process.env.WEBDAV_URL, {
  username: process.env.WEBDAV_USERNAME,
  password: process.env.WEBDAV_PASSWORD,
});

module.exports = webdav;
