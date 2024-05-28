/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const crud = require("./src/endpoints");
// const paystack = require("./src/payment_services/paysatck");
// const referral_codes = require("./src/referrals");
const week_report = require("./src/email/weekly_email_report");
const trigger_event = require("./src/email/trigger_event");
// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

exports.crud = crud.api;
// exports.paystack = paystack.paystack_payment;
// exports.referral_codes = referral_codes.referrals
exports.week_report = week_report.sendWeeklyReport;
exports.trigger_event = trigger_event.sendEventEmails;

