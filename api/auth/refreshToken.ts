import { AuthenticationService, AuthorizationToken } from '../../generated';

export const refreshToken = (refreshToken: AuthorizationToken) => {
  return AuthenticationService.refreshToken({ requestBody: { arguments: { refreshToken } } });
};
