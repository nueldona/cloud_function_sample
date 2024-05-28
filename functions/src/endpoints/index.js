const { onRequest } = require("firebase-functions/v2/https");
const { db, field } = require("../services/firebase");
const express = require("express");
const cors = require("cors");
const app = express();
const paystack = require("../payment_services/paysatck");

app.use(cors({ origin: true }));
app.use(express.json());

// user | parent
app.post("/user", async (req, res) => {
  const user = req.body;
  try {
    const docRef = await db.collection("users").add(user);
    res
      .status(201)
      .send({ message: "user created successfuly", id: docRef.id });
  } catch (error) {
    console.log("error: " + error);
    res.status(500).send({ message: error.message});
  }
});

app.get("/users", async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).send({ message: users });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.put("/user/:id", async (req, res) => {
  const id = req.params.id;
  const user = req.body;
  try {
    await db.collection("users").doc(id).update(user);
    res.status(200).send({ message: "user updated successfuly" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.delete("/user/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await db.collection("users").doc(id).delete();
    res.status(200).send({ message: "user deleted successfuly" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// user | children
app.post("/children", async (req, res) => {
  const user = req.body;
  try {
    const docRef = await db
      .collection("users")
      .doc(user.user_id)
      .collection("children")
      .add(user);
    res
      .status(201)
      .send({ message: "user's child created successfuly", id: docRef.id });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.put("/children/:id", async (req, res) => {
  const id = req.params.id;
  const user = req.body;
  try {
    await db
      .collection("users")
      .doc(user.user_id)
      .collection("children")
      .doc(id)
      .update(user);
    res.status(200).send({ message: "user's child updated successfuly" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get("/children/:id", async (req, res) => {
  const id = req.params.id;
  const user_id = req.body;
  try {
    const snapshot = await db
      .collection("users")
      .doc(user_id)
      .collection("children")
      .doc(id)
      .get();
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).send({ message: users });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.delete("/children/:id", async (req, res) => {
  const id = req.params.id;
  const user_id = req.body;
  try {
    await db
      .collection("users")
      .doc(user_id)
      .collection("children")
      .doc(id)
      .delete();
    res.status(200).send({ message: "user's child deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.put("update_quiz/:id", async (req, res) => {
  const id = req.params.id;
  const user = req.body;
  const user_id = user.user_id;
  delete user.user_id;
  try {
    await db
      .collection("users")
      .doc(user_id)
      .collection("children")
      .doc(id)
      .update({ quzzies: field.arrayUnion(user) });
    res.status(200).send({ message: "user's child quiz updated successfuly" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// referrals
app.post("/referral-code", async (req, res) => {
  const user = req.body;
  const referral = generate_number();
  try {
    await db.collection("referrals").add({
      user_id: user,
      referral_code: referral,
      created_at: Date.now(),
      updated_at: Date.now(),
      used: false,
    });
    res.status(201).send({
      message: "referral created successfully",
      referral_code: referral,
    });
  } catch (error) {
    res.status(500).send({ message: error.message});
  }
});

app.post("/verify-referral-code", async (req, res) => {
  const { referral } = req.body;
  const snapshot = await db
    .collection("referrals")
    .where("referral_code", "==", referral)
    .where("used", "==", false)
    .get();

  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    await db.collection("referrals").doc(doc.id).update({ used: true });
    res.status(200).send({ message: "Referral code is valid" });
  } else {
    res.status(400).send({ message: "Invalid referral code" });
  }
});

// payment services
app.post("/paystack-payment", async (req, res) => {
  const { amount, email } = req.body;
  let verify_response;
  const { message, status } = await paystack.initiateTransaction({
    amount,
    email,
  });
  console.log({ status, message })
  if (status) {
    verify_response = await paystack.verifyTransaction(message);
    res.status(verify_response.status_code).send({ message: verify_response.message });
  } else {
    res.status(400).send({ message: message});
  }
});

module.exports = {
  api: onRequest(app),
};
