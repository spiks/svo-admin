import { PayoutServiceWithToken } from 'api/services';
import { ListPayoutsForTherapistRequestSchema } from 'generated/models/ListPayoutsForTherapistRequestSchema';

export const getListPayoutsForTherapists = (request: ListPayoutsForTherapistRequestSchema) => {
  return PayoutServiceWithToken.listPayoutsForTherapist({ requestBody: { arguments: request } });
};
