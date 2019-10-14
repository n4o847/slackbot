require("dotenv").config();

const slack = require("../lib/slack");
const logger = require("../lib/logger");
const { stripIndent } = require("common-tags");

slack.rtm.on("emoji_changed", async (event) => {
  logger.info(event);

  if (event.subtype === "add") {
    const message = await slack.web.chat.postMessage({
      channel: process.env.CHANNEL_SANDBOX,
      text: stripIndent`
        絵文字 \`:${event.name}:\` が追加されました
      `,
      username: "emoji-notifier",
      icon_emoji: `:${event.name}:`,
    });
    logger.info(message);

    const reaction = await slack.web.reactions.add({
      name: event.name,
      channel: message.channel,
      timestamp: message.ts,
    });
    logger.info(reaction);
  }

  if (event.subtype === "remove") {
    const message = await slack.web.chat.postMessage({
      channel: process.env.CHANNEL_SANDBOX,
      text: stripIndent`
        絵文字 ${event.names.map((name) => `\`:${name}:\``).join(" ")} が削除されました
      `,
      username: "emoji-notifier",
    });
    logger.info(message);
  }
});
