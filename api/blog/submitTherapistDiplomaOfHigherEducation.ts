import { DiplomaServiceWithToken } from 'api/services';
import { AdminSubmitDiplomaOfHigherEducation } from 'generated';

export const submitTherapistDiplomaOfHigherEducation = async (request: AdminSubmitDiplomaOfHigherEducation) => {
  return DiplomaServiceWithToken.submitTherapistDiplomaOfHigherEducation({
    requestBody: {
      arguments: { ...request },
    },
  });
};
