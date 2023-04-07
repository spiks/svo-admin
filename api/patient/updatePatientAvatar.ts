import { PatientServiceWithToken } from 'api/services';

export const updatePatientAvatar = async (request: { patientId: string; avatar: string }) => {
  return PatientServiceWithToken.updatePatientAvatar({ requestBody: { arguments: request } });
};
