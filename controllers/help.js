module.exports.sendHelpInstructions = async ({ ack, client, body }) => {
  await ack();

  await client.chat.postMessage({
    channel: body.user_id,
    text: slackCommandsInfo,
  });
};

const slackCommandsInfo = `
:meow_coffee: *Available Slack Commands*

You can use the following commands to interact with me:

1. \`/swap\`: Use this command to swap on call shift with another dev.

2. \`/list\`: Use this command to view upcomming on call schedule.

*Usage Instructions*

1. Type the command in direct message with me! 

2. Press Enter to execute the command.

*Additional Notes*

- Please make sure the scedule date are correct on the \`/swap\` form. 

Feel free to try out these commands and report any bugs to <@U05B4RF45B3>! :meow_happy_paws::meow_happy_paws:
`;
