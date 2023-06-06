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
  if (isLastDayOfMonth(date) || dayOfMonth < 8) {
    return {
      year: month === 11 ? year + 1 : year,
      month: (month + 1) % 12,
      period: '1',
    };
  } else {
    return {
      year,
      month,
      period: dayOfMonth >= 8 && dayOfMonth < 18 ? '2' : '3',
    };
  }
};
