const { db } = require("../services/firebase");
const sgMail = require("@sendgrid/mail");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { allKeys } = require("../helpers/emit_keys");

sgMail.setApiKey(allKeys().SENDGRID_API_KEY);

exports.sendEventEmails = onDocumentCreated(
  "transactions/{docId}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      console.log("No data associated with the event");
      return;
    }
    const event_data = snapshot.data();
    if (event_data.data.status === "failed") {
      const user = await db.collection("users").doc(event_data.data.meta_date.user_id).get();
      const email = user.data().email;
      const msg = {
        to: email,
        from: "no-reply@yourdomain.com",
        subject: "Payment Failed",
        text: "Your payment has not gone through. Please update your payment information.",
      };
      await sgMail.send(msg);
    }
    // Add other events as necessary
    return null;
  }
);
