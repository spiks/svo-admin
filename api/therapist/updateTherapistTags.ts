import { TherapistServiceWithToken } from 'api/services';

export const updateTherapistTags = async (therapistId: string, specializationTags: string[]) => {
  return TherapistServiceWithToken.updateTherapistTags({
    requestBody: {
      arguments: {
        therapistId,
        specializationTags,
      },
    },
  });
};
