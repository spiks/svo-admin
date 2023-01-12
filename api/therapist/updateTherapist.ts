import { TherapistServiceWithToken } from 'api/services';

export type UpdateTherapistRequestType = Parameters<
  typeof TherapistServiceWithToken.updateTherapist
>[0]['requestBody']['arguments'];

export const updateTherapist = (request: UpdateTherapistRequestType) => {
  return TherapistServiceWithToken.updateTherapist({
    requestBody: {
      arguments: { ...request },
    },
  });
};
