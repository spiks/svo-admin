import moment from 'moment';

export const getPeriods = (date: moment.Moment) => {
  const currentMonth = moment(date).format('MM');
  const endOfPrevMonth = moment(date).subtract(1, 'months').endOf('months').format('DD.MM');
  const penultimateDayOfMonth = moment(date).endOf('months').subtract(1, 'days').format('DD.MM');

  const firstPeriod = `${endOfPrevMonth} - 8.${currentMonth}`;
  const secondPeriod = `9.${currentMonth} - 18.${currentMonth}`;
  const thirdPeriod = `19.${currentMonth} - ${penultimateDayOfMonth}`;

  return {
    firstPeriod,
    secondPeriod,
    thirdPeriod,
  };
};
