import { TherapistContractServiceWithToken } from '../services';

export const rejectContract = async (therapistId: string) => {
  return TherapistContractServiceWithToken.rejectTherapistContract({
    requestBody: {
      arguments: {
        therapistId,
      },
    },
  });
};
