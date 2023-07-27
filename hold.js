// const res = await client.views.open({
//     trigger_id: command.trigger_id,
//     view: {
//       type: "modal",
//       callback_id: "swap_modal_user_select",
//       title: {
//         type: "plain_text",
//         text: "Swap On Call Shift",
//       },
//       submit: {
//         type: "plain_text",
//         text: "Next",
//       },
//       blocks: [blocks.divider, blocks.selectUser],
//     },
//   });

//   logger.info(res.view.id);
// } catch (error) {
//   console.error(error);
// }

// dialog: {
//     callback_id: "swap_form",
//     title: "Swap On Call Shift",
//     submit_label: "Swap",
//     elements: [
//       {
//         label: "Swap with",
//         type: "select",
//         name: "swappee",
//         data_source: "users",
//       },
//       {
//         label: "Your Shift to Swap",
//         type: "select",
//         name: "swapper_shift",
//         options: options,
//       },
//       {
//         label: "Their Shift to Swap With",
//         type: "select",
//         name: "swappee_shift",
//         options: options,
//       },
//     ],
//   },
