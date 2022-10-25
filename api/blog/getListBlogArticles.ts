import { AdminBlogServiceWithToken } from 'api/services';
import { ApiResponseSuccess } from 'api/types';
import { AdminBlogArticle, DateWithTimezone, Pagination, PaginationItemsAmount, SearchQuery, Uuid } from 'generated';
import { ArticleBlogStatus } from 'generated/models/ArticleBlogStatus';

type ListBlogArticlesRequest = {
  status: ArticleBlogStatus | null;
  search: SearchQuery | null;
  isArchived: boolean;
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
