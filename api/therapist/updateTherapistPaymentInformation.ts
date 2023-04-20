import { TherapistServiceWithToken } from 'api/services';
import { PaymentInformation } from 'generated';

export const updateTherapistPaymentInformation = async (
  paymentInformation: PaymentInformation,
  therapistId: string,
) => {
  return TherapistServiceWithToken.updateTherapistPaymentInformation({
    requestBody: {
      arguments: {
        paymentInformation,
        therapistId,
      },
    },
  });
};
