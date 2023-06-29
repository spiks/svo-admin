import { TherapistServiceWithToken } from 'api/services';
import { MainSpecialization, ProblemsUuidList } from 'generated';

export const updateTherapistProblems = async (therapistId: string, problemIds: ProblemsUuidList) => {
  return TherapistServiceWithToken.updateTherapistProblems({
    requestBody: {
      arguments: {
        therapistId,
        problemIds,
      },
    },
  });
};
