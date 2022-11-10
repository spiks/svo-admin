import { FormInstance, notification, UploadFile } from 'antd';
import { AdminUpdateBlogArticle } from '../api/blog/updateBlogArticle';
import { useQuery } from '@tanstack/react-query';
import { getBlogArticle } from '../api/blog/getBlogArticle';
import { AdminBlogArticle } from '../generated';

export const useGetBlogArticle = (
  form: FormInstance<AdminUpdateBlogArticle & { cover: UploadFile[] }>,
  articleId: string,
): [AdminBlogArticle | undefined, () => Promise<unknown>] => {
  const { data: article, refetch } = useQuery(['blog-article', articleId], () => getBlogArticle(articleId), {
    onError: () =>
      notification.error({
        type: 'error',
        message: 'Ошибка',
        description: 'Непридвенная ошибка',
      }),
    onSuccess: (article) => {
      const cover: UploadFile[] = [];
      const articleCover = article.data.cover?.sizes.small;
      if (articleCover) {
        cover.push({
          uid: '0',
          name: 'cover.webp',
          url: 'https://' + articleCover.url,
        });
      }

      form.setFieldsValue({
        title: article?.data.title,
        tags: article?.data.tags,
        shortText: article?.data.shortText || undefined,
        text: article?.data.text,
        id: article?.data.id,
        showPreviewFromArticle: article?.data.showPreviewFromArticle,
        showInBlockInterestingAndUseful: article?.data.showInBlockInterestingAndUseful,
        isArchived: article?.data.isArchived,
        cover,
      });
    },
  });

  return [article?.data, refetch];
};
