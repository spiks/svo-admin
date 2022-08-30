import { provideToken } from './provideToken';
import {
  AccountService,
  DiplomaOfHigherEducationService,
  InnService,
  PassportService,
  PatientService,
  SnilsService,
  TherapistService,
} from '../generated';

export const PatientServiceWithToken = provideToken(PatientService);

export const TherapistServiceWithToken = provideToken(TherapistService);

export const AccountServiceWithToken = provideToken(AccountService);

export const PassportServiceWithToken = provideToken(PassportService);

export const InnServiceWithToken = provideToken(InnService);

export const DiplomaServiceWithToken = provideToken(DiplomaOfHigherEducationService);

export const SnilsServiceWithToken = provideToken(SnilsService);
