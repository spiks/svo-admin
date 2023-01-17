import { useMutation, useQuery } from '@tanstack/react-query';
import { PassportServiceWithToken } from '../../../api/services';
import { useCallback, useMemo } from 'react';
import { PassportFormValues } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.documents/PassportForm/PassportForm.component';
import { usePassportFormConverter } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.documents/PassportForm/PassportForm.hooks/usePassportFormConverter';
import { notification } from 'antd';
import { useQueryInitialLoading } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useQueryInitialLoading';

export function useTherapistPassport(therapistId: string) {
  const query = useQuery(
    ['THERAPIST', therapistId, 'PASSPORT'],
    () => {
      return PassportServiceWithToken.getTherapistPassport({ requestBody: { arguments: { therapistId } } });
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

  const formToDto = usePassportFormConverter();

  const submitPassport = useMutation(
    (values: PassportFormValues) => {
      const document = values.document.find(Boolean);
      if (!document?.response?.token) {
        throw new Error('Для создания паспорта нужно загрузить документ!');
      }

      formToDto(values);

      return PassportServiceWithToken.submitTherapistPassport({
        requestBody: {
          arguments: {
            therapistId,
            information: formToDto(values),
            document: document.response?.token,
          },
        },
      });
    },
    {
      onSuccess() {
        notification.success({
          message: 'Паспорт',
          description: 'Документ сохранён',
        });
        refetch();
      },
      onError(err) {
        notification.error({
          message: 'Паспорт',
          description: 'Не удалось сохранить документ: ' + err,
        });
      },
    },
  );

  const updatePassport = useMutation(
    (values: PassportFormValues) => {
      return PassportServiceWithToken.updateTherapistPassport({
        requestBody: {
          arguments: {
            therapistId,
            information: formToDto(values),
          },
        },
      });
    },
    {
      onSuccess: () => {
        notification.success({
          message: 'Паспорт',
          description: 'Данные успешно обновлены',
        });
        refetch();
      },
      onError: (err: Error) => {
        notification.error({
          message: 'Паспорт',
          description: err.message,
        });
      },
    },
  );

  const approvePassport = useMutation(
    () => {
      return PassportServiceWithToken.acceptTherapistPassport({
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
          message: 'Паспорт',
          description: 'Документ подтверждён',
        });
        refetch();
      },
      onError: (err: Error) => {
        notification.error({
          message: 'Паспорт',
          description: err.message,
        });
      },
    },
  );

  const rejectPassport = useMutation(
    () => {
      return PassportServiceWithToken.rejectTherapistPassport({
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
          message: 'Паспорт',
          description: 'Документ отклонён',
        });
        refetch();
      },
      onError: (err: Error) => {
        notification.error({
          message: 'Паспорт',
          description: err.message,
        });
      },
    },
  );

  const firstTimeLoading = useQueryInitialLoading(query);
  const isMutating = [
    updatePassport.status,
    approvePassport.status,
    rejectPassport.status,
    submitPassport.status,
  ].includes('loading');

  return useMemo(() => {
    return {
      passport: query.data?.data,
      updatePassport,
      approvePassport,
      rejectPassport,
      isMutating,
      submitPassport,
      isFirstLoading: firstTimeLoading,
      query,
    };
  }, [approvePassport, firstTimeLoading, isMutating, query, rejectPassport, submitPassport, updatePassport]);
}
