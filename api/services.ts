import { provideToken } from './provideToken';
import { AccountService, PatientService, TherapistService } from '../generated';

export const PatientServiceWithToken = provideToken(PatientService);

export const TherapistServiceWithToken = provideToken(TherapistService);

export const AccountServiceWithToken = provideToken(AccountService);
