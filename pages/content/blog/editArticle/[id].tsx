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
import { useQuery } from '@tanstack/react-query';
import { getBlogArticle } from '../../../../api/blog/getBlogArticle';
import { TabKey, tabListItems } from '../../../../constants/blogTabs';
import { blogBreadcrumbItemRender } from '../../../../helpers/blogBreadcrumbItemRender';

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
  const [activeTab, setActiveTab] = useState<TabKey>('information');
  const { query } = useRouter();
  const articleId = (query['id'] as string) ?? '';

  const [form] = Form.useForm<AdminUpdateBlogArticle>();

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
        cover: null,
        shortText: article?.data.shortText || undefined,
        text: article?.data.text,
        id: article?.data.id,
        showPreviewFromArticle: article?.data.showPreviewFromArticle,
        showInBlockInterestingAndUseful: article?.data.showPreviewFromArticle,
        isArchived: article?.data.showPreviewFromArticle,
      });
    },
  });

  const { back } = useRouter();

  const handleTabListChange = useCallback((key) => {
    setActiveTab(key);
  }, []);

  const onFinish: FormProps<AdminUpdateBlogArticle>['onFinish'] = useCallback(async () => {
    const values: AdminUpdateBlogArticle = form.getFieldsValue(true);
    try {
      await updateBlogArticle(values);
      notification.success({
        type: 'success',
        message: 'Успех',
        description: 'Статья успешно изменена',
      });
      form.resetFields();
    } catch (err) {
      notification.error({
        type: 'error',
        message: 'Ошибка',
        description: 'Не удалось изменить статью. Проверьте, все ли поля заполнены верно.',
      });
    }
  }, [form]);

  return (
    <MainLayout>
      <Header
        onBack={back}
        breadcrumb={{ routes: getRoutes(article?.data.title || ''), itemRender: blogBreadcrumbItemRender }}
        style={{ background: 'white' }}
        title={article?.data.title}
        extra={[
          <Button onClick={back} type="text" key="1">
            Закрыть
          </Button>,
          <Button onClick={() => onFinish(form.getFieldsValue())} type={'primary'} key="2">
            Сохранить
          </Button>,
        ]}
      >
        <TabList items={tabListItems} defaultActiveKey={'active'} onChange={handleTabListChange} />
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
