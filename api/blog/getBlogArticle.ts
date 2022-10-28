import { AdminBlogServiceWithToken } from 'api/services';
import { Uuid } from 'generated';
import { mediaImageMock } from '../mocks';

export const getBlogArticle = async (id: Uuid) => {
  return AdminBlogServiceWithToken.getBlogArticle({ requestBody: { arguments: { id } } });
};
