import { UseQueryResult } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export function useQueryInitialLoading(query: UseQueryResult) {
  const [firstTimeLoading, setFirstTimeLoading] = useState(() => {
    return query.status === 'loading';
  });

  useEffect(() => {
    if (!firstTimeLoading && query.status === 'loading') {
      return;
    }
    setFirstTimeLoading(false);
  }, [firstTimeLoading, query.status]);

  return firstTimeLoading;
}
