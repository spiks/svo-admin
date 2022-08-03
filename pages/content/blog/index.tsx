import { NextPage } from 'next';
import { useState } from 'react';
import { BlogHeader } from '../../../components/BlogHeader/BlogHeader.component';
import { BlogList } from '../../../components/BlogList/BlogList.component';
import { MainLayout } from '../../../components/MainLayout/MainLayout.component';
import { PageWrapper } from '../../../components/PageWrapper/PageWrapper.component';

const BlogPage: NextPage = () => {
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const handleShowFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <MainLayout>
      <BlogHeader showFilters={showFilters} handleShowFilters={handleShowFilters} />
      <div style={{ overflow: 'auto' }}>
        <PageWrapper>
          <BlogList showFilters={showFilters} />
        </PageWrapper>
      </div>
    </MainLayout>
  );
};

export default BlogPage;
