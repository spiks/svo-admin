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
import { AdminSubmitBlogArticle, submitBlogArticle } from '../../../../api/blog/submitBlogArticle';
import { TabKey, tabListItems } from '../../../../constants/blogTabs';
import { blogBreadcrumbItemRender } from '../../../../helpers/blogBreadcrumbItemRender';
import { NAVIGATION } from '../../../../constants/navigation';

const CreateArticleFormComponent = dynamic(() => import('@components/CreateArticleForm/CreateArticleForm.component'), {
  loading: () => <SplashScreenLoader />,
  ssr: false,
});

const routes: BreadcrumbProps['routes'] = [
  {
    path: '',
    breadcrumbName: 'Блог',
  },
  {
    path: 'createArticle',
    breadcrumbName: 'Создание статьи',
  },
];

const CreateArticlePage: NextPage = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('information');

  const { back, push } = useRouter();

  const handleTabListChange = useCallback((key) => {
    setActiveTab(key);
  }, []);

  const [form] = Form.useForm<AdminSubmitBlogArticle>();

  const onFinish: FormProps<AdminSubmitBlogArticle>['onFinish'] = useCallback(async () => {
    const values: AdminSubmitBlogArticle = form.getFieldsValue(true);
    try {
      await submitBlogArticle(values);
      notification.success({
        type: 'success',
        message: 'Успех',
        description: 'Статья успешно создана',
      });
      await push(NAVIGATION.blog);
      form.resetFields();
    } catch (err) {
      notification.error({
        type: 'error',
        message: 'Ошибка',
        description: 'Не удалось создать статью. Проверьте, все ли поля заполнены верно.',
      });
    }
  }, [form, push]);

  return (
    <MainLayout>
      <Header
        onBack={back}
        breadcrumb={{ routes, itemRender: blogBreadcrumbItemRender }}
        style={{ background: 'white' }}
        title={'Создание статьи'}
        extra={[
          <Button onClick={back} type="text" key="1">
            Закрыть
          </Button>,
          activeTab === 'article' ? (
            <Button onClick={() => onFinish(form.getFieldsValue())} type={'primary'} key="2">
              Опубликовать
            </Button>
          ) : null,
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
          <CreateArticleFormComponent
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

export default CreateArticlePage;
