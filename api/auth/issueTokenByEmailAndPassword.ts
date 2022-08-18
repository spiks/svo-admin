import { AuthenticationService, Email, Password } from '../../generated';

export const issueToken = (email: Email, password: Password) => {
  return AuthenticationService.issueTokenByEmailAndPassword({
    requestBody: {
      arguments: {
        email,
        password,
      },
    },
  });
};
