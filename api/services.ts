import { provideToken } from './provideToken';
import {
  AccountService,
  AdminBlogService,
  AppointmentService,
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
  VideoPresentationService,
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
export const AppointmentServiceWithToken = provideToken(AppointmentService);
export const VideoPresentationWithToken = provideToken(VideoPresentationService);
