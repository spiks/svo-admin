import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTherapistById } from '../api/therapist/getTherapistById';
import { useCallback, useMemo } from 'react';
import { getTherapistDocuments } from '../api/therapist/getTherapistDocuments';

export function useTherapistSignupQueries(therapistId: string) {
  const therapistQuery = useQuery(['therapist', therapistId], getTherapistById.bind(null, therapistId));
  const documentsQuery = useQuery(
    ['therapist', 'documents', therapistId],
    getTherapistDocuments.bind(null, therapistId),
  );

  return useMemo(() => {
    return {
      isError: therapistQuery.isError || documentsQuery.isError,
      isLoading: therapistQuery.isLoading || documentsQuery.isLoading,
      therapist: therapistQuery.data?.data,
      documents: documentsQuery.data,
    };
  }, [therapistQuery, documentsQuery]);
}

export function useTherapistSignupQueriesRefresh(therapistId: string) {
  const client = useQueryClient();

  return useCallback(
    async (type: 'therapist' | 'documents') => {
      const queryKey = type === 'therapist' ? ['therapist', therapistId] : ['therapist', 'documents', therapistId];
      return client.invalidateQueries(queryKey);
    },
    [client, therapistId],
  );
}
