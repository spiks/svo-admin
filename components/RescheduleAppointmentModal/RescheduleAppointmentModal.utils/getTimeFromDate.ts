export const getTimeFromDate = (date: Date) => {
  const time = date.toLocaleTimeString('ru-RU').split(':');
  time.splice(-1);
  return time.join(':');
};
