import { TherapistServiceWithToken } from 'api/services';
import { Email, FullName, LongDescription, Phone, SpecializationsUuidList, Uuid, WorkExperienceYears } from 'generated';

export type UpdateTherapistRequestType = {
  id: Uuid;
  phone: Phone;
  specializations: SpecializationsUuidList;
  biography: LongDescription | null;
  fullName: FullName | null;
  email: Email | null;
  workExperienceYears: WorkExperienceYears | null;
  workPrinciples: LongDescription | null;
  creed: string | null;
  additionalSpecializations: string;
};

export const updateTherapist = (request: UpdateTherapistRequestType) => {
  return TherapistServiceWithToken.updateTherapist({
    requestBody: {
      arguments: { ...request },
    },
  });
};
