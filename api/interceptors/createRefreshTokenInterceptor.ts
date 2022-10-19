import axios from 'axios';
import { TokenStorage } from '../../utility/tokenStorage';
import { AuthenticationService, IssuedAuthorizationCredentials } from '../../generated';
import { ApiRegularError } from '../errorClasses';

const isUnauthorizedTokenError = (err: unknown) => {
  return (
    err &&
    typeof err === 'object' &&
    Object.prototype.hasOwnProperty.call(err, 'error') &&
    err['error' as never]?.['type'] === 'unauthorized'
  );
};

export function createRefreshTokenInterceptor(onNewToken?: () => void) {
  const interceptor = axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: unknown) => {
      // Если не access_token_expired, то пропускаем ошибку
      if (!isTokenExpiredError(error)) {
        if (isUnauthorizedTokenError(error)) {
          TokenStorage.clearTokens();
          onNewToken && onNewToken();
        }
        return Promise.reject(error);
      }
      /*
       * https://stackoverflow.com/a/53294310
       * Впременно удаляем interceptor, чтобы при запросе нового токена
       * или retry запроса мы снова, не получили access_token_expired и не
       * попали в бесконечный цикл.
       */
      axios.interceptors.response.eject(interceptor);

      const refreshToken = TokenStorage.getTokens()?.refreshToken;

      if (!refreshToken) {
        return Promise.reject(error);
      }

      try {
        const refreshTokenResponse = await fetchNewToken(refreshToken);

        TokenStorage.setTokens(refreshTokenResponse.data);
        onNewToken?.();

        return retryFailedRequest(error, refreshTokenResponse);
      } catch (error) {
        TokenStorage.clearTokens();
        return Promise.reject(error);
      } finally {
        // Создаем interceptor, прослушивающий access_token_expired вновь, так как сверху мы его остановили,
        // чтобы он не вызвал зацикливания

        createRefreshTokenInterceptor(onNewToken);
      }
    },
  );

  return () => {
    return axios.interceptors.response.eject(interceptor);
  };
}

function isTokenExpiredError(response: unknown | undefined): response is ApiRegularError {
  return (
    !!response &&
    typeof response === 'object' &&
    response['status' as never] === 'error' &&
    response['error' as never]?.['type'] === 'access_token_expired'
  );
}

async function retryFailedRequest(
  error: ApiRegularError,
  refreshTokenResponse: { status: 'success'; data: IssuedAuthorizationCredentials },
) {
  const requestData = error.config.data;
  if (requestData) {
    const requestBody = JSON.parse(requestData);
    requestBody.accessToken = refreshTokenResponse.data.accessToken;
    error.config.data = requestBody;
  }

  return await axios.request(error.config);
}

async function fetchNewToken(refreshToken: string) {
  return (await AuthenticationService.refreshToken({
    requestBody: {
      arguments: {
        refreshToken,
      },
    },
  })) as { status: 'success'; data: IssuedAuthorizationCredentials };
}
