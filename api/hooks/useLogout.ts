import { useRouter } from 'next/router';
import { revokeToken } from '../../api/auth/revokeToken';
import { ApiValidationError } from '../../api/errorClasses';
import { ClientStorage } from '../../utility/clientStorage';
import { NAVIGATION } from '../../constants/navigation';

export const useLogout = () => {
  const { push } = useRouter();

  return async () => {
    try {
      const token = ClientStorage.getTokens()?.accessToken;
      if (!token) {
        return;
      }
      await revokeToken(token);

      ClientStorage.clearTokens();
      push(NAVIGATION.login);
    } catch (err) {
      if (!(err instanceof ApiValidationError)) {
        console.error('Неизвестная ошибка');
        return;
      }
    }
  };
};
