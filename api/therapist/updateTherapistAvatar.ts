import { TherapistServiceWithToken } from 'api/services';

export const updateTherapistAvatar = async (request: { therapistId: string; avatar: string }) => {
  return TherapistServiceWithToken.updateTherapistAvatar({ requestBody: { arguments: request } });
};
