import { NextPage } from 'next';
import { MainLayout } from '../../../components/MainLayout/MainLayout.component';
import { UsersHeader } from '../../../components/UsersHeader/UsersHeader.component';
import { useUsersQueryParams } from '../../../components/UsersHeader/UsersHeader.hooks/useUsersQueryParams';

const AdministratorsPage: NextPage = () => {
  useUsersQueryParams();

  return (
    <MainLayout>
      <UsersHeader title={'Администраторы'} />
    </MainLayout>
  );
};

export default AdministratorsPage;
