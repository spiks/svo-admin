import { NextPage } from 'next';
import { UsersHeader } from '../../../components/UsersHeader/UsersHeader.component';
import { useUsersQueryParams } from '../../../components/UsersHeader/UsersHeader.hooks/useUsersQueryParams';
import { MainLayout } from '../../../components/MainLayout/MainLayout.component';
import { Form } from 'antd';
import { UsersQueryParams } from '../../../components/UsersHeader/UsersHeader.typedef';

const ModeratorsPage: NextPage = () => {
  useUsersQueryParams();
  const [form] = Form.useForm<UsersQueryParams>();

  return (
    <MainLayout>
      <UsersHeader title={'Модераторы'} form={form} />
    </MainLayout>
  );
};

export default ModeratorsPage;
