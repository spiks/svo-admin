import { provideToken } from './provideToken';
import { PatientService, TherapistService } from '../generated';

export const PatientServiceWithToken = provideToken(PatientService);

export const TherapistServiceWithToken = provideToken(TherapistService);
