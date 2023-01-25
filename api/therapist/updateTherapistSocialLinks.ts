import { TherapistServiceWithToken } from 'api/services';
import { SocialLinks } from './getTherapistSocialLinks';

export const updateTherapistSocialLinks = async (socialLinks: SocialLinks, therapistId: string) => {
  return TherapistServiceWithToken.updateTherapistSocialLinks({
    requestBody: { arguments: { therapistId, ...socialLinks } },
  });
};
