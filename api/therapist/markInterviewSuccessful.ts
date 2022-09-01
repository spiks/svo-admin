import { TherapistInterviewServiceWithToken } from '../services';

export const markInterviewSuccessful = async (therapistId: string) => {
  return TherapistInterviewServiceWithToken.markInterviewWithTherapistAsSuccessful({
    requestBody: {
      arguments: {
        therapistId,
      },
    },
  });
};
