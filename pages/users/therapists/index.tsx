import { NextPage } from 'next';
import { UsersHeader } from '../../../components/UsersHeader/UsersHeader.component';
import { useUsersQueryParams } from '../../../components/UsersHeader/UsersHeader.hooks/useUsersQueryParams';
import { MainLayout } from '../../../components/MainLayout/MainLayout.component';

const TherapistsPage: NextPage = () => {
  useUsersQueryParams();

  return (
    <MainLayout>
      <UsersHeader title={'Терапевты'} />
    </MainLayout>
  );
};

export default TherapistsPage;
