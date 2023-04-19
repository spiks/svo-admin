import { TherapistServiceWithToken } from 'api/services';
import { MainSpecialization } from 'generated';

export const updateTherapistSpecializations = async (
  therapistId: string,
  specializations: string[],
  additionalSpecializations: string | null,
  mainSpecialization: MainSpecialization | null,
) => {
  return TherapistServiceWithToken.updateTherapistSpecializations({
    requestBody: {
      arguments: {
        therapistId,
        specializations,
        additionalSpecializations: additionalSpecializations || null,
        mainSpecialization: mainSpecialization || null,
      },
    },
  });
};
