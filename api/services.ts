import { provideToken } from './provideToken';
import {
  AccountService,
  AdminBlogService,
  DiplomaOfHigherEducationService,
  InnService,
  PassportService,
  PatientService,
  SnilsService,
  TherapistContractService,
  TherapistDocumentsService,
  TherapistInterviewService,
  TherapistService,
  UploadingFilesService,
} from '../generated';

export const PatientServiceWithToken = provideToken(PatientService);
export const TherapistServiceWithToken = provideToken(TherapistService);
export const AccountServiceWithToken = provideToken(AccountService);
export const PassportServiceWithToken = provideToken(PassportService);
export const InnServiceWithToken = provideToken(InnService);
export const DiplomaServiceWithToken = provideToken(DiplomaOfHigherEducationService);
export const SnilsServiceWithToken = provideToken(SnilsService);
export const TherapistDocumentsServiceWithToken = provideToken(TherapistDocumentsService);
export const TherapistInterviewServiceWithToken = provideToken(TherapistInterviewService);
export const TherapistContractServiceWithToken = provideToken(TherapistContractService);
export const UploadingFilesServiceWithToken = provideToken(UploadingFilesService);
export const AdminBlogServiceWithToken = provideToken(AdminBlogService);
