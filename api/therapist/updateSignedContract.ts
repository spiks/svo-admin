import { TherapistContractServiceWithToken } from 'api/services';

export const updateSignedContract = async (therapistId: string, contract: string) => {
  return await TherapistContractServiceWithToken.updateSignedContract({
    requestBody: { arguments: { therapistId, contract } },
  });
};
