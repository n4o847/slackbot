require("dotenv").config();

const axios = require("axios");
const slack = require("../lib/slack");
const twitter = require("../lib/twitter");
const logger = require("../lib/logger");
const { stripIndent } = require("common-tags");

slack.rtm.on("channel_created", async (event) => {
  logger.info(event);

  const tweet = await twitter.post("statuses/update", {
    status: stripIndent`
      【自動投稿】
      チャンネル ${event.channel.name} が作成されました
    `,
  });
  logger.info(tweet);
});
