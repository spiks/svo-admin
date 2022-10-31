import { ApiResponseSuccess } from 'api/types';
import { BlogArticleTag, BlogService } from 'generated';

export const getListBlogTags = () => {
  return BlogService.listBlogTags({
    requestBody: {},
  }) as ApiResponseSuccess<Array<BlogArticleTag>>;
};
