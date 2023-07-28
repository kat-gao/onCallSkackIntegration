const axios = require("axios");

const scheduleId = process.env.SCHEDULE_ID;
const pagerDutyToken = process.env.PAGER_DUTY_TOKEN;
const slackToken = process.env.SLACK_BOT_TOKEN;

const formatDateToYYYYMMDD = (date) => {
  date = new Date(date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;

  return formattedDate;
};

const formatDateToMMDDYY = (date) => {
  date = new Date(date);
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${month}-${day}-${year}`;
};
module.exports.formatDateToMMDDYY = formatDateToMMDDYY;

module.exports.getSchedule = async () => {
  const today = new Date();
  const until = addMonthsToDate(today, 3);
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
        since: formatDateToYYYYMMDD(today),
        until: formatDateToYYYYMMDD(until),
      },
    }
  );

  return schedule;
};

module.exports.parseDateIntoOptions = (schedule) => {
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
        text: `${formatDateToMMDDYY(startDateTime)} - ${formatDateToMMDDYY(
          endDateTime
        )}`,
      },
      value: `${startDateTime.toISOString()} - ${endDateTime.toISOString()}`,
    };
  });

  return options;
};

module.exports.parseSwapFormData = (data) => {
  const parsedData = {};
  for (const key in data) {
    if ("get_user_to_swap_with" in data[key]) {
      parsedData["swappeeUser"] =
        data[key]["get_user_to_swap_with"].selected_user;
    }
    if ("get_swapper_shift" in data[key]) {
      parsedData["swapperShift"] =
        data[key]["get_swapper_shift"].selected_option.value;
    }
    if ("get_swappee_shift" in data[key]) {
      parsedData["swappeeShift"] =
        data[key]["get_swappee_shift"].selected_option.value;
    }
  }

  return parsedData;
};

const addMonthsToDate = (date, months) => {
  const newDate = new Date(date.getTime());
  const currentMonth = newDate.getMonth();
  newDate.setMonth(currentMonth + months);
  return newDate;
};
