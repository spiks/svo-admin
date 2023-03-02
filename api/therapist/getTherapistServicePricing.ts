import { TherapistServiceWithToken } from 'api/services';
import { ApiResponseSuccess } from 'api/types';
import { ServicePricing } from 'generated';

export const getTherapistServicePricing = (therapistId: string): ApiResponseSuccess<ServicePricing> => {
  return TherapistServiceWithToken.getTherapistServicePricing({ requestBody: { arguments: { therapistId } } });
};
