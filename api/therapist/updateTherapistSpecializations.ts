import { TherapistServiceWithToken } from 'api/services';

export const updateTherapistSpecializations = async (
  therapistId: string,
  specializations: string[],
  additionalSpecializations: string | null,
  mainSpecialization: string | null,
) => {
  return TherapistServiceWithToken.updateTherapistSpecializations({
    requestBody: {
      arguments: {
        mainSpecialization,
        therapistId,
        specializations,
        additionalSpecializations: additionalSpecializations || null,
      },
    },
  });
};
