import { TherapistServiceWithToken } from 'api/services';
import { SocialLinks } from './getTherapistSocialLinks';

export const updateTherapistSocialLinks = async (socialLinks: SocialLinks, therapistId: string) => {
  return TherapistServiceWithToken.updateTherapistSocialLinks({
    requestBody: {
      arguments: {
        therapistId,
        telegramLink: socialLinks.telegramLink,
        facebookLink: socialLinks.facebookLink,
        twitterLink: socialLinks.twitterLink,
        instagramLink: socialLinks.instagramLink,
        youtubeLink: socialLinks.youtubeLink,
        vkLink: socialLinks.vkLink,
      },
    },
  });
};
