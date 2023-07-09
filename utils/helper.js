const roundDigit = (value, length) => {
  let len = length - ('' + value).length;
  return (len > 0 ? new Array(++len).join('0') : '') + value;
};

const months = [
  'Jan',
  'Feb',
  'Mar',
  'April',
  'May',
  'Jun',
  'July',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const getDateObject = (date) => {
  let hour = date.getHours();
  const minute = date.getMinutes();
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  let meridian = 'AM';

  // fixing meridian
  if (hour >= 12 || hour <= 23) {
    meridian = 'PM';
  }
  // fixing hours
  if (hour === 0) hour = 12;
  if (hour > 12) hour -= 12;

  return {
    time: `${roundDigit(hour, 2)}:${roundDigit(minute, 2)} ${meridian}`,
    date: `${month} ${day}, ${year}`,
  };
};
module.exports = { roundDigit, getDateObject };
