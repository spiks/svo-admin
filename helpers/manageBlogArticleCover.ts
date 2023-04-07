import { requestFileUploadUrl } from '../api/upload/requestFileUploadUrl';
import { uploadFile } from '../api/upload/uploadFile';
import { updateBlogArticleCover } from '../api/blog/updateBlogArticleCover';
import { notification, UploadFile } from 'antd';
import { removeBlogArticleCover } from '../api/blog/removeBlogArticleCover';
import { MediaImage } from '../generated';

export const manageBlogArticleCover = async (
  files: UploadFile[],
  articleId: string,
  defaultArticleCover?: MediaImage,
) => {
  const file = files[0]?.originFileObj;
  if (file) {
    try {
      const { data: cred } = await requestFileUploadUrl('article_cover');
      const coverToken = (await uploadFile(cred, file)).data.token;
      await updateBlogArticleCover({
        id: articleId,
        cover: coverToken,
      });
    } catch (err) {
      if (!(err instanceof Error)) {
        notification.error({
          type: 'error',
          message: 'Ошибка',
          description: `Неизвестная ошибка`,
        });
      }
    }
  } else if (!file && !files.length && defaultArticleCover?.sizes) {
    try {
      await removeBlogArticleCover({ id: articleId });
    } catch (err) {
      console.error(err);
      notification.error({
        type: 'error',
        message: 'Ошибка',
        description: `Не удалось удалить обложку.`,
      });
    }
  }
};
