import { getListBlogTags } from '../api/blog/getListBlogTags';
import { useQuery } from '@tanstack/react-query';

export function useGetListBlogTags(onError: () => void) {
  const { data: tags } = useQuery(['tags'], getListBlogTags, {
    onError,
  });

  return tags?.data;
}
