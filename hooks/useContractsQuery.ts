import { ContractFormValues } from '@components/TherapistContractSection/ContractForm/ContractForm.component';
import { SignedContractFormValues } from '@components/TherapistContractSection/SignedContractForm/SignedContractForm.component';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notification } from 'antd';
import { acceptContract } from 'api/therapist/acceptContract';
import { rejectContract } from 'api/therapist/rejectContract';
import { submitContract } from 'api/therapist/submitContract';
import { updateSignedContract } from 'api/therapist/updateSignedContract';
import { useCallback, useMemo } from 'react';
import { getTherapistContracts } from '../api/therapist/getTherapistContracts';

export function useContractsQuery(therapistId: string) {
  const client = useQueryClient();

  const { data, isLoading, isError } = useQuery(
    ['contracts', therapistId],
    getTherapistContracts.bind(null, therapistId),
  );

  const refetch = useCallback(() => {
    return client.invalidateQueries(['contracts', therapistId]);
  }, [client, therapistId]);

  const updateTherapistSignedContract = useMutation(
    (values: SignedContractFormValues) => {
      const document = values.signedContract.find(Boolean);
      if (!document?.response) {
        throw new Error('Нельзя создать документ без файла');
      }
      return updateSignedContract(therapistId, document.response.token);
    },
    {
      onSuccess: () => {
        notification.success({
          type: 'success',
          message: 'Успех',
          description: 'Контракт сохранен!',
        });
        refetch();
      },
      onError: (err: Error) => {
        notification.error({
          type: 'error',
          message: 'Ошибка',
          description: 'Не удалось сохранить контракт',
        });
      },
    },
  );

  const submitTherapistContract = useMutation(
    (values: ContractFormValues) => {
      const document = values.contract.find(Boolean);
      if (!document?.response) {
        throw new Error('Нельзя создать документ без файла');
      }
      return submitContract(therapistId, document.response.token);
    },
    {
      onSuccess: () => {
        notification.success({
          type: 'success',
          message: 'Успех',
          description: 'Контракт отправлен!',
        });
        refetch();
      },
      onError: (err: Error) => {
        notification.error({
          type: 'error',
          message: 'Ошибка',
          description: 'Не удалось отправить контракт',
        });
      },
    },
  );

  const therapistRejectContract = useMutation(
    () => {
      return rejectContract(therapistId);
    },
    {
      onSuccess: () => {
        notification.success({
          type: 'success',
          message: 'Успех',
          description: 'Контракт отклонен!',
        });
        refetch();
      },
      onError: (err: Error) => {
        notification.error({
          type: 'error',
          message: 'Ошибка',
          description: 'Не удалось отклонить контракт',
        });
      },
    },
  );

  const therapistAcceptContract = useMutation(
    () => {
      return acceptContract(therapistId);
    },
    {
      onSuccess: () => {
        notification.success({
          type: 'success',
          message: 'Успех',
          description: 'Контракт подтвержден!',
        });
        refetch();
      },
      onError: (err: Error) => {
        notification.error({
          type: 'error',
          message: 'Не удалось отклонить контракт',
          description: err.message,
        });
      },
    },
  );

  return useMemo(() => {
    return {
      isLoading,
      isError,
      contract: data?.data.contract ?? null,
      signedContract: data?.data.signedContract ?? null,
      therapistAcceptContract,
      therapistRejectContract,
      submitTherapistContract,
      updateTherapistSignedContract,
    };
  }, [
    isLoading,
    isError,
    data?.data.contract,
    data?.data.signedContract,
    submitTherapistContract,
    updateTherapistSignedContract,
    therapistRejectContract,
    therapistAcceptContract,
  ]);
}
