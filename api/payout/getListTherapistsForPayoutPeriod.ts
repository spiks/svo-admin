import { PayoutServiceWithToken } from 'api/services';
import { ListTherapistsForPayoutPeriodRequestSchema } from 'generated/models/ListTherapistsForPayoutPeriodRequestSchema';

export const getListTherapistsForPayoutPeriod = (request: ListTherapistsForPayoutPeriodRequestSchema) => {
  return PayoutServiceWithToken.listTherapistsForPayoutPeriod({ requestBody: { arguments: request } });
};
