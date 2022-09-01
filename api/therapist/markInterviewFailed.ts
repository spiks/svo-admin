import { TherapistInterviewServiceWithToken } from '../services';

export const markInterviewFailed = async (therapistId: string) => {
  return TherapistInterviewServiceWithToken.markInterviewWithTherapistAsFailed({
    requestBody: {
      arguments: {
        therapistId,
      },
    },
  });
};
