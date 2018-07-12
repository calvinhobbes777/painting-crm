const mapExtraneousSearchValues = values => {
  const keys = Object.keys(values);

  const maps = keys.map(key => {
    const value = values[key];

    if (typeof value !== "object") {
      return {
        [`${key}_contains`]: value
      };
    }

    return {
      [key]: value
    };
  });

  return maps.reduce((val, acc) => Object.assign(acc, val), {});
};

module.exports = mapExtraneousSearchValues;
