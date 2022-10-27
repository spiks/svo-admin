import SplashScreenLoader from '@components/SplashScreenLoader/SplashScreenLoader.component';
import { TabList } from '@components/TabList/TabList.component';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import { BlogHeader } from '@components/BlogHeader/BlogHeader.component';
import { MainLayout } from '@components/MainLayout/MainLayout.component';
import { PageWrapper } from '@components/PageWrapper/PageWrapper.component';
import { ArticleBlogStatus as ApiArticleBlogStatus } from '../../../generated';

const BlogListComponent = dynamic(() => import('@components/BlogList/BlogList.component'), {
  loading: () => <SplashScreenLoader />,
});

export type ArticleBlogStatus = ApiArticleBlogStatus | 'article_archived';

const tabListItems: { label: string; key: ArticleBlogStatus | 'article_archived' }[] = [
  { label: 'Опубликованные', key: 'article_published' },
  { label: 'Архивные', key: 'article_archived' },
  { label: 'На модерации', key: 'article_awaiting_review' },
  { label: 'Отклоненные', key: 'article_rejected' },
];

const BlogPage: NextPage = () => {
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ArticleBlogStatus>('article_published');

  const handleTabListChange = useCallback((key) => {
    setActiveTab(key);
  }, []);

  const handleShowFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <MainLayout>
      <BlogHeader showFilters={showFilters} handleShowFilters={handleShowFilters}>
        <TabList items={tabListItems} defaultActiveKey={'published'} onChange={handleTabListChange} />
      </BlogHeader>
      <div style={{ overflow: 'auto' }}>
        <PageWrapper>
          <BlogListComponent showFilters={showFilters} activeTab={activeTab} />
        </PageWrapper>
      </div>
    </MainLayout>
  );
};

export default BlogPage;
