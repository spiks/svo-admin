import { AdminBlogServiceWithToken } from 'api/services';
import { BlogArticleTitle, MarkdownLongText, UploadedFileToken } from 'generated';
import { BlogArticleShortText } from 'generated/models/BlogArticleShortText';
import { BlogArticleTagUuids } from 'generated/models/BlogArticleTagUuids';

export type AdminSubmitBlogArticle = {
  cover: UploadedFileToken | null;
  title: BlogArticleTitle;
  showPreviewFromArticle: boolean;
  showInBlockInterestingAndUseful: boolean;
  shortText: BlogArticleShortText;
  text: MarkdownLongText;
  tags: BlogArticleTagUuids;
};

export const submitBlogArticle = async (request: AdminSubmitBlogArticle) => {
  return AdminBlogServiceWithToken.submitBlogArticle({ requestBody: { arguments: { ...request } } });
};
