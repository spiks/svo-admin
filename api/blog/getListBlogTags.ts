import { ApiResponseSuccess } from 'api/types';
import { BlogArticleTag, BlogService } from 'generated';

export const getListBlogTags = (): ApiResponseSuccess<Array<BlogArticleTag>> => {
  return BlogService.listBlogTags({
    requestBody: {},
  }) as ApiResponseSuccess<Array<BlogArticleTag>>;
};
