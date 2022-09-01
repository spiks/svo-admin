import { TherapistContractServiceWithToken } from '../services';

export const acceptContract = async (therapistId: string) => {
  return TherapistContractServiceWithToken.acceptTherapistContract({
    requestBody: {
      arguments: {
        therapistId,
      },
    },
  });
};
