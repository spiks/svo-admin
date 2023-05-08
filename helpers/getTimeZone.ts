export const getTimeZone = (date: Date) => {
  const currentFullDate = date.toString();
  return getTimeZoneToString(currentFullDate);
};

const getTimeZoneToString = (date: string) => {
  const timeZone = date.match(/[+|-]\d{4}/gm)?.[0];

  const firstString = timeZone?.slice(0, 3);
  const secondString = timeZone?.slice(3, 5);

  return firstString + ':' + secondString;
};
