import { FormInstance, notification } from 'antd';
import { AdminUpdateBlogArticle } from '../api/blog/updateBlogArticle';
import { useQuery } from '@tanstack/react-query';
import { getBlogArticle } from '../api/blog/getBlogArticle';

export const useGetBlogArticle = (form: FormInstance<AdminUpdateBlogArticle>, articleId: string) => {
  const { data: article } = useQuery(['blog-article'], () => getBlogArticle(articleId), {
    onError: () =>
      notification.error({
        type: 'error',
        message: 'Ошибка',
        description: 'Непридвенная ошибка',
      }),
    onSuccess: (article) => {
      form.setFieldsValue({
        title: article?.data.title,
        tags: article?.data.tags,
        shortText: article?.data.shortText || undefined,
        text: article?.data.text,
        id: article?.data.id,
        showPreviewFromArticle: article?.data.showPreviewFromArticle,
        showInBlockInterestingAndUseful: article?.data.showInBlockInterestingAndUseful,
        isArchived: article?.data.isArchived,
      });
    },
  });

  return article?.data;
};
