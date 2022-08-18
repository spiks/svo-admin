import { AuthenticationService, AuthorizationToken } from '../../generated';

export const revokeToken = (accessToken: AuthorizationToken) => {
  return AuthenticationService.revokeToken({ requestBody: { arguments: { accessToken } } });
};
