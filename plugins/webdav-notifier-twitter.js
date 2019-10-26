const cron = require("node-cron");
const logger = require("../lib/logger");
const webdav = require("../lib/webdav");

const getLatestModified = async () => {
  // webdav.stat() is buggy?
  const list = await webdav.getDirectoryContents("/").catch(() => []);
  let latestModified = null;
  for (const item of list) {
    const lastmod = Date.parse(item.lastmod)
    if (latestModified === null || lastmod > latestModified) {
      latestModified = lastmod;
    }
  }
  return latestModified;
};

const getModifiedFiles = async (path, since) => {
  if (typeof since !== "number") {
    return {};
  }
  const list = await webdav.getDirectoryContents(path).catch(() => []);
  const files = {};
  for (const item of list) {
    const lastmod = Date.parse(item.lastmod);
    if (lastmod <= since) {
      continue;
    }
    if (item.type === "file") {
      files[item.filename] = item;
    }
    if (item.type === "directory") {
      const subfiles = await getModifiedFiles(item.filename, since);
      Object.assign(files, subfiles);
    }
  }
  return files;
};

const state = {
  latestModified: null,
};

(async () => {
  state.latestModified = await getLatestModified();
  logger.info(state);

  // every hour
  cron.schedule('0 * * * *', async () => {
    const modifiedFiles = await getModifiedFiles("/", state.latestModified);
    state.latestModified = await getLatestModified();
    logger.info({ ...state, modifiedFiles });
    const paths = Object.keys(modifiedFiles);
    if (paths.length > 0) {
      const tweet = await twitter.post("statuses/update", {
        status: stripIndent`
          【自動投稿】
          EEIC DAV で ${paths.length} 件の変更がありました。
        `,
      });
      logger.info(tweet);
    }
  });
})();
