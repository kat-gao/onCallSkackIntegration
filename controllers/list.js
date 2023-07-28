const { getSchedule, formatDateToMMDDYY } = require("./utils");

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
  const slackTable = drawSlackMsgTable(parsedSchedule);

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
      const start = formatDateToMMDDYY(entry.start);
      const end = formatDateToMMDDYY(entry.end);
      const dev = await getSlackIdFromPagerDutyUserId(client, entry.user.id);
      return [`${start} - ${end}`, `<@${dev}>`];
    })
  );

  return scheduleList;
};

const drawSlackMsgTable = (data) => {
  const columnNames = ["Schedule (MM-DD-YY)", "Dev On Call"];

  const getColumnWidths = (rows) => {
    const columnWidths = Array(columnNames.length).fill(0);
    rows.forEach((row) => {
      row.forEach((cell, index) => {
        columnWidths[index] = Math.max(columnWidths[index], cell.length);
      });
    });
    return columnWidths;
  };

  const columnWidths = getColumnWidths([columnNames]);
  const headerRow = `| ${columnNames
    .map((colName, index) => colName.padEnd(columnWidths[index]))
    .join(" | ")} |\n`;
  const dividerRow = `|${columnWidths
    .map((width) => "-".repeat(width + 2))
    .join("|")}|\n`;

  const dataRows = data
    .map((row) => {
      return `| ${row[0].padEnd(columnWidths[0])} | ${row[1].padEnd(
        columnWidths[1]
      )} |\n`;
    })
    .join("");

  return `\`\`\`\n${headerRow}${dividerRow}${dataRows}\`\`\``;
};
