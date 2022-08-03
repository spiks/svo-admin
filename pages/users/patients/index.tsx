import { NextPage } from 'next';
import { UsersHeader } from '../../../components/UsersHeader/UsersHeader.component';
import { useUsersQueryParams } from '../../../components/UsersHeader/UsersHeader.hooks/useUsersQueryParams';
import { MainLayout } from '../../../components/MainLayout/MainLayout.component';

const ClientsPage: NextPage = () => {
  useUsersQueryParams();

  return (
    <MainLayout>
      <UsersHeader title={'Клиенты'} />
    </MainLayout>
  );
};

export default ClientsPage;
