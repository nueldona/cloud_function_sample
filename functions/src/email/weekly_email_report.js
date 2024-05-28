const functions = require("firebase-functions/v2");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { db } = require("../services/firebase");
const { allKeys } = require("../helpers/emit_keys");
const sgMail = require("@sendgrid/mail");
const PromisePool = require("es6-promise-pool").default;

// Maximum concurrent account deletions.
const MAX_CONCURRENT = 3;

sgMail.setApiKey(allKeys().SENDGRID_API_KEY);

const setData = (quizzes, filter_by_date = "") => {
  const end_date =
    typeof filter_by_date === "string" ? new Date() : new Date(filter_by_date);
  const start_date =
    typeof filter_by_date === "string" ? new Date() : new Date(filter_by_date);
  start_date.setDate(start_date.getDate() - 7);

  const result = quizzes.filter((event) => {
    const event_date = new Date(event.created_at);
    return event_date >= start_date && event_date <= end_date;
  });

  const total_score = result.reduce((sum, event) => sum + event.score, 0);
  const quiz_count = result.length;
  const average_score = quiz_count ? total_score / quiz_count : 0;

  return { total_score, quiz_count, average_score, start_date };
};

const sortReport = async () => {
  const messages = [];
  const users_snapshot = await db.collection("users").get();

  for (const userDoc of users_snapshot.docs) {
    const user_data = userDoc.data();
    const children_snapshot = await db
      .collection("users")
      .doc(userDoc.id)
      .collection("children")
      .get();

    for (const childDoc of children_snapshot.docs) {
      const child_data = childDoc.data();
      const recent_week = setData(child_data.quizzes);
      const previous_week = setData(child_data.quizzes, recent_week.start_date);

      let percentage_change = 0;
      if (previous_week.average_score !== 0) {
        percentage_change =
          ((recent_week.average_score - previous_week.average_score) /
            previous_week.average_score) *
          100;
      }

      messages.push({
        user_email: user_data.email,
        user_name: user_data.name,
        child_name: child_data.name,
        recent_week_average_score: recent_week.average_score,
        previous_week_average_score: previous_week.average_score,
        percentage_change: percentage_change,
      });
    }
  }
  return messages;
};

const sendMessage = async (report) => {
  const msg = {
    to: report.user_email,
    from: "no-reply@yourdomain.com",
    subject: "Weekly Quiz Performance Report",
    text: `Dear ${report.user_name},

Here is the quiz performance report for ${report.child_name}.

Current Week Average Score: ${report.recent_week_average_score.toFixed(2)}
Previous Week Average Score: ${report.previous_week_average_score.toFixed(2)}
Percentage Change: ${report.percentage_change.toFixed(2)}%

Best regards`,
  };

  await sgMail.send(msg);
};

const sendReportsInBatches = async (reports) => {
  const promiseProducer = function* () {
    for (const report of reports) {
      yield sendMessage(report);
    }
  };
  const pool = new PromisePool(promiseProducer(), MAX_CONCURRENT);
  await pool.start();
};

exports.sendWeeklyReport = onSchedule("every sunday 00:00", async (event) => {
  const reports_to_send = await sortReport();
  await sendReportsInBatches(reports_to_send);

  functions.logger.log("Weekly report sending finished");
});
