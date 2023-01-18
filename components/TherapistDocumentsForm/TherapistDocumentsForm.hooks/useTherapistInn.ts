import { useMutation, useQuery } from '@tanstack/react-query';
import { InnServiceWithToken } from '../../../api/services';
import { notification } from 'antd';
import { useCallback, useMemo } from 'react';
import { useQueryInitialLoading } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useQueryInitialLoading';
import { InnFormValues } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.documents/InnForm/InnForm.component';
import { ApiRegularError, ApiValidationError } from '../../../api/errorClasses';

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
      onError: (err: ApiRegularError | ApiValidationError) => {
        const isRegular = 'error' in err;
        const message = isRegular ? err.error.type : err.type;
        notification.error({
          message: 'ИНН',
          description: message,
        });
      },
    },
  );

  const refetch = useCallback(async () => {
    await query.refetch();
  }, [query]);

  const submitInn = useMutation(
    (values: InnFormValues) => {
      const document = values.document.find(Boolean);
      if (!document?.response) {
        throw new Error('Нельзя создать документ без файла');
      }

      const _values: Omit<InnFormValues, 'document'> & { document?: unknown } = { ...values };
      delete _values.document;

      return InnServiceWithToken.submitTherapistInn({
        requestBody: {
          arguments: {
            therapistId,
            innInformation: _values,
            innDocument: document.response?.token,
          },
        },
      });
    },
    {
      onSuccess: () => {
        notification.success({
          message: 'ИНН',
          description: 'Документ сохранён',
        });
        refetch();
      },
      onError: (err: ApiRegularError | ApiValidationError) => {
        const isRegular = 'error' in err;
        const message = isRegular ? err.error.type : err.type;
        notification.error({
          message: 'ИНН',
          description: message,
        });
      },
    },
  );

  const updateInn = useMutation(
    (values: InnFormValues) => {
      const _values: Omit<InnFormValues, 'document'> & { document?: unknown } = { ...values };
      delete _values.document;
      return InnServiceWithToken.updateTherapistInn({
        requestBody: {
          arguments: {
            therapistId,
            innInformation: _values,
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
      onError: (err: ApiRegularError | ApiValidationError) => {
        const isRegular = 'error' in err;
        const message = isRegular ? err.error.type : err.type;
        notification.error({
          message: 'ИНН',
          description: message,
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
      onError: (err: ApiRegularError | ApiValidationError) => {
        const isRegular = 'error' in err;
        const message = isRegular ? err.error.type : err.type;
        notification.error({
          message: 'ИНН',
          description: message,
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
      onError: (err: ApiRegularError | ApiValidationError) => {
        const isRegular = 'error' in err;
        const message = isRegular ? err.error.type : err.type;
        notification.error({
          message: 'ИНН',
          description: message,
        });
      },
    },
  );

  const firstTimeLoading = useQueryInitialLoading(query);
  const isMutating = [updateInn.status, approveInn.status, rejectInn.status, submitInn.status].includes('loading');

  return useMemo(() => {
    return {
      inn: query.data?.data,
      updateInn,
      approveInn,
      rejectInn,
      submitInn,
      isMutating,
      isFirstLoading: firstTimeLoading,
      query,
    };
  }, [approveInn, firstTimeLoading, isMutating, query, rejectInn, submitInn, updateInn]);
}
