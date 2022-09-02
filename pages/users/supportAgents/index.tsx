import { NextPage } from 'next';
import { UsersHeader } from '../../../components/UsersHeader/UsersHeader.component';
import { useUsersQueryParams } from '../../../components/UsersHeader/UsersHeader.hooks/useUsersQueryParams';
import { MainLayout } from '../../../components/MainLayout/MainLayout.component';
import { Form } from 'antd';
import { UsersQueryParams } from '../../../components/UsersHeader/UsersHeader.typedef';

const SupportAgentsPage: NextPage = () => {
  useUsersQueryParams();
  const [form] = Form.useForm<UsersQueryParams>();

  return (
    <MainLayout>
      <UsersHeader
        subTitle={'В этом разделе собраны профили агентов поддержки системы'}
        form={form}
        title={'Агенты поддержки'}
      />
    </MainLayout>
  );
};

export default SupportAgentsPage;
