import { NextPage } from 'next';
import { UsersHeader } from '@components/UsersHeader/UsersHeader.component';
import { MainLayout } from '@components/MainLayout/MainLayout.component';
import { Form } from 'antd';
import { UsersQueryParams } from '@components/UsersHeader/UsersHeader.typedef';

import dynamic from 'next/dynamic';
import SplashScreenLoader from '@components/SplashScreenLoader/SplashScreenLoader.component';
import { PageWrapper } from '@components/PageWrapper/PageWrapper.component';

const PatientsListListComponent = dynamic(() => import('@components/PatientsList/PatientsList.component'), {
  loading: () => <SplashScreenLoader />,
});

const ClientsPage: NextPage = () => {
  const [form] = Form.useForm<UsersQueryParams>();

  return (
    <MainLayout>
      <UsersHeader
        subTitle={'В этом разделе собраны профили клиентов системы'}
        form={form}
        searchPlaceholder={'Начните вводить имя пользователя или телефон'}
        title={'Клиенты'}
      />
      <div style={{ overflow: 'auto' }}>
        <PageWrapper>
          <PatientsListListComponent />
        </PageWrapper>
      </div>
    </MainLayout>
  );
};

export default ClientsPage;
