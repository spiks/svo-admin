import { UsersQueryParams } from '../UsersHeader.typedef';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { NullableProperties } from '../../../utility/NullableProperties';

export function useUsersQueryParams(): NullableProperties<UsersQueryParams> {
  const { query } = useRouter();

  return useMemo(() => {
    const search = (typeof query['search'] === 'string' && query['search']) || null;
    const phone = (typeof query['phone'] === 'string' && query['phone']) || null;
    return {
      search,
      phone,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query['search'], query['phone']]);
}
