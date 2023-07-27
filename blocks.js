// module.exports.selectUser = {
//   type: "input",
//   element: {
//     type: "multi_users_select",
//     placeholder: {
//       type: "plain_text",
//       text: "Select a dev",
//       emoji: true,
//     },
//     action_id: "multi_users_select-action",
//     max_selected_items: 1,
//   },
//   label: {
//     type: "plain_text",
//     text: "Select a dev to swap with",
//     emoji: true,
//   },
// };

module.exports.selectUser = {
  type: "section",
  text: {
    type: "mrkdwn",
    text: "Select a dev to swap with",
  },
  accessory: {
    type: "users_select",
    placeholder: {
      type: "plain_text",
      text: "Select a user",
      emoji: true,
    },
    action_id: "get_user_to_swap_with",
  },
};

module.exports.divider = {
  type: "divider",
};

// module.exports.selectSchedule = (text, options) => {
//   const block = {
//     type: "section",
//     text: {
//       type: "mrkdwn",
//       text: text,
//     },
//     accessory: {
//       type: "multi_static_select",
//       placeholder: {
//         type: "plain_text",
//         text: "Select schedule",
//         emoji: true,
//       },
//       options: options,
//       action_id: "multi_static_select-action",
//       max_selected_items: 1,
//     },
//   };
//   return block;
// };

module.exports.selectSchedule = (text, options, scheduleType) => {
  const block = {
    type: "section",
    text: {
      type: "mrkdwn",
      text: text,
    },
    accessory: {
      type: "static_select",
      placeholder: {
        type: "plain_text",
        text: "Select an item",
        emoji: true,
      },
      options: options,
      action_id: "get_" + scheduleType,
    },
  };

  return block;
};

module.exports.confirmUser = (user) => {
  const block = {
    type: "context",
    elements: [
      {
        type: "plain_text",
        text: `You are swapping with <@${user}>`,
        emoji: true,
      },
    ],
  };
};
