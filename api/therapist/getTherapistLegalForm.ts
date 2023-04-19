import { TherapistServiceWithToken } from 'api/services';
import { ApiResponseSuccess } from 'api/types';
import { IndividualEntrepreneur, SelfEmployed } from 'generated';

export const getTherapistLegalForm = (
  therapistId: string,
): ApiResponseSuccess<{ legalForm: SelfEmployed | IndividualEntrepreneur | null }> => {
  return TherapistServiceWithToken.getTherapistLegalForm({
    requestBody: {
      arguments: {
        therapistId,
      },
    },
  });
};
