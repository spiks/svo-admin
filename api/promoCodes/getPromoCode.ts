import { PromoCodesServiceWithToken } from 'api/services';
import { ApiResponseSuccess } from 'api/types';
import { GetPromoCodeRequestSchema, GetPromoCodeResponseSchema } from 'generated';

export const getPromoCode = (request: GetPromoCodeRequestSchema): ApiResponseSuccess<GetPromoCodeResponseSchema> => {
  return PromoCodesServiceWithToken.getPromoCode({
    requestBody: {
      arguments: request,
    },
  });
};
