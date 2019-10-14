require("dotenv").config();

const axios = require("axios");
const slack = require("../lib/slack");
const twitter = require("../lib/twitter");
const logger = require("../lib/logger");
const { stripIndent } = require("common-tags");

slack.rtm.on("emoji_changed", async (event) => {
  logger.info(event);

  if (event.subtype === "add") {
    const { data } = await axios.get(event.value, { responseType: "arraybuffer" });
    const media = await twitter.post("media/upload", { media: data });
    logger.info(media);

    const tweet = await twitter.post("statuses/update", {
      status: stripIndent`
        【自動投稿】
        絵文字 :${event.name}: が追加されました
      `,
      media_ids: media.media_id_string,
    });
    logger.info(tweet);
  }

  if (event.subtype === "remove") {
    const tweet = await twitter.post("statuses/update", {
      status: stripIndent`
        【自動投稿】
        絵文字 ${event.names.map((name) => `:${name}:`).join(" ")} が削除されました
      `,
    });
    logger.info(tweet);
  }
});
