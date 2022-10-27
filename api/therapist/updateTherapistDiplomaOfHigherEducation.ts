import { DiplomaServiceWithToken } from 'api/services';
import { UpdateDiplomaOfHigherEducation } from 'generated';

export const updateTherapistDiplomaOfHigherEducation = async (request: UpdateDiplomaOfHigherEducation) => {
  return DiplomaServiceWithToken.updateTherapistDiplomaOfHigherEducation({
    requestBody: {
      arguments: { ...request },
    },
  });
};
