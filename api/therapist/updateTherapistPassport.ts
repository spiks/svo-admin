import { PassportServiceWithToken } from 'api/services';
import { UpdateTherapistPassport } from 'generated';

export const updateTherapistPassport = async (request: UpdateTherapistPassport) => {
  return PassportServiceWithToken.updateTherapistPassport({ requestBody: { arguments: { ...request } } });
};
