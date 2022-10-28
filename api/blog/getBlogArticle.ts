import { AdminBlogServiceWithToken } from 'api/services';
import { Uuid } from 'generated';

export const getBlogArticle = async (id: Uuid) => {
  return AdminBlogServiceWithToken.getBlogArticle({ requestBody: { arguments: { id } } });
};
