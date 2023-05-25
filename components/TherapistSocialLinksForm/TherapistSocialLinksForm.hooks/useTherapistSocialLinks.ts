import { useMutation, useQuery } from '@tanstack/react-query';
import { notification } from 'antd';
import { getTherapistSocialLinks } from 'api/therapist/getTherapistSocialLinks';
import { updateTherapistSocialLinks } from 'api/therapist/updateTherapistSocialLinks';
import { Url } from 'generated';
import { useCallback, useMemo } from 'react';

export type SocialLinksFormValues = {
  telegramLink: Url | null;
  instagramLink: Url | null;
  vkLink: Url | null;
  youtubeLink: Url | null;
  facebookLink: Url | null;
  twitterLink: Url | null;
};

export function useTherapistSocialLinks(therapistId: string) {
  const query = useQuery(
    ['links', therapistId],
    () => {
      return getTherapistSocialLinks(therapistId);
    },
    {
      onError: (err: Error) => {
        notification.error({
          message: err.name,
          description: err.message,
        });
      },
    },
  );

  const refetch = useCallback(async () => {
    await query.refetch();
  }, [query]);

  const updateSocialLinks = useMutation(
    (values: SocialLinksFormValues) => {
      return updateTherapistSocialLinks(values, therapistId);
    },
    {
      onSuccess() {
        notification.success({
          message: 'Социальные сети',
          description: 'Социальные сети сохранены',
        });
        refetch();
      },
      onError() {
        notification.error({
          message: 'Социальные сети',
          description: 'Не удалось сохранить социальные сети',
        });
      },
    },
  );

  return useMemo(() => {
    return {
      socialLinks: query.data?.data,
      updateSocialLinks,
    };
  }, [query, updateSocialLinks]);
}
