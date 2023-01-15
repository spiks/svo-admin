import { useMutation, useQuery } from '@tanstack/react-query';
import { SnilsServiceWithToken } from '../../../api/services';
import { notification } from 'antd';
import { useCallback, useMemo } from 'react';
import { SnilsInformation } from '../../../generated';
import { useQueryInitialLoading } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.hooks/useQueryInitialLoading';

export function useTherapistSnils(therapistId: string) {
  const query = useQuery(
    ['THERAPIST', therapistId, 'SNILS'],
    () => {
      return SnilsServiceWithToken.getTherapistSnils({
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

  const updateSnils = useMutation(
    (values: SnilsInformation) => {
      return SnilsServiceWithToken.updateTherapistSnils({
        requestBody: {
          arguments: {
            therapistId,
            snilsInformation: values,
          },
        },
      });
    },
    {
      onSuccess: () => {
        notification.success({
          message: 'СНИЛС',
          description: 'Данные успешно обновлены',
        });
        refetch();
      },
      onError: (err: Error) => {
        notification.error({
          message: 'СНИЛС',
          description: err.message,
        });
      },
    },
  );

  const approveSnils = useMutation(
    () => {
      return SnilsServiceWithToken.acceptTherapistSnils({
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
          message: 'СНИЛС',
          description: 'Данные успешно обновлены',
        });
        refetch();
      },
      onError: (err: Error) => {
        notification.error({
          message: 'СНИЛС',
          description: err.message,
        });
      },
    },
  );

  const rejectSnils = useMutation(
    () => {
      return SnilsServiceWithToken.rejectTherapistSnils({
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
          message: 'СНИЛС',
          description: 'Данные успешно обновлены',
        });
        refetch();
      },
      onError: (err: Error) => {
        notification.error({
          message: 'СНИЛС',
          description: err.message,
        });
      },
    },
  );

  const firstTimeLoading = useQueryInitialLoading(query);
  const isMutating = [updateSnils.status, approveSnils.status, rejectSnils.status].includes('loading');

  return useMemo(() => {
    return {
      snils: query.data?.data,
      updateSnils,
      approveSnils,
      rejectSnils,
      isMutating,
      isFirstLoading: firstTimeLoading,
      query,
    };
  }, [approveSnils, firstTimeLoading, isMutating, query, rejectSnils, updateSnils]);
}
