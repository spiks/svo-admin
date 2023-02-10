import { TherapistContractServiceWithToken } from 'api/services';

export const updateSignedContract = async (therapistId: string, contract: string) => {
  return await TherapistContractServiceWithToken.updateTherapistSignedContract({
    requestBody: { arguments: { therapistId, contract } },
  });
};
