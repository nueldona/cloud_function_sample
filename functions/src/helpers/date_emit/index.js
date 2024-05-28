const addZero = (value) => {
  if (value < 10) {
    value = "0" + value;
  }
  return value;
};
const dateEmit = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  let month = parseInt(d.getMonth()) + 1;
  month = addZero(month);
  let day = d.getDate();
  day = addZero(day);
  // let hour = (parseInt(d.getHours()) - 1).toString();
  let hour = parseInt(d.getHours()).toString();
  hour = addZero(hour);
  let minutes = d.getMinutes();
  minutes = addZero(minutes);
  let seconds = d.getSeconds();
  seconds = addZero(seconds);
  const num_of_days = year + "-" + month + "-" + day + hour + minutes + seconds;

  return num_of_days;
};

exports.dateEmit = dateEmit;
