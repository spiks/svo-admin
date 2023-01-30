import { PatientServiceWithToken } from '../services';
import { ApiResponseSuccess } from '../types';
import { ListPatientsRequest, PatientListingPreview } from '../../generated';

export const getPatientList = (
  request: ListPatientsRequest,
): ApiResponseSuccess<{
  items: Array<PatientListingPreview>;
  itemsAmount: number;
}> => {
  return PatientServiceWithToken.listPatients({
    requestBody: {
      arguments: {
        ...request,
      },
    },
  });
};
