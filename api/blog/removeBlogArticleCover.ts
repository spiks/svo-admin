import { AdminBlogServiceWithToken } from '../services';

type RequestParams = Parameters<typeof AdminBlogServiceWithToken.removeBlogArticleCover>[0]['requestBody']['arguments'];

export const removeBlogArticleCover = async (params: RequestParams) => {
  return AdminBlogServiceWithToken.removeBlogArticleCover({
    requestBody: {
      arguments: params,
    },
  });
};
