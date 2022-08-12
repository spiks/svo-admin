import { provideToken } from './provideToken';
import { PatientService } from '../generated';

export const PatientServiceWithToken = provideToken(PatientService);
