import { PayoutServiceWithToken } from 'api/services';
import { GetTherapistPersonalPayoutReportRequestSchema } from 'generated';

export const getTherapistPersonalPayoutReport = (request: GetTherapistPersonalPayoutReportRequestSchema) => {
  return PayoutServiceWithToken.getTherapistPersonalPayoutReport({ requestBody: { arguments: request } });
};
