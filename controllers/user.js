const axios = require("axios");

module.exports.getPagerDutyUserFromSlackUserId = async (client, userId) => {
  const res = await client.users.info({
    token: process.env.SLACK_BOT_TOKEN,
    user: userId,
  });

  const email = res.user.profile.email;
  const pagerDutyUser = await axios.get(
    `https://api.pagerduty.com/users?query=${email}`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.pagerduty+json;version=2",
        Authorization: `Token token=${process.env.PAGER_DUTY_TOKEN}`,
      },
    }
  );

  console.log(pagerDutyUser.data.users[0]);

  return pagerDutyUser.data.users[0];
};
