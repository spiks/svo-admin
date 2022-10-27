import { InnServiceWithToken } from 'api/services';
import { UpdateTherapistInn } from 'generated';

export const updateTherapistInn = async (request: UpdateTherapistInn) => {
  return InnServiceWithToken.updateTherapistInn({
    requestBody: {
      arguments: {
        ...request,
      },
    },
  });
};
