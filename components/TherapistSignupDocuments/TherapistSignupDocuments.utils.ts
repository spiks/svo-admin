import {
  DiplomaServiceWithToken,
  InnServiceWithToken,
  PassportServiceWithToken,
  SnilsServiceWithToken,
} from '../../api/services';

export const documentName: Record<string, string> = {
  passport: 'Паспорт',
  snils: 'СНИЛС',
  inn: 'ИНН',
  diploma: 'Диплом',
};

export const documentStateChangeMethods = {
  passport: {
    approve: PassportServiceWithToken.acceptTherapistPassport,
    reject: PassportServiceWithToken.rejectTherapistPassport,
  },
  snils: {
    approve: SnilsServiceWithToken.acceptTherapistSnils,
    reject: SnilsServiceWithToken.rejectTherapistSnils,
  },
  inn: {
    approve: InnServiceWithToken.acceptTherapistInn,
    reject: InnServiceWithToken.rejectTherapistInn,
  },
  diploma: {
    approve: DiplomaServiceWithToken.acceptTherapistDiplomaOfHigherEducation,
    reject: DiplomaServiceWithToken.rejectTherapistDiplomaOfHigherEducation,
  },
};
