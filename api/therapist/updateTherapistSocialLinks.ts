import { TherapistServiceWithToken } from 'api/services';
import { SocialLinks } from './getTherapistSocialLinks';

export const updateTherapistSocialLinks = async (socialLinks: SocialLinks, therapistId: string) => {
  return TherapistServiceWithToken.updateTherapistSocialLinks({
    requestBody: {
      arguments: {
        therapistId,
        telegram: socialLinks.telegramLink,
        facebook: socialLinks.facebookLink,
        twitter: socialLinks.twitterLink,
        instagram: socialLinks.instagramLink,
        youtube: socialLinks.youtubeLink,
        vk: socialLinks.vkLink,
      },
    },
  });
};
