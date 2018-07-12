const moment = require("moment");

const mapSearchValueType = ({ field, value }) => {
  const [key] = Object.keys(value);

  if (key === "DATE") {
    return {
      // value[key] = moment(val).format(
      //   "YYYY-MM-DD"
      // );
      DATE: new Date(value[key]).toISOString()
    };
  } else if (key === "YESNO") {
    return {
      YESNO: value[key]
    };
  } else if (key === "NUMBER" || key === "CURRENCY") {
    return {
      [key]: value[key]
    };
  } else if (key === "TEXT" || key === "SELECT" || key === "LONGTEXT") {
    return {
      [`${key}_contains`]: value[key]
    };
  }
};

module.exports = mapSearchValueType;
