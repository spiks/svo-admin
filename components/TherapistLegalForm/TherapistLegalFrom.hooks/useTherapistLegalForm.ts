import { useMutation, useQuery } from '@tanstack/react-query';
import { notification } from 'antd';
import { getTherapistLegalForm } from 'api/therapist/getTherapistLegalForm';
import { updateTherapistLegalForm } from 'api/therapist/updateTherapistLegalForm';
import { IndividualEntrepreneur, SelfEmployed } from 'generated';
import { useCallback, useMemo } from 'react';

export function useTherapistLegalForm(therapistId: string) {
  const query = useQuery(
    ['legal', therapistId],
    () => {
      return getTherapistLegalForm(therapistId);
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

  const updateLegalForm = useMutation(
    (values: SelfEmployed | IndividualEntrepreneur) => {
      return updateTherapistLegalForm(values, therapistId);
    },
    {
      onSuccess() {
        notification.success({
          message: 'Юридические данные',
          description: 'Юридические данные сохранены',
        });
        refetch();
      },
      onError() {
        notification.error({
          message: 'Юридические данные',
          description: 'Не удалось сохранить юридические данные',
        });
      },
    },
  );

  return useMemo(() => {
    return {
      legalForm: query.data?.data.legalForm,
      updateLegalForm,
    };
  }, [query, updateLegalForm]);
}
