import { AdminBlogServiceWithToken } from 'api/services';
import { Uuid } from 'generated';

export const markBlogArticlesAsArchived = async (articles: Array<Uuid>) => {
  return AdminBlogServiceWithToken.markBlogArticlesAsArchived({
    requestBody: {
      arguments: { articles },
    },
  });
};
