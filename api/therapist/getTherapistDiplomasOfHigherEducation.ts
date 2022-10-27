import { DiplomaServiceWithToken } from 'api/services';
import { ApiResponseSuccess } from 'api/types';
import { GetTherapistDiplomasOfHigherEducation, ListDiplomaOfHigherEducation, Uuid } from 'generated';

export const getTherapistDiplomasOfHigherEducation = (
  therapistId: Uuid,
): ApiResponseSuccess<ListDiplomaOfHigherEducation> => {
  return DiplomaServiceWithToken.getTherapistDiplomasOfHigherEducation({
    requestBody: {
      arguments: { therapistId },
    },
  });
};
