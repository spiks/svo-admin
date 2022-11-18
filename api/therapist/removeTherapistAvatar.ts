import { TherapistServiceWithToken } from 'api/services';

export const removeTherapistAvatar = async (id: string) => {
  return TherapistServiceWithToken.removeTherapistAvatar({
    requestBody: {
      arguments: { id },
    },
  });
};
