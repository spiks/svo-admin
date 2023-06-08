import { useQuery } from '@tanstack/react-query';
import { Form, notification } from 'antd';
import { getFinalAmountForPayoutPeriod } from 'api/payout/getFinalAmountForPayoutPeriod';
import { markPayoutPeriodAsPaid } from 'api/payout/markPayoutPeriodAsPaid';
import { PayoutPeriod } from 'generated';
import moment from 'moment';
import { useCallback, useMemo, useRef, useState } from 'react';
import { getPayoutReportForPeriod } from 'api/payout/getPayoutReportForPeriod';

export type TherapistsForPayoutListFiltersForm = {
  search?: string;
  date: moment.Moment;
  period: '1' | '2' | '3';
};

export const useTherapistsForPayoutListFilters = () => {
  const [form] = Form.useForm<TherapistsForPayoutListFiltersForm>();
  const [formFilters, setFormFilters] = useState<TherapistsForPayoutListFiltersForm>({
    search: undefined,
    date: moment(),
    period: '1',
  });

  const payoutPeriod: PayoutPeriod = useMemo(() => {
    return {
      month: formFilters.date.month() + 1,
      periodNumber: +formFilters.period,
      year: formFilters.date.year(),
    };
  }, [formFilters.period, formFilters.date]);

  const debounceTimerId = useRef<null | number>(null);

  const handleChangeFilters = useCallback(() => {
    const timerId = debounceTimerId.current;

    if (timerId) {
      clearTimeout(timerId);
    }

    debounceTimerId.current = +setTimeout(() => {
      setFormFilters(form.getFieldsValue());
    }, 1500);
  }, [form]);

  const { data: finalAmount, isFetching: isFetchingFinalAmount } = useQuery(
    ['finalAmount', payoutPeriod],
    () => {
      return getFinalAmountForPayoutPeriod(payoutPeriod);
    },
    {
      onError: (err: Error) => {
        notification.error({
          message: err.name,
          description: err.message,
        });
      },
    },
  );

  const { data: payoutReport, isFetching: isFetchingPayoutReport } = useQuery(['payoutReport', payoutPeriod], () => {
    return getPayoutReportForPeriod(payoutPeriod);
  });

  return useMemo(() => {
    return {
      form,
      handleChangeFilters,
      formFilters,
      finalAmount: finalAmount?.data.amount.amount,
      payoutReport: payoutReport?.data,
      isFetchingPayoutReport,
      isFetchingFinalAmount,
    };
  }, [
    form,
    handleChangeFilters,
    formFilters,
    finalAmount,
    payoutReport,
    isFetchingFinalAmount,
    isFetchingPayoutReport,
  ]);
};
