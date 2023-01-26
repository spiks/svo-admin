import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';
import { TherapistServiceWithToken } from '../api/services';
import { ApiRegularError, ApiValidationError } from '../api/errorClasses';
import { notification } from 'antd';

const getErrorDescription = (err: unknown) => {
  if (err instanceof ApiRegularError) {
    return err.status;
  } else if (err instanceof ApiValidationError) {
    return err.detail;
  } else if (err instanceof Error) {
    return err.message;
  }
  return 'Неизвестная ошибка, что-то пошло не так';
};

/**
 * Мутации для блокировки/разблокировки терапевта
 */
export function useTherapistBan() {
  const banTherapist = useMutation(
    (therapistId: string) => {
      return TherapistServiceWithToken.blockTherapist({
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
          message: 'Блокировка',
          description: 'Терапевт заблокирован!',
        });
      },
      onError: (err) => {
        let message = getErrorDescription(err);
        notification.error({
          message: 'Блокировка',
          description: 'Не удалось заблокировать терапевта: ' + message,
        });
      },
    },
  );

  const unbanTherapist = useMutation(
    (therapistId: string) => {
      return TherapistServiceWithToken.unblockTherapist({
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
          message: 'Разблокировка',
          description: 'Терапевт разблокирован!',
        });
      },
      onError: (err) => {
        let message = getErrorDescription(err);
        notification.error({
          message: 'Разблокировка',
          description: 'Не удалось разблокировать терапевта: ' + message,
        });
      },
    },
  );

  const isMutating = [banTherapist.status, unbanTherapist.status].includes('loading');

  return useMemo(() => {
    return {
      banTherapist,
      unbanTherapist,
      isMutating,
    };
  }, [banTherapist, isMutating, unbanTherapist]);
}
