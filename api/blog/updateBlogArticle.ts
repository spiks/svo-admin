import { AdminBlogServiceWithToken } from 'api/services';
import { BlogArticleTitle, MarkdownLongText, Uuid } from 'generated';
import { BlogArticleShortText } from 'generated/models/BlogArticleShortText';
import { BlogArticleTagUuids } from 'generated/models/BlogArticleTagUuids';

export type AdminUpdateBlogArticle = {
  id: Uuid;
  title: BlogArticleTitle;
  showPreviewFromArticle: boolean;
  showInBlockInterestingAndUseful: boolean;
  isArchived: boolean;
  shortText: BlogArticleShortText;
  text: MarkdownLongText;
  tags: BlogArticleTagUuids;
};

export const updateBlogArticle = async (request: AdminUpdateBlogArticle) => {
  return AdminBlogServiceWithToken.updateBlogArticle({ requestBody: { arguments: { ...request } } });
};
