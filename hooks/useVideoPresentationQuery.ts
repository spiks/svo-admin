import { useQuery } from '@tanstack/react-query';
import { getTherapistVideoPresentation } from 'api/therapist/getTherapistVideoPresentation';
import { Uuid } from 'generated';
import { useMemo } from 'react';

export function useVideoPresentationQuery(therapistId: Uuid) {
  const { data, isLoading, isError, refetch } = useQuery(
    ['videoPresentation', therapistId],
    getTherapistVideoPresentation.bind(null, therapistId),
  );

  return useMemo(() => {
    return {
      isLoading,
      isError,
      refetch,
      videoPresentation: data?.data,
    };
  }, [isLoading, isError, refetch, data?.data]);
}
