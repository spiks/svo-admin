import { REGEXP_EMAIL } from '../constants/regexp';

export const validateEmail = (emailString: string): boolean => {
  const emailParts = emailString.split('@');

  const account = emailParts[0];
  const address = emailParts[1];

  if (account.length > 64) return false;
  else if (address.length > 255) return false;

  const domainParts = address.split('.');

  if (
    domainParts.some(function (part) {
      return part.length > 63;
    })
  )
    return false;
  return REGEXP_EMAIL.test(emailString);
};
