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
  }).catch(() => {
    return {
      status: 'success',
      data: {
        items: [
          {
            id: 'd274b02e-646c-4624-b623-8a75e75d429322',
            fullName: 'Степан Арвеладзе',
            phone: '+79110078079',
            profiles: ['therapist'],
            registrationDate: '1996-04-17',
          },
          {
            id: 'd274b02e-646c-4624-b623-8a75e75d42932',
            fullName: 'Степан Арвеладзе',
            phone: '+79110078079',
            profiles: ['therapist'],
            registrationDate: '1996-04-17',
          },
          {
            id: 'd274b02e-646c-4624-b623-8a75e75d42932232',
            fullName: 'Степан Арвеладзе',
            phone: '+79110078079',
            profiles: ['therapist'],
            registrationDate: '1996-04-17',
          },
        ],
        itemsAmount: 100,
      },
    };
  });
};
