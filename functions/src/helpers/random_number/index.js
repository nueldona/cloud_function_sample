const uniqid = require("uniqid");

const generate_number = (num = 12, start = 0) => {
  let result = "";
  const characters = String(Date.now());
  const charactersLength = characters.length;

  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  const doc_id = (String(uniqid()) + result).slice(start, num);

  return doc_id;
};

exports.generate_number = generate_number;
