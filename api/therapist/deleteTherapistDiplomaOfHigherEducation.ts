import { DiplomaServiceWithToken } from 'api/services';
import { Uuid } from 'generated';

export const deleteTherapistDiplomaOfHigherEducation = async (diplomaId: Uuid) => {
  return DiplomaServiceWithToken.deleteTherapistDiplomaOfHigherEducation({
    requestBody: {
      arguments: {
        diplomaId,
      },
    },
  });
};
