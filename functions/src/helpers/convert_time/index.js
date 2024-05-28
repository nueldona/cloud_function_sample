
const convertTime = (seconds, nanoseconds) => {
  let nanoseconds_conversion = 0;
  if (nanoseconds.toString().length === 9) {
    nanoseconds_conversion = nanoseconds / 1000000;
  } else if (nanoseconds.toString().length === 8) {
    nanoseconds_conversion = nanoseconds / 100000;
  }
  const new_time = seconds.toString() + nanoseconds_conversion.toString();
  let stringed_timer = new_time.toString();

  if (stringed_timer.length < 13) {
    const to_add = 13 - stringed_timer.length;
    for (let index = 0; index < to_add; index++) {
      stringed_timer = stringed_timer.concat("0");
    }
  }
  return parseInt(stringed_timer);
};

exports.convertTime = convertTime;
