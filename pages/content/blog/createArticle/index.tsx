import { Header } from '@components/Header/Header.component';
import { MainLayout } from '@components/MainLayout/MainLayout.component';
import { PageWrapper } from '@components/PageWrapper/PageWrapper.component';
import SplashScreenLoader from '@components/SplashScreenLoader/SplashScreenLoader.component';
import { TabList } from '@components/TabList/TabList.component';
import { BreadcrumbProps, Button } from 'antd';
import { Route } from 'antd/lib/breadcrumb/Breadcrumb';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

const CreateArticleFormComponent = dynamic(() => import('@components/CreateArticleForm/CreateArticleForm.component'), {
  loading: () => <SplashScreenLoader />,
  ssr: false,
});

export type TabKey = 'information' | 'article';

const tabListItems: { label: string; key: TabKey }[] = [
  { label: 'Информация', key: 'information' },
  { label: 'Статья', key: 'article' },
];

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

const itemRender = (route: Route, params: any, routes: Route[], paths: string[]) => {
  const last = routes.indexOf(route) === routes.length - 1;
  return last ? <span>{route.breadcrumbName}</span> : <Link href={'/content/blog'}>{route.breadcrumbName}</Link>;
};

const CreateArticlePage: NextPage = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('information');

  const { back } = useRouter();

  const handleTabListChange = useCallback((key) => {
    setActiveTab(key);
  }, []);

  return (
    <MainLayout>
      <Header
        onBack={back}
        breadcrumb={{ routes, itemRender }}
        style={{ background: 'white' }}
        title={'Создание статьи'}
        extra={[
          <Button onClick={back} type="text" key="1">
            Закрыть
          </Button>,
        ]}
      >
        <TabList items={tabListItems} defaultActiveKey={'active'} onChange={handleTabListChange} />
      </Header>
      <div style={{ overflow: 'auto' }}>
        <PageWrapper>
          <CreateArticleFormComponent activeTab={activeTab} handleTabListChange={handleTabListChange} />
        </PageWrapper>
      </div>
    </MainLayout>
  );
};

export default CreateArticlePage;
