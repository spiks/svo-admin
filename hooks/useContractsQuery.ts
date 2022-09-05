import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getTherapistContracts } from '../api/therapist/getTherapistContracts';

export function useContractsQuery(therapistId: string) {
  const { data, isLoading, isError } = useQuery(
    ['contracts', therapistId],
    getTherapistContracts.bind(null, therapistId),
  );

  return useMemo(() => {
    return {
      isLoading,
      isError,
      contract: data?.data.contract ?? null,
      signedContract: data?.data.signedContract ?? null,
    };
  }, [isLoading, isError, data?.data.contract, data?.data.signedContract]);
}
