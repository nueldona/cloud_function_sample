const { allKeys } = require("../helpers/emit_keys");
const { db, field } = require("../services/firebase");
const axios = require("axios");

const initiateTransaction = async (payload) => {
  let message, status, status_code;
  const createObject = {
    baseURL: "https://api.paystack.co",
    headers: {
      Authorization: `Bearer ${allKeys().PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  };
  const apiClient = axios.create(createObject);
  try {
    const response = await apiClient.post("/transaction/initialize", payload);
    message = response.data.data;
    status = response.data.status;
    status_code = 200;
  } catch (error) {
    message = error.message;
    status = false;
    status_code = 400;
  }
  return { message, status, status_code };
};

const verifyTransaction = async (payload) => {
  let message, status, status_code;
  const createObject = {
    baseURL: "https://api.paystack.co",
    headers: {
      Authorization: `Bearer ${allKeys().PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  };
  const apiClient = axios.create(createObject);
  try {
    const response = await apiClient.get(
      `/transaction/verify/${payload.reference}`
    );
    const db_response = await saveToDatabase(response.data)
    message = db_response.message;
    status = db_response.status;
    status_code = db_response.status_code;
  } catch (error) {
    message = error.message;
    status = false;
    status_code = 400;
  }
  return { message, status, status_code };
};

const saveToDatabase = async (payload) => {
  let message, status, status_code;
  try {
    await db.collection("transactions").add(payload);
    message = "transaction successfuly";
    status = true;
    status_code = 201;
  } catch (error) {
    message = error.message;
    status = false;
    status_code = 500;
  }
  return { message, status, status_code };
};

module.exports = {
  initiateTransaction: initiateTransaction,
  verifyTransaction: verifyTransaction,
};
