import moment from 'moment';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { NullableProperties } from '../../../utility/NullableProperties';

export function useBlogHeaderQueryParams(): NullableProperties<{
  search: string;
  tags: string | string[];
  publishDate: moment.Moment;
}> {
  const { query } = useRouter();

  return useMemo(() => {
    const search = (typeof query['search'] === 'string' && query['search']) || null;
    const tags = (Array.isArray(['tags']) && query['tags']) || null;
    const publishDate = (typeof query['publishDate'] === 'string' && moment(query['publishDate'])) || null;
    return {
      search,
      tags,
      publishDate,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query['search'], query['tags'], query['publishDate']]);
}
