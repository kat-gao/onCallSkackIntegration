require("dotenv").config();
const { App } = require("@slack/bolt");
const { sendSwapForm, swapShifts } = require("./controllers/swap");
const { help } = require("./controllers/help");
const { getScheduleList } = require("./controllers/list");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SOCKET_TOKEN,
});

app.command("/swap", sendSwapForm);

app.command("/help", help);

app.command("/list", getScheduleList);

app.view("swap_form", swapShifts);

const startApp = async () => {
  await app.start(process.env.PORT || 3000);
  console.log("K1 On Call Bot is running!");
};

startApp();
