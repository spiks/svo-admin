import { useMutation, useQuery } from '@tanstack/react-query';
import { notification } from 'antd';
import { getTherapistPaymentInformation } from 'api/therapist/getTherapistPaymentInformation';
import { updateTherapistPaymentInformation } from 'api/therapist/updateTherapistPaymentInformation';
import { PaymentInformation } from 'generated';
import { useCallback, useMemo } from 'react';

export function useTherapistPaymentInformation(therapistId: string) {
  const query = useQuery(
    ['payment', therapistId],
    () => {
      return getTherapistPaymentInformation(therapistId);
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

  const refetch = useCallback(async () => {
    await query.refetch();
  }, [query]);

  const updatePaymentInformation = useMutation(
    (values: PaymentInformation) => {
      return updateTherapistPaymentInformation(values, therapistId);
    },
    {
      onSuccess() {
        notification.success({
          message: 'Банковские реквизиты',
          description: 'Банковские реквизиты сохранены',
        });
        refetch();
      },
      onError() {
        notification.error({
          message: 'Банковские реквизиты',
          description: 'Не удалось сохранить банковские реквизиты',
        });
      },
    },
  );

  return useMemo(() => {
    return {
      paymentInformation: query.data?.data,
      updatePaymentInformation,
    };
  }, [query, updatePaymentInformation]);
}
