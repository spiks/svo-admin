import { AdminBlogServiceWithToken } from 'api/services';
import { BlogArticleRejectionReason, Uuid } from '../../generated';

export type AdminRejectBlogArticle = {
  id: Uuid;
  rejectionReason: BlogArticleRejectionReason;
};

export const rejectArticle = async (request: AdminRejectBlogArticle) => {
  return AdminBlogServiceWithToken.rejectArticle({ requestBody: { arguments: request } });
};
