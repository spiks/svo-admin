import { TherapistServiceWithToken } from 'api/services';
import {
  Email,
  FullName,
  LongDescription,
  MediaImage,
  Phone,
  SpecializationsUuidList,
  Uuid,
  WorkExperienceYears,
} from 'generated';

export type UpdateTherapistRequestType = {
  id: Uuid;
  phone: Phone;
  specializations: SpecializationsUuidList;
  biography: LongDescription | null;
  fullName: FullName | null;
  email: Email | null;
  workExperienceYears: WorkExperienceYears | null;
  workPrinciples: LongDescription | null;
};

export const updateTherapist = (request: UpdateTherapistRequestType) => {
  return TherapistServiceWithToken.updateTherapist({
    requestBody: {
      arguments: { ...request },
    },
  });
};
