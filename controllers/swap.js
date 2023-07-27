const axios = require("axios");
const { getPagerDutyUserFromSlackUserId } = require("./user");
const {
  getSchedule,
  parseDateIntoOptions,
  parseSwapFormData,
} = require("./utils");

const scheduleId = process.env.SCHEDULE_ID;
const pagerDutyToken = process.env.PAGER_DUTY_TOKEN;
const slackToken = process.env.SLACK_BOT_TOKEN;

const blocks = require("../blocks.js");

module.exports.sendSwapForm = async ({
  logger,
  body,
  command,
  ack,
  client,
}) => {
  await ack();

  try {
    const schedule = await getSchedule();
    const options = parseDateIntoOptions(schedule);

    const res = await client.views.open({
      trigger_id: command.trigger_id,
      view: {
        type: "modal",
        callback_id: "swap_form",
        title: {
          type: "plain_text",
          text: "Swap On Call Shift",
        },
        submit: {
          type: "plain_text",
          text: "Swap",
        },
        blocks: [
          blocks.divider,
          blocks.selectUser,
          blocks.selectSchedule("Select your shift", options, "swapper_shift"),
          blocks.selectSchedule("Select their shift", options, "swappee_shift"),
        ],
      },
    });

    logger.info(res.view.id);
  } catch (error) {
    console.error(error);
  }
};

module.exports.swapShifts = async ({ ack, body, view, client, logger }) => {
  await ack();

  const { swappeeUser, swapperShift, swappeeShift } = parseSwapFormData(
    view.state.values
  );
  const swapperUserId = await getPagerDutyUserFromSlackUserId(
    client,
    body.user.id
  );
  const swappeeUserId = await getPagerDutyUserFromSlackUserId(
    client,
    swappeeUser
  );

  try {
    var options = {
      method: "POST",
      url: `https://api.pagerduty.com/schedules/${scheduleId}/overrides`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.pagerduty+json;version=2",
        Authorization: `Token token=${pagerDutyToken}`,
      },
      data: {
        overrides: [
          {
            start: swappeeShift.split(" - ")[0],
            end: swappeeShift.split(" - ")[1],
            user: { id: swapperUserId, type: "user_reference" },
            time_zone: "UTC",
          },
          {
            start: swapperShift.split(" - ")[0],
            end: swapperShift.split(" - ")[1],
            user: { id: swappeeUserId, type: "user_reference" },
            time_zone: "UTC",
          },
        ],
      },
    };

    const res = await axios.request(options);

    await client.chat.postMessage({
      channel: body.user.id,
      text: "Your shift has been swapped! :cars-yay-frog:",
    });
  } catch (error) {
    await client.chat.postMessage({
      channel: body.user.id,
      text: "Something went wrong... :meow_eyespout: Please try again later!",
    });
    console.error(error);
  }
};

// module.exports.updateView = async (user, body, client, logger) => {
//   try {
//     const res = await client.views.update({
//       view_id: body.view.id,
//       hash: body.view.hash,
//       view: {
//         type: "modal",
//         callback_id: "swap_modal_schedule_select",
//         title: {
//           type: "plain_text",
//           text: "Select Schedules To Swap",
//         },
//         submit: {
//           type: "plain_text",
//           text: "Swap",
//         },
//         blocks: [
//           blocks.divider,
//           blocks.confirmUser(user),
//           blocks.selectSchedule("Select your shift", getSchedule()),
//           blocks.selectSchedule("Select their shift", getSchedule()),
//         ],
//       },
//     });

//     logger.info(res.view.id);
//   } catch (error) {
//     console.error(error);
//   }
// };
