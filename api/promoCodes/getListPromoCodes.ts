import { PromoCodesServiceWithToken } from 'api/services';
import { ApiResponseSuccess } from 'api/types';
import { ListPromoCodesRequestSchema, ListPromoCodesResponseSchema } from 'generated';

export const getListPromoCodes = (
  request: ListPromoCodesRequestSchema,
): ApiResponseSuccess<ListPromoCodesResponseSchema> => {
  return PromoCodesServiceWithToken.listPromoCodes({ requestBody: { arguments: request } });
};
