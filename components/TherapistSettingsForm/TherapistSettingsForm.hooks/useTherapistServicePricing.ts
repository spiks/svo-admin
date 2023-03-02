import { useMutation, useQuery } from '@tanstack/react-query';
import { notification } from 'antd';
import { getTherapistServicePricing } from 'api/therapist/getTherapistServicePricing';
import { updateTherapistServicePricing } from 'api/therapist/updateTherapistServicePricing';
import { useCallback, useMemo } from 'react';

export type ServicePricingFormValues = {
  forIndividualSession: number | null;
  forPairSession: number | null;
};

export function useTherapistServicePricing(therapistId: string) {
  const query = useQuery(
    ['pricing', therapistId],
    () => {
      return getTherapistServicePricing(therapistId);
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

  const updateServicePricing = useMutation(
    (values: ServicePricingFormValues) => {
      const individualSessionCost = values.forIndividualSession ? +values.forIndividualSession : null;
      const pairSessionCost = values.forPairSession ? +values.forPairSession : null;
      return updateTherapistServicePricing(
        { forIndividualSession: individualSessionCost, forPairSession: pairSessionCost },
        therapistId,
      );
    },
    {
      onSuccess() {
        notification.success({
          message: 'Стоимость оказания услуг',
          description: 'Стоимость оказания услуг успешно изменена',
        });
        refetch();
      },
      onError() {
        notification.error({
          message: 'Стоимость оказания услуг',
          description: 'Не удалось изменить стоимость оказания услуг',
        });
      },
    },
  );

  return useMemo(() => {
    return {
      servicePricing: query.data?.data,
      updateServicePricing,
    };
  }, [query, updateServicePricing]);
}
