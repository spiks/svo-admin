export const getTimeZoneToString = (date: Date) => {
  const timeZone = date.toString().match(/[+|-]\d{4}/gm)?.[0];

  const firstString = timeZone?.slice(0, 3);
  const secondString = timeZone?.slice(3, 5);

  return firstString + ':' + secondString;
};
