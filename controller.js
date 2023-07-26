module.exports.swap = async ({ command, ack, respond, client }) => {
  await ack();

  const { text: swappeeUserName, user_id: swapperUserId } = command;

  if (!swappeeUserName || swappeeUserName[0] != "@") {
    return respond({
      text: "Please tag the person you want to swap with. :meow_super-meh:",
    });
  }

  swappeeUserEmail = swappeeUserName.substring(1) + "@koddi.com";

  console.log(swappeeUserEmail);

  try {
    const response = await client.users.info({
      user: swapperUserId,
    });

    const swapperUserEmail = response?.user?.profile?.email;
  } catch (error) {
    console.error(error);
  }
};
