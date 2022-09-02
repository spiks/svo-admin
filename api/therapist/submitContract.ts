import { TherapistContractServiceWithToken } from '../services';

export const submitContract = async (therapistId: string, fileToken: string) => {
  return TherapistContractServiceWithToken.submitTherapistContract({
    requestBody: {
      arguments: {
        therapistId,
        contract: fileToken,
      },
    },
  });
};
