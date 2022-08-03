import { NextPage } from 'next';
import { UsersHeader } from '../../../components/UsersHeader/UsersHeader.component';
import { useUsersQueryParams } from '../../../components/UsersHeader/UsersHeader.hooks/useUsersQueryParams';
import { MainLayout } from '../../../components/MainLayout/MainLayout.component';

const ModeratorsPage: NextPage = () => {
  useUsersQueryParams();

  return (
    <MainLayout>
      <UsersHeader title={'Модераторы'} />
    </MainLayout>
  );
};

export default ModeratorsPage;
