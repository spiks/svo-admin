import { TherapistDocumentsServiceWithToken } from '../services';

export const finishTherapistDocumentModeration = async (therapistId: string) => {
  return TherapistDocumentsServiceWithToken.finishTherapistDocumentsModeration({
    requestBody: {
      arguments: {
        therapistId,
      },
    },
  });
};
