import { TherapistServiceWithToken } from '../services';
import { ApiResponseSuccess } from '../types';
import { ListTherapistsRequest, TherapistListingPreview } from '../../generated';

export const getTherapistList = (
  request: ListTherapistsRequest,
): ApiResponseSuccess<{
  items: Array<TherapistListingPreview>;
  itemsAmount: number;
}> => {
  return TherapistServiceWithToken.listTherapists({
    requestBody: {
      arguments: {
        ...request,
      },
    },
  });
};
