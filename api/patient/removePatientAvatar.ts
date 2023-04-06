import { PatientServiceWithToken } from 'api/services';

export const removePatientAvatar = async (id: string) => {
  return PatientServiceWithToken.removePatientAvatar({
    requestBody: {
      arguments: { id },
    },
  });
};
