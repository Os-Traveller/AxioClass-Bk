const roundDigit = (value, length) => {
  let len = length - ('' + value).length;
  return (len > 0 ? new Array(++len).join('0') : '') + value;
};
module.exports = roundDigit;
