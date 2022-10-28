import { AdminBlogServiceWithToken } from 'api/services';
import { Uuid } from 'generated';

export type AdminUpdateBlogArticleCover = {
  id: Uuid;
  cover: string;
};

export const updateBlogArticleCover = async (request: AdminUpdateBlogArticleCover) => {
  return AdminBlogServiceWithToken.updateBlogArticleCover({ requestBody: { arguments: request } });
};
