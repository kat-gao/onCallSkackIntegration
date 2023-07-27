const axios = require("axios");
const { getSchedule, formatDateToYYYYMMDD } = require("./utils");

const scheduleId = process.env.SCHEDULE_ID;
const pagerDutyToken = process.env.PAGER_DUTY_TOKEN;
const slackToken = process.env.SLACK_BOT_TOKEN;

const blocks = require("../blocks.js");
const { getSlackIdFromPagerDutyUserId } = require("./user");

module.exports.getScheduleList = async ({
  logger,
  body,
  command,
  ack,
  client,
}) => {
  await ack();

  const schedule = await getSchedule();
  const parsedSchedule = await parseScheduleList(client, schedule);
  const slackTable = drawSlackMsgTable(["dev", "schedule"], parsedSchedule);

  await client.chat.postMessage({
    channel: body.user_id,
    text: slackTable,
  });
};

const parseScheduleList = async (client, schedule) => {
  const scheduleData =
    schedule.data.schedule.final_schedule.rendered_schedule_entries;

  const scheduleList = await Promise.all(
    scheduleData.map(async (entry) => {
      const start = formatDateToYYYYMMDD(entry.start);
      const end = formatDateToYYYYMMDD(entry.end);
      const dev = await getSlackIdFromPagerDutyUserId(client, entry.user.id);
      return {
        dev: `<@${dev}>`,
        schedule: `${start} - ${end}`,
      };
    })
  );

  return scheduleList;
};

const drawSlackMsgTable = (columnNames, data, columnPadding = 2) => {
  const tableWidth = columnNames.reduce(
    (acc, colName) => acc + colName.length + 3,
    0
  );
  const headerRow = `| ${columnNames.join(" | ")} |\n`;
  const dividerRow = `|${"-".repeat(tableWidth - 2)}|\n`;

  const dataRows = data
    .map(
      (row) =>
        `| ${columnNames.map((colName) => row[colName] || "").join(" | ")} |\n`
    )
    .join("");

  return `\`\`\`
  ${headerRow}${dividerRow}${dataRows}\`\`\``;
};
