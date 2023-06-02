import { PayoutServiceWithToken } from 'api/services';
import { MarkPayoutPeriodAsPaidRequestSchema } from 'generated';

export const markPayoutPeriodAsPaid = (request: MarkPayoutPeriodAsPaidRequestSchema) => {
  return PayoutServiceWithToken.markPayoutPeriodAsPaid({ requestBody: { arguments: request } });
};
