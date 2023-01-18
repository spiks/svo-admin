import { useMutation } from '@tanstack/react-query';
import { notification } from 'antd';
import { TherapistServiceWithToken } from '../../../api/services';
import { RegisterTherapistForm } from '@components/RegisterTherapistModal/RegisterTherapistModal.component';
import { ApiRegularError } from '../../../api/errorClasses';

export type UseRegisterTherapistParameters = {
  onDone?: (therapistId: string) => void;
  // Аргумент message - сгенерированная описательная строка (semi-user-friendly)
  onFail?: (response: ApiRegularError, message: string) => void;
};

export function useRegisterTherapist({ onDone, onFail }: UseRegisterTherapistParameters) {
  return useMutation(
    (values: RegisterTherapistForm) => {
      return TherapistServiceWithToken.registerTherapist({
        requestBody: {
          arguments: {
            phone: values.phone,
          },
        },
      });
    },
    {
      onSuccess(resp, { phone }) {
        notification.success({
          message: 'Создание терапевта',
          description: `Терапевт с номером ${phone} создан`,
        });
        onDone && onDone(resp.data.therapistId);
      },
      onError(resp: ApiRegularError) {
        let message = `Неизвестная ошибка: ` + resp.error.type;
        const type = resp.error.type;
        switch (type) {
          case 'therapist_with_this_phone_already_exists':
            message = 'Терапевт с таким номером уже существует';
            break;
        }
        notification.error({
          message: 'Создание терапевта',
          description: message,
        });
        onFail && onFail(resp, message);
      },
    },
  );
}
