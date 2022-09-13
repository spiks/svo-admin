import { NextPage } from 'next';
import { UsersHeader } from '@components/UsersHeader/UsersHeader.component';
import { MainLayout } from '@components/MainLayout/MainLayout.component';
import { Form } from 'antd';
import { UsersQueryParams } from '@components/UsersHeader/UsersHeader.typedef';
import { useCallback, useState } from 'react';
import { PageWrapper } from '@components/PageWrapper/PageWrapper.component';
import { TabList } from '@components/TabList/TabList.component';
import dynamic from 'next/dynamic';
import SplashScreenLoader from '@components/SplashScreenLoader/SplashScreenLoader.component';

const TherapistsListComponent = dynamic(() => import('@components/TherapistsList/TherapistsList.component'), {
  loading: () => <SplashScreenLoader />,
});

export enum TAB_KEY {
  ACTIVE = 'ACTIVE',
  AWAITING = 'AWAITING',
}

// Разделы (Tabs)
// Ключ (key) каждого tab'а является ключом объекта со списками статусов для query запроса
const tabListItems: { label: string; key: TAB_KEY }[] = [
  { label: 'Активные', key: TAB_KEY.ACTIVE },
  { label: 'Ожидают подтверждение', key: TAB_KEY.AWAITING },
  // { label: 'Не активные', key: 'not active' },
];

const TherapistsPage: NextPage = () => {
  const [activeTab, setActiveTab] = useState<TAB_KEY>(TAB_KEY.ACTIVE);
  const [form] = Form.useForm<UsersQueryParams>();
  const handleTabListChange = useCallback((key) => {
    setActiveTab(key);
  }, []);

  return (
    <MainLayout>
      <UsersHeader
        subTitle={'В этом разделе собраны профили терапевтов системы'}
        form={form}
        searchPlaceholder={'Начните вводить имя терапевта'}
      >
        <TabList items={tabListItems} defaultActiveKey={'active'} onChange={handleTabListChange} />
      </UsersHeader>
      <div style={{ overflow: 'auto' }}>
        <PageWrapper>
          <TherapistsListComponent activeTab={activeTab} />
        </PageWrapper>
      </div>
    </MainLayout>
  );
};

export default TherapistsPage;
