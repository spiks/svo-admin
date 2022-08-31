import {
  DiplomaServiceWithToken,
  InnServiceWithToken,
  PassportServiceWithToken,
  SnilsServiceWithToken,
} from '../services';

export const getTherapistDocuments = async (id: string) => {
  const [passport, inn, diploma, snils] = await Promise.all([
    PassportServiceWithToken.getTherapistPassport({ requestBody: { arguments: { therapistId: id } } }),
    InnServiceWithToken.getTherapistInn({ requestBody: { arguments: { therapistId: id } } }),
    DiplomaServiceWithToken.getTherapistDiplomasOfHigherEducation({
      requestBody: { arguments: { therapistId: id } },
    }),
    SnilsServiceWithToken.getTherapistSnils({ requestBody: { arguments: { therapistId: id } } }),
  ]);

  return {
    passport: passport.data,
    inn: inn.data,
    diploma: diploma.data[0] || null,
    snils: snils.data,
  };
};
