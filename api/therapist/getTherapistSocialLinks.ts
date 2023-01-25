import { TherapistServiceWithToken } from 'api/services';
import { ApiResponseSuccess } from 'api/types';
import { Url } from 'generated';

export type SocialLinks = {
  telegramLink: Url | null;
  instagramLink: Url | null;
  vkLink: Url | null;
  youtubeLink: Url | null;
  facebookLink: Url | null;
  twitterLink: Url | null;
};

export const getTherapistSocialLinks = (therapistId: string): ApiResponseSuccess<SocialLinks> => {
  return TherapistServiceWithToken.getTherapistSocialLinks({
    requestBody: {
      arguments: {
        therapistId,
      },
    },
  });
};
