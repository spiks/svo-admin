import { Header } from '@components/Header/Header.component';
import { MainLayout } from '@components/MainLayout/MainLayout.component';
import { PageWrapper } from '@components/PageWrapper/PageWrapper.component';
import SplashScreenLoader from '@components/SplashScreenLoader/SplashScreenLoader.component';
import { TabList } from '@components/TabList/TabList.component';
import { BreadcrumbProps, Button, Form, FormProps, notification } from 'antd';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { AdminUpdateBlogArticle, updateBlogArticle } from '../../../../api/blog/updateBlogArticle';
import { TabKey, tabListItems } from '../../../../constants/blogTabs';
import { blogBreadcrumbItemRender } from '../../../../helpers/blogBreadcrumbItemRender';
import { useGetBlogArticle } from '../../../../hooks/useGetBlogArticle';
import { NAVIGATION } from '../../../../constants/navigation';
import { UploadFile } from 'antd/lib/upload/interface';
import { requestFileUploadUrl } from '../../../../api/upload/requestFileUploadUrl';
import { uploadFile } from '../../../../api/upload/uploadFile';
import { updateBlogArticleCover } from '../../../../api/blog/updateBlogArticleCover';
import { useQueryClient } from '@tanstack/react-query';
import { removeBlogArticleCover } from '../../../../api/blog/removeBlogArticleCover';

const EditArticleFormComponent = dynamic(() => import('@components/EditArticleForm/EditArticleForm.component'), {
  loading: () => <SplashScreenLoader />,
  ssr: false,
});

const getRoutes = (title: string): BreadcrumbProps['routes'] => [
  {
    path: '',
    breadcrumbName: 'Блог',
  },
  {
    path: 'editArticle',
    breadcrumbName: title,
  },
];

const EditArticlePage: NextPage = () => {
  const client = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabKey>('information');
  const { query } = useRouter();
  const articleId = (query['id'] as string) ?? '';
  const [form] = Form.useForm<AdminUpdateBlogArticle & { cover: UploadFile[] }>();
  const [article] = useGetBlogArticle(form, articleId);
  const { back, push } = useRouter();

  const handleTabListChange = useCallback((key) => {
    setActiveTab(key);
  }, []);

  /* Сабмит изменений статьи */
  const onFinish: FormProps<AdminUpdateBlogArticle>['onFinish'] = useCallback(async () => {
    const values: AdminUpdateBlogArticle & { cover: UploadFile[] } = form.getFieldsValue(true);

    // Этап №1: Обновляем обложку
    const isCoverChanged = Boolean(values?.cover?.[0]?.originFileObj);
    if (isCoverChanged) {
      const file = values.cover[0].originFileObj!;
      try {
        const { data: cred } = await requestFileUploadUrl('article_cover');
        const coverToken = (await uploadFile(cred, file)).data.token;
        await updateBlogArticleCover({
          id: values.id,
          cover: coverToken,
        });
      } catch (err) {
        console.error(err);
        notification.error({
          type: 'error',
          message: 'Ошибка',
          description: `Не удалось загрузить изображение.`,
        });
      }
    } else if (!isCoverChanged && !values.cover.length && article?.cover?.sizes) {
      try {
        await removeBlogArticleCover({ id: values.id });
      } catch (err) {
        console.error(err);
        notification.error({
          type: 'error',
          message: 'Ошибка',
          description: `Не удалось удалить обложку.`,
        });
      }
    }

    // Этап №2: Обновляем всё остальное
    try {
      await updateBlogArticle({ ...values, shortText: values.shortText ?? null });
      notification.success({
        type: 'success',
        message: 'Успех',
        description: 'Статья успешно изменена',
      });
      // Сбрасываем кэщ (обновляем статьи в списке)
      await client.invalidateQueries({ queryKey: ['articles'] });
      // Перенаправляем на список статьей
      await push(NAVIGATION.blog);
      form.resetFields();
    } catch (err) {
      notification.error({
        type: 'error',
        message: 'Ошибка',
        description: 'Не удалось изменить статью. Проверьте, все ли поля заполнены верно.',
      });
    }
  }, [form, article?.cover?.sizes, client, push]);

  return (
    <MainLayout>
      <Header
        onBack={back}
        breadcrumb={{ routes: getRoutes(article?.title || ''), itemRender: blogBreadcrumbItemRender }}
        style={{ background: 'white' }}
        title={article?.title}
        extra={[
          <Button onClick={back} type="text" key="1">
            Закрыть
          </Button>,
          <Button
            onClick={() => onFinish(form.getFieldsValue())}
            disabled={!(Boolean(form.getFieldValue('title')) && Boolean(form.getFieldValue('text')))}
            type={'primary'}
            key="2"
          >
            Опубликовать
          </Button>,
        ]}
      >
        <TabList
          activeKey={activeTab}
          items={tabListItems}
          defaultActiveKey={'active'}
          onChange={handleTabListChange}
        />
      </Header>
      <div style={{ overflow: 'auto' }}>
        <PageWrapper>
          <EditArticleFormComponent
            form={form}
            onFinish={onFinish}
            activeTab={activeTab}
            handleTabListChange={handleTabListChange}
          />
        </PageWrapper>
      </div>
    </MainLayout>
  );
};

export default EditArticlePage;
