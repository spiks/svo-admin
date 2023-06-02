import { PayoutServiceWithToken } from 'api/services';
import { PayoutPeriod } from 'generated';

export const getPayoutReportForPeriod = (request: PayoutPeriod) => {
  return PayoutServiceWithToken.getPayoutReportForPeriod({ requestBody: { arguments: request } });
};
