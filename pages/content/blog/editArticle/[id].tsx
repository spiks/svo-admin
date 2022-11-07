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
import { updateBlogArticleCover } from '../../../../api/blog/updateBlogArticleCover';

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
  const article = useGetBlogArticle(form, articleId);
  const { back, push } = useRouter();
  const [uploadedFileToken, setUploadedFileToken] = useState<string | undefined>();

  const handleTabListChange = useCallback((key) => {
    setActiveTab(key);
  }, []);

  const onFinish: FormProps<AdminUpdateBlogArticle>['onFinish'] = useCallback(async () => {
    const values: AdminUpdateBlogArticle = form.getFieldsValue(true);

    try {
      await updateBlogArticle({ ...values, shortText: values.shortText ?? null });
      notification.success({
        type: 'success',
        message: 'Успех',
        description: 'Статья успешно изменена',
      });
      await push(NAVIGATION.blog);
      form.resetFields();
    } catch (err) {
      notification.error({
        type: 'error',
        message: 'Ошибка',
        description: 'Не удалось изменить статью. Проверьте, все ли поля заполнены верно.',
      });
    }
  }, [form, push]);

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
