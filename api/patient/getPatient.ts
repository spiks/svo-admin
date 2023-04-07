import { PatientServiceWithToken } from 'api/services';

export const getPatient = async (id: string) => {
  return PatientServiceWithToken.getPatient({ requestBody: { arguments: { id } } });
};
