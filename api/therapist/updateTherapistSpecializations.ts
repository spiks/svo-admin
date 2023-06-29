import { TherapistServiceWithToken } from 'api/services';
import { MainSpecialization } from 'generated';

export const updateTherapistSpecializations = async (
  therapistId: string,
  additionalSpecializations: string | null,
  mainSpecialization: MainSpecialization | null,
) => {
  return TherapistServiceWithToken.updateTherapistSpecializations({
    requestBody: {
      arguments: {
        therapistId,
        additionalSpecializations: additionalSpecializations || null,
        mainSpecialization: mainSpecialization || null,
      },
    },
  });
};
