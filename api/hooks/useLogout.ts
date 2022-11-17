import { revokeToken } from '../../api/auth/revokeToken';
import { ApiValidationError } from '../../api/errorClasses';
import { TokenStorage } from '../../utility/tokenStorage';
import { NAVIGATION } from '../../constants/navigation';

export const useLogout = () => {
  return async () => {
    try {
      const token = TokenStorage.getTokens()?.accessToken;
      if (!token) {
        return;
      }
      await revokeToken(token);

      TokenStorage.clearTokens();
      window.location.href = NAVIGATION.login;
    } catch (err) {
      if (!(err instanceof ApiValidationError)) {
        console.error('Неизвестная ошибка');
        return;
      }
    }
  };
};
