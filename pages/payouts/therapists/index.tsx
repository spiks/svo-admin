import { Header } from '@components/Header/Header.component';
import { ListTherapistsForPayout } from '@components/ListTherapistsForPayout/ListTherapistsForPayout.component';
import { MainLayout } from '@components/MainLayout/MainLayout.component';
import { TherapistsForPayoutListFilters } from '@components/TherapistsForPayoutListFilters/TherapistsForPayoutListFilters.component';
import { useTherapistsForPayoutListFilters } from '@components/TherapistsForPayoutListFilters/TherapistsForPayoutListFilters.hooks/useTherapistsForPayoutListFilters';
import { BreadcrumbProps } from 'antd';
import { Route } from 'antd/lib/breadcrumb/Breadcrumb';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

const TherapistsPayoutsPage: NextPage = () => {
  const { back } = useRouter();

  const routes: BreadcrumbProps['routes'] = [
    {
      path: 'reports',
      breadcrumbName: 'Биллинг',
    },
    {
      path: 'therapists',
      breadcrumbName: 'Отчет по психологам',
    },
  ];

  const itemRender = (route: Route) => {
    return <span>{route.breadcrumbName}</span>;
  };
  return (
    <MainLayout>
      <Header
        style={{ backgroundColor: '#FFFFFF' }}
        title={'Отчет по психологам'}
        onBack={back}
        breadcrumb={{ routes, itemRender }}
      />

      <ListTherapistsForPayout />
    </MainLayout>
  );
};

export default TherapistsPayoutsPage;
