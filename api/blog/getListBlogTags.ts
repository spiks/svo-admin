import { ApiResponseSuccess } from 'api/types';
import { BlogArticleTag, BlogService } from 'generated';

export const getListBlogTags = () => {
  try {
    return BlogService.listBlogTags({
      requestBody: {},
    }) as ApiResponseSuccess<Array<BlogArticleTag>>;
  } catch (err) {
    return {
      status: 'success',
      data: [
        {
          id: 'd274b02e-646c-4624-b623-8a75e75d4293',
          name: 'общая практика',
        },
      ],
    };
  }
};
