import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTherapistVideoPresentation } from 'api/therapist/getTherapistVideoPresentation';
import { Uuid } from 'generated';
import { useCallback, useMemo } from 'react';

export function useVideoPresengtationQuery(therapistId: Uuid) {
  const { data, isLoading, isError } = useQuery(
    ['videoPresentation', therapistId],
    getTherapistVideoPresentation.bind(null, therapistId),
  );

  return useMemo(() => {
    return {
      isLoading,
      isError,
      videoPresentation: data?.data,
    };
  }, [isLoading, isError, data]);
}

export function useVideoPresentationRefresh(therapistId: string) {
  const client = useQueryClient();

  return useCallback(() => {
    return client.invalidateQueries(['videoPresentation', therapistId]);
  }, [client, therapistId]);
}
