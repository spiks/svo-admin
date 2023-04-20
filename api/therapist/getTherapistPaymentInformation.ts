import { TherapistServiceWithToken } from 'api/services';
import { ApiResponseSuccess } from 'api/types';
import { PaymentInformation } from 'generated';

export const getTherapistPaymentInformation = (therapistId: string): ApiResponseSuccess<PaymentInformation | null> => {
  return TherapistServiceWithToken.getTherapistPaymentInformation({
    requestBody: {
      arguments: {
        therapistId,
      },
    },
  });
};
