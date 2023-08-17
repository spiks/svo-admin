import { PromoCodesServiceWithToken } from 'api/services';
import { PromoCodeService, SubmitPromoCodeRequestSchema } from 'generated';

export const submitPromoCode = (request: SubmitPromoCodeRequestSchema) => {
  return PromoCodesServiceWithToken.submitPromoCode({ requestBody: { arguments: request } });
};
