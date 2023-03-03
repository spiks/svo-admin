import { TherapistServiceWithToken } from 'api/services';
import { ServicePricing } from 'generated';

export const updateTherapistServicePricing = (servicePricing: ServicePricing, therapistId: string) => {
  return TherapistServiceWithToken.updateTherapistServicePricing({
    requestBody: { arguments: { servicePricing, therapistId } },
  });
};
