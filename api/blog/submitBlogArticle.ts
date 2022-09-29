import { AdminBlogServiceWithToken } from 'api/services';
import { AdminSubmitBlogArticle } from 'generated';

export const submitBlogArticle = async (request: AdminSubmitBlogArticle) => {
  return AdminBlogServiceWithToken.submitBlogArticle({ requestBody: { arguments: { ...request } } });
};
