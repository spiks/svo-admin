import { PromoCodesServiceWithToken } from 'api/services';
import { UpdatePromoCodeRequestSchema } from 'generated';

export const updatePromoCode = (request: UpdatePromoCodeRequestSchema) => {
  return PromoCodesServiceWithToken.updatePromoCode({ requestBody: { arguments: request } });
};
