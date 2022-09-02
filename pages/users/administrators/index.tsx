import { NextPage } from 'next';
import { MainLayout } from '../../../components/MainLayout/MainLayout.component';
import { UsersHeader } from '../../../components/UsersHeader/UsersHeader.component';
import { useUsersQueryParams } from '../../../components/UsersHeader/UsersHeader.hooks/useUsersQueryParams';
import { UsersQueryParams } from '../../../components/UsersHeader/UsersHeader.typedef';
import { Form } from 'antd';

const AdministratorsPage: NextPage = () => {
  useUsersQueryParams();
  const [form] = Form.useForm<UsersQueryParams>();

  return (
    <MainLayout>
      <UsersHeader
        subTitle={'В этом разделе собраны профили администраторов системы'}
        title={'Администраторы'}
        form={form}
      />
    </MainLayout>
  );
};

export default AdministratorsPage;
