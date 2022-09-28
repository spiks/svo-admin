import { AdminBlogServiceWithToken } from 'api/services';
import { ApiResponseSuccess } from 'api/types';
import { AdminBlogArticle, DateWithTimezone, Pagination, PaginationItemsAmount, Uuid } from 'generated';

type ListBlogArticlesRequest = {
  search: string | null;
  isArchived: boolean | null;
  tags: Array<Uuid> | null;
  publicationDate: DateWithTimezone | null;
  pagination: Pagination;
};

export const getListBlogArticles = (
  request: ListBlogArticlesRequest,
): ApiResponseSuccess<{
  items: AdminBlogArticle[];
  itemsAmount: PaginationItemsAmount;
}> => {
  return AdminBlogServiceWithToken.listBlogArticles({
    requestBody: {
      arguments: {
        ...request,
      },
    },
  });
};
