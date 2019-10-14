require("dotenv").config();

process.on("unhandledRejection", (error) => {
  logger.error(error.stack);
});

const slack = require("./lib/slack");
const logger = require("./lib/logger");

const plugins = [
  require("./plugins/emoji-notifier-twitter"),
  require("./plugins/channel-notifier-twitter"),
];

(async () => {
  await Promise.all(plugins);
  logger.info("Launched");
})();
