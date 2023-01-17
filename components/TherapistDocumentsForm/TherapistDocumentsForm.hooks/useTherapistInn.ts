import { useMutation, useQuery } from '@tanstack/react-query';
import { InnServiceWithToken } from '../../../api/services';
import { notification } from 'antd';
import { useCallback, useMemo } from 'react';
import { InnInformation } from '../../../generated';
import { useQueryInitialLoading } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useQueryInitialLoading';

export function useTherapistInn(therapistId: string) {
  const query = useQuery(
    ['THERAPIST', therapistId, 'INN'],
    () => {
      return InnServiceWithToken.getTherapistInn({
        requestBody: {
          arguments: {
            therapistId,
          },
        },
      });
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

  const updateInn = useMutation(
    (values: InnInformation) => {
      return InnServiceWithToken.updateTherapistInn({
        requestBody: {
          arguments: {
            therapistId,
            innInformation: values,
          },
        },
      });
    },
    {
      onSuccess: () => {
        notification.success({
          message: 'ИНН',
          description: 'Данные успешно обновлены',
        });
        refetch();
      },
      onError: (err: Error) => {
        notification.error({
          message: 'ИНН',
          description: err.message,
        });
      },
    },
  );

  const approveInn = useMutation(
    () => {
      return InnServiceWithToken.acceptTherapistInn({
        requestBody: {
          arguments: {
            therapistId,
          },
        },
      });
    },
    {
      onSuccess: () => {
        notification.success({
          message: 'ИНН',
          description: 'Документ подтверждён',
        });
        refetch();
      },
      onError: (err: Error) => {
        notification.error({
          message: 'ИНН',
          description: err.message,
        });
      },
    },
  );

  const rejectInn = useMutation(
    () => {
      return InnServiceWithToken.rejectTherapistInn({
        requestBody: {
          arguments: {
            therapistId,
          },
        },
      });
    },
    {
      onSuccess: () => {
        notification.success({
          message: 'ИНН',
          description: 'Документ отклонён',
        });
        refetch();
      },
      onError: (err: Error) => {
        notification.error({
          message: 'ИНН',
          description: err.message,
        });
      },
    },
  );

  const firstTimeLoading = useQueryInitialLoading(query);
  const isMutating = [updateInn.status, approveInn.status, rejectInn.status].includes('loading');

  return useMemo(() => {
    return {
      inn: query.data?.data,
      updateInn,
      approveInn,
      rejectInn,
      isMutating,
      isFirstLoading: firstTimeLoading,
      query,
    };
  }, [approveInn, firstTimeLoading, isMutating, query, rejectInn, updateInn]);
}
