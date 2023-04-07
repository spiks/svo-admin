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
import { useQueryClient } from '@tanstack/react-query';
import { manageBlogArticleCover } from '../../../../helpers/manageBlogArticleCover';

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
    await manageBlogArticleCover(values?.cover, articleId, article?.cover || undefined);

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
      await push(`${NAVIGATION.blog}${values.isArchived ? '?activeTab=article_archived' : ''}`);
      form.resetFields();
    } catch (err) {
      notification.error({
        type: 'error',
        message: 'Ошибка',
        description: 'Не удалось изменить статью. Проверьте, все ли поля заполнены верно.',
      });
    }
  }, [form, articleId, article?.cover, client, push]);

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
            Редактировать
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
