import { PayoutServiceWithToken } from 'api/services';
import { GetFinalAmountForPayoutPeriodRequestSchema } from 'generated';

export const getFinalAmountForPayoutPeriod = (request: GetFinalAmountForPayoutPeriodRequestSchema) => {
  return PayoutServiceWithToken.getFinalAmountForPayoutPeriod({ requestBody: { arguments: request } });
};
