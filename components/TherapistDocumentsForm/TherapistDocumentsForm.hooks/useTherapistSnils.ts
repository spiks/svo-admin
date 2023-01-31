import { useMutation, useQuery } from '@tanstack/react-query';
import { SnilsServiceWithToken } from '../../../api/services';
import { notification } from 'antd';
import { useCallback, useMemo } from 'react';
import { useQueryInitialLoading } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useQueryInitialLoading';
import { SnilsFormValues } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.documents/SnilsForm/SnilsForm.component';

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

  const submitSnils = useMutation(
    (values: SnilsFormValues) => {
      const document = values.document.find(Boolean)?.response;
      if (!document?.token) {
        throw new Error('Для создания СНИЛС нужно загрузить документ!');
      }

      const _values: Omit<SnilsFormValues, 'document'> & { document?: unknown } = { ...values };
      delete _values.document;

      return SnilsServiceWithToken.submitTherapistSnils({
        requestBody: {
          arguments: {
            therapistId,
            snilsInformation: {
              ..._values,
            },
            snilsDocument: document.token,
          },
        },
      });
    },
    {
      onSuccess() {
        notification.success({
          message: 'СНИЛС',
          description: 'Документ сохранён',
        });
        refetch();
      },
      onError(err) {
        notification.error({
          message: 'СНИЛС',
          description: 'Не удалось сохранить документ: ' + err,
        });
      },
    },
  );

  const updateSnils = useMutation(
    (values: SnilsFormValues) => {
      const _values: Omit<SnilsFormValues, 'document'> & { document?: unknown } = { ...values };
      delete _values.document;
      return SnilsServiceWithToken.updateTherapistSnils({
        requestBody: {
          arguments: {
            therapistId,
            snilsInformation: _values,
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

  const deleteSnils = useMutation(
    () => {
      return SnilsServiceWithToken.deleteTherapistSnils({
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
          description: 'Документ удалён',
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
  const isMutating = [
    submitSnils.status,
    deleteSnils.status,
    updateSnils.status,
    approveSnils.status,
    rejectSnils.status,
  ].includes('loading');

  return useMemo(() => {
    return {
      snils: query.data?.data,
      updateSnils,
      approveSnils,
      rejectSnils,
      isMutating,
      deleteSnils,
      submitSnils,
      isFirstLoading: firstTimeLoading,
      query,
    };
  }, [approveSnils, deleteSnils, firstTimeLoading, isMutating, query, rejectSnils, submitSnils, updateSnils]);
}
