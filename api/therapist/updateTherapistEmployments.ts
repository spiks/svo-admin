import { TherapistServiceWithToken } from 'api/services';
import { TherapistEmployments } from 'generated';

export const updateTherapistEmployments = async (therapistId: string, employments: TherapistEmployments) => {
  return TherapistServiceWithToken.updateTherapistEmployments({
    requestBody: {
      arguments: {
        therapistId,
        employments,
      },
    },
  });
};
