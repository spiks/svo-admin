import { TherapistServiceWithToken } from '../services';

export const getTherapistById = async (id: string) => {
  return TherapistServiceWithToken.getTherapist({ requestBody: { arguments: { id } } });
};
