import { Header } from '@components/Header/Header.component';
import { MainLayout } from '@components/MainLayout/MainLayout.component';
import { PromoCodesTable } from '@components/PromoCodesTable/PromoCodesTable.component';
import { BreadcrumbProps } from 'antd';
import { Route } from 'antd/lib/breadcrumb/Breadcrumb';
import { NextPage } from 'next';

const PromocodesPage: NextPage = () => {
  const routes: BreadcrumbProps['routes'] = [
    {
      path: 'promocodes',
      breadcrumbName: 'Управление промокодами',
    },
  ];

  const itemRender = (route: Route) => {
    return <span>{route.breadcrumbName}</span>;
  };

  return (
    <MainLayout>
      <Header
        style={{ backgroundColor: '#FFFFFF' }}
        title={'Управление промокодами'}
        breadcrumb={{ routes, itemRender }}
        backIcon={false}
      />
      <div style={{ padding: '32px 20px' }}>
        <PromoCodesTable />
      </div>
    </MainLayout>
  );
};

export default PromocodesPage;
