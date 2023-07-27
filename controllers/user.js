const axios = require("axios");
const pagerDutyToken = process.env.PAGER_DUTY_TOKEN;
const slackToken = process.env.SLACK_BOT_TOKEN;

module.exports.getPagerDutyUserFromSlackUserId = async (client, userId) => {
  const res = await client.users.info({
    token: slackToken,
    user: userId,
  });

  const email = res.user.profile.email;
  const pagerDutyUser = await axios.get(
    `https://api.pagerduty.com/users?query=${email}`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.pagerduty+json;version=2",
        Authorization: `Token token=${pagerDutyToken}`,
      },
    }
  );

  return pagerDutyUser.data.users[0].id;
};

module.exports.getSlackIdFromPagerDutyUserId = async (client, userId) => {
  const userEmailRes = await axios.get(
    `https://api.pagerduty.com/users/${userId}/contact_methods`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.pagerduty+json;version=2",
        Authorization: `Token token=${pagerDutyToken}`,
      },
    }
  );

  const userEmail = userEmailRes.data["contact_methods"][0]["address"];

  const res = await client.users.lookupByEmail({
    token: slackToken,
    email: userEmail,
  });

  const slackId = res.user.id;
  return slackId;
};
