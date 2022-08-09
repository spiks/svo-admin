import { NextPage } from 'next';
import { UsersHeader } from '../../../components/UsersHeader/UsersHeader.component';
import { useUsersQueryParams } from '../../../components/UsersHeader/UsersHeader.hooks/useUsersQueryParams';
import { MainLayout } from '../../../components/MainLayout/MainLayout.component';
import { TabList } from '../../../components/TabList/TabList.component';

const ClientsPage: NextPage = () => {
  useUsersQueryParams();
  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <MainLayout>
      <UsersHeader title={'Клиенты'}>
        <TabList
          items={[
            { label: 'Активные', key: '1' },
            { label: 'Неактивные', key: '2' },
          ]}
          defaultActiveKey={'1'}
          onChange={onChange}
        />
      </UsersHeader>
    </MainLayout>
  );
};

export default ClientsPage;
