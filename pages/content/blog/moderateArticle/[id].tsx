import { Header } from '@components/Header/Header.component';
import { MainLayout } from '@components/MainLayout/MainLayout.component';
import { PageWrapper } from '@components/PageWrapper/PageWrapper.component';
import SplashScreenLoader from '@components/SplashScreenLoader/SplashScreenLoader.component';
import { TabList } from '@components/TabList/TabList.component';
import { BreadcrumbProps, Button, Form, FormProps, notification, Tag } from 'antd';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import { AdminUpdateBlogArticle, updateBlogArticle } from '../../../../api/blog/updateBlogArticle';
import { useQuery } from '@tanstack/react-query';
import { getBlogArticle } from '../../../../api/blog/getBlogArticle';
import { TabKey, tabListItems } from '../../../../constants/blogTabs';
import { blogBreadcrumbItemRender } from '../../../../helpers/blogBreadcrumbItemRender';
import { publishArticle } from '../../../../api/blog/publishArticle';
import { RejectArticleModal } from '@components/RejectArticleModal/RejectArticleModal.component';
import { AdminRejectBlogArticle, rejectArticle } from '../../../../api/blog/rejectArticle';

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
    path: 'moderateArticle',
    breadcrumbName: title,
  },
];

const ModerateArticlePage: NextPage = () => {
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

  const handlePublishArticle = useCallback(async () => {
    try {
      await publishArticle(articleId);
      notification.success({
        type: 'success',
        message: 'Успех',
        description: 'Статья успешно опубликована',
      });
    } catch (err) {
      notification.error({
        type: 'error',
        message: 'Ошибка',
        description: 'Не удалось опубликовать статью',
      });
    }
  }, [articleId]);

  const editArticle: FormProps<AdminUpdateBlogArticle>['onFinish'] = useCallback(async () => {
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

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [rejectArticleForm] = Form.useForm<AdminRejectBlogArticle>();

  const handleRejectArticle = useCallback(async () => {
    try {
      await rejectArticle({ id: articleId, rejectionReason: rejectArticleForm.getFieldValue('rejectionReason') });
      notification.success({
        type: 'success',
        message: 'Успех',
        description: 'Статья не будет опубликована',
      });
      rejectArticleForm.resetFields();
    } catch (err) {
      notification.error({
        type: 'error',
        message: 'Ошибка',
        description: 'Не удалось отменить публикацию статьи.',
      });
    } finally {
      setIsModalVisible(false);
    }
  }, [articleId, rejectArticleForm]);

  const handleToggleModal = useCallback(() => {
    setIsModalVisible(!isModalVisible);
  }, [isModalVisible]);

  return (
    <MainLayout>
      <Header
        onBack={back}
        breadcrumb={{
          routes: getRoutes(article?.data.title || ''),
          itemRender: (route, params, routes) => blogBreadcrumbItemRender(route, params, routes),
        }}
        style={{ background: 'white' }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', columnGap: '12px' }}>
            {article?.data.title}
            <Tag
              key="1"
              color={'#FFFBE6'}
              style={{ border: '1px solid #FFE58F', borderRadius: '2px', color: '#D48806' }}
            >
              {'На модерации'}
            </Tag>
          </div>
        }
        extra={[
          <Button style={{ color: '#FF4D4F' }} onClick={handleToggleModal} type="text" key="1">
            Отклонить
          </Button>,
          <Button onClick={handlePublishArticle} type={'primary'} key="2">
            Опубликовать
          </Button>,
        ]}
      >
        <TabList items={tabListItems} defaultActiveKey={'active'} onChange={handleTabListChange} />
      </Header>
      <div style={{ overflow: 'auto' }}>
        <PageWrapper>
          <EditArticleFormComponent
            form={form}
            onFinish={editArticle}
            activeTab={activeTab}
            handleTabListChange={handleTabListChange}
          />
        </PageWrapper>
      </div>
      <RejectArticleModal
        open={isModalVisible}
        form={rejectArticleForm}
        rejectArticle={handleRejectArticle}
        onCancel={handleToggleModal}
      />
    </MainLayout>
  );
};

export default ModerateArticlePage;
