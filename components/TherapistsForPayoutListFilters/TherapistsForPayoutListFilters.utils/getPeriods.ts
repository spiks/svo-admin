import moment from 'moment';

export const getPeriods = (date: moment.Moment) => {
  const currentMonth = moment(date).format('MM');
  const endOfPrevMonth = moment(date).subtract(1, 'months').endOf('months').format('DD.MM');
  const endOfMonth = moment(date).endOf('months').format('DD.MM');

  const firstPeriod = `${endOfPrevMonth} - 9.${currentMonth}`;
  const secondPeriod = `9.${currentMonth} - 19.${currentMonth}`;
  const thirdPeriod = `19.${currentMonth} - ${endOfMonth}`;

  return {
    firstPeriod,
    secondPeriod,
    thirdPeriod,
  };
};
