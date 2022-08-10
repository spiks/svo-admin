import { PatientServiceWithToken } from '../services';
import { ApiResponseSuccess } from '../types';
import { PaginationCursor, PatientListingPreview } from '../../generated';

export const getPatientList = (
  fullName?: string,
  phone?: string,
  cursor?: number,
): ApiResponseSuccess<{
  items: Array<PatientListingPreview>;
  nextPageCursor: PaginationCursor;
}> => {
  return PatientServiceWithToken.listPatients({
    requestBody: {
      arguments: {
        search: {
          fullName: fullName || null,
          phone: phone || null,
        },
        nextPageCursor: cursor || null,
      },
    },
  }).catch(() => {
    return {
      status: 'success',
      data: {
        items: [
          {
            id: 'd274b02e-646c-4624-b623-8a75e75d4293',
            fullName: 'Степан Арвеладзе',
            phone: '+79110078079',
            profiles: ['therapist'],
            registrationDate: '1996-04-17',
            lastActivityDate: '1996-04-17',
          },
        ],
        nextPageCursor: 100,
      },
    };
  });
};
