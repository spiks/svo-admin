import { AdminBlogServiceWithToken } from 'api/services';
import { Uuid } from '../../generated';

export const publishArticle = async (id: Uuid) => {
  return AdminBlogServiceWithToken.publishArticle({ requestBody: { arguments: { id } } });
};
