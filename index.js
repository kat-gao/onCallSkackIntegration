require("dotenv").config();
const { App } = require("@slack/bolt");
const { swap } = require("./controllers/swap");
const { help } = require("./controllers/help");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SOCKET_TOKEN,
});

app.command("/swap", swap);

app.command("/help", help);

app.view("swap_form", async ({ ack, body, view, client, logger }) => {
  await ack();

  console.log("view", view.state.values);
  console.log("body", body.user.name);

  console.log("vieww is back");
});

const startApp = async () => {
  await app.start(process.env.PORT || 3000);
  console.log("K1 On Call Bot is running!");
};

startApp();
