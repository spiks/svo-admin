import { SnilsServiceWithToken } from 'api/services';
import { UpdateTherapistSnils } from 'generated';

export const updateTherapistSnils = async (request: UpdateTherapistSnils) => {
  return SnilsServiceWithToken.updateTherapistSnils({
    requestBody: {
      arguments: {
        ...request,
      },
    },
  });
};
