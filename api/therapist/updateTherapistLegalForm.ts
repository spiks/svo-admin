import { TherapistServiceWithToken } from 'api/services';
import { IndividualEntrepreneur, SelfEmployed } from 'generated';
import { SocialLinks } from './getTherapistSocialLinks';

export const updateTherapistLegalForm = async (
  legalForm: SelfEmployed | IndividualEntrepreneur,
  therapistId: string,
) => {
  return TherapistServiceWithToken.updateTherapistLegalForm({
    requestBody: {
      arguments: {
        therapistId,
        legalForm,
      },
    },
  });
};
