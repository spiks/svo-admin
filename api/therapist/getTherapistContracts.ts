import { TherapistContractServiceWithToken } from '../services';

export const getTherapistContracts = (therapistId: string) => {
  return TherapistContractServiceWithToken.getTherapistContract({
    requestBody: {
      arguments: {
        therapistId,
      },
    },
  });
};
