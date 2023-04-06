import SplashScreenLoader from '@components/SplashScreenLoader/SplashScreenLoader.component';
import { TabList } from '@components/TabList/TabList.component';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import { BlogHeader } from '@components/BlogHeader/BlogHeader.component';
import { MainLayout } from '@components/MainLayout/MainLayout.component';
import { PageWrapper } from '@components/PageWrapper/PageWrapper.component';
import { ArticleBlogStatus as ApiArticleBlogStatus } from '../../../generated';
import { useRouter } from 'next/router';

const BlogListComponent = dynamic(() => import('@components/BlogList/BlogList.component'), {
  loading: () => <SplashScreenLoader />,
});

export type ArticleBlogStatus = ApiArticleBlogStatus | 'article_archived';

function isArticleBlogStatusType(value: string): value is ArticleBlogStatus {
  const statuses: ArticleBlogStatus[] = [
    'article_awaiting_review',
    'article_published',
    'article_rejected',
    'article_archived',
  ];
  return statuses.includes(value as never);
}

const tabListItems: { label: string; key: ArticleBlogStatus }[] = [
  { label: 'Опубликованные', key: 'article_published' },
  { label: 'Архивные', key: 'article_archived' },
  { label: 'На модерации', key: 'article_awaiting_review' },
  { label: 'Отклоненные', key: 'article_rejected' },
];

const BlogPage: NextPage = () => {
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const router = useRouter();

  const handleTabListChange = useCallback(
    (key) => {
      router.push({
        query: {
          ...router.query,
          activeTab: key,
        },
      });
    },
    [router],
  );

  const queryActiveTab = router.query.activeTab as ArticleBlogStatus;
  const activeTab = isArticleBlogStatusType(queryActiveTab) ? queryActiveTab : 'article_published';

  const handleShowFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <MainLayout>
      <BlogHeader showFilters={showFilters} handleShowFilters={handleShowFilters}>
        <TabList
          items={tabListItems}
          defaultActiveKey={'published'}
          activeKey={activeTab}
          onChange={handleTabListChange}
        />
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
