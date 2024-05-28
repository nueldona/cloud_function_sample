// exports.sendEventEmails = onDocumentCreated(
//   "notifications/{notificationId}",
//   async (event) => {
//     const snapshot = event.data;
//     if (!snapshot) {
//       console.log("No data associated with the event");
//       return;
//     }
//     const event_data = snapshot.data();
//     const payload = {
//       notification: {
//         title: notificationData.title,
//         body: notificationData.body,
//       },
//     };

//     const user = await db
//       .collection("users")
//       .doc(notificationData.userId)
//       .get();
//     const token = user.data().fcmToken;

//     await admin.messaging().sendToDevice(token, payload);
//     return null;
//   }
// );
