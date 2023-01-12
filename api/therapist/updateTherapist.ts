import { TherapistServiceWithToken } from 'api/services';
import {
  AdditionalSpecializations,
  Email,
  FullName,
  LongDescription,
  Phone,
  SpecializationsUuidList,
  TherapistEmployments,
  Uuid,
} from 'generated';

export type UpdateTherapistRequestType = {
  id: Uuid;
  phone: Phone;
  specializations: SpecializationsUuidList;
  additionalSpecializations: AdditionalSpecializations | null;
  biography: LongDescription | null;
  creed: LongDescription | null;
  fullName: FullName | null;
  email: Email | null;
  employments: TherapistEmployments;
  workPrinciples: LongDescription | null;
};

export const updateTherapist = (request: UpdateTherapistRequestType) => {
  return TherapistServiceWithToken.updateTherapist({
    requestBody: {
      arguments: { ...request },
    },
  });
};
