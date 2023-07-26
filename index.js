require("dotenv").config();
const { App } = require("@slack/bolt");
const controller = require("./controller");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SOCKET_TOKEN,
});

app.command("/swap", controller.swap);

const startApp = async () => {
  await app.start(process.env.PORT || 3000);
  console.log("K1 On Call Bot is running!");
};

startApp();