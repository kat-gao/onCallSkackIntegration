const axios = require("axios");

const scheduleId = process.env.SCHEDULE_ID;
const pagerDutyToken = process.env.PAGER_DUTY_TOKEN;
const slackToken = process.env.SLACK_BOT_TOKEN;

const blocks = require("../blocks.js");

module.exports.swap = async ({ logger, body, command, ack, client }) => {
  await ack();

  const {
    text: swappeeUserName,
    user_id: swapperUserId,
    channel_id: channel,
  } = command;
  try {
    const options = await getSchedule();

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

const parseDateIntoOptions = (schedule) => {
  const { final_schedule } = schedule.data.schedule;
  const { rendered_schedule_entries } = final_schedule;

  // console.log("rendered_schedule_entries", rendered_schedule_entries);
  const options = rendered_schedule_entries.map((entry) => {
    const { start, end } = entry;
    const startDateTime = new Date(start);
    const endDateTime = new Date(end);

    return {
      text: {
        type: "plain_text",
        text: `${startDateTime.toLocaleDateString()} - ${endDateTime.toLocaleDateString()}`,
      },
      value: `${startDateTime.toISOString()} - ${endDateTime.toISOString()}`,
    };
  });

  return options;
};

const getSchedule = async () => {
  const schedule = await axios.get(
    `https://api.pagerduty.com/schedules/${scheduleId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.pagerduty+json;version=2",
        Authorization: `Token token=${pagerDutyToken}`,
      },
      params: {
        time_zone: "America/Chicago",
        since: "2023-07-26",
        until: "2023-09-26",
      },
    }
  );

  const options = parseDateIntoOptions(schedule);

  return options;
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
