import { useQuery } from '@tanstack/react-query';

import { useCallback, useMemo } from 'react';

import { getPatient } from 'api/patient/getPatient';

export function usePatient(patientId: string) {
  const query = useQuery(['patient', patientId], () => {
    return getPatient(patientId);
  });

  const refetch = useCallback(async () => {
    await query.refetch();
  }, [query]);

  return useMemo(() => {
    return {
      isError: query.isError,
      isLoading: query.isLoading,
      patient: query.data?.data,
      refetch,
    };
  }, [query, refetch]);
}
