import { TherapistServiceWithToken } from 'api/services';

export const updateTherapistSpecializations = async (
  therapistId: string,
  specializations: string[],
  additionalSpecializations: string | null,
) => {
  return TherapistServiceWithToken.updateTherapistSpecializations({
    requestBody: {
      arguments: {
        therapistId,
        specializations,
        additionalSpecializations: additionalSpecializations || null,
      },
    },
  });
};
