import { isLastDayOfMonth } from 'date-fns';

export type PeriodNumber = '1' | '2' | '3';

type PayoutPeriod = {
  year: number;
  month: number;
  period: PeriodNumber;
};

export const getPayoutPeriod = (date: Date): PayoutPeriod => {
  const dayOfMonth = date.getDate();
  const year = date.getFullYear();
  const month = date.getMonth();
  if (isLastDayOfMonth(date) || dayOfMonth < 9) {
    return {
      year: isLastDayOfMonth(date) && month === 11 ? year + 1 : year,
      month: isLastDayOfMonth(date) ? (month + 1) % 12 : month,
      period: '1',
    };
  } else {
    return {
      year,
      month,
      period: dayOfMonth >= 9 && dayOfMonth < 19 ? '2' : '3',
    };
  }
};
