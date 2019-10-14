require("dotenv").config();

const { WebClient } = require("@slack/web-api");
const { RTMClient } = require("@slack/rtm-api");

const webClient = new WebClient(process.env.SLACK_TOKEN);
const rtmClient = new RTMClient(process.env.SLACK_TOKEN);

rtmClient.start();

const slack = {
  web: webClient,
  rtm: rtmClient,
};

module.exports = slack;
