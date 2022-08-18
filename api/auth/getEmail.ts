import { AccountEmail } from '../../generated';
import { AccountServiceWithToken } from '../services';
import { ApiResponseSuccess } from '../types';

export const getEmail = (): ApiResponseSuccess<AccountEmail | null> => {
  return AccountServiceWithToken.getEmail({ requestBody: {} });
};
