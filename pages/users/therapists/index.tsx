import { NextPage } from 'next';
import { UsersHeader } from '@components/UsersHeader/UsersHeader.component';
import { MainLayout } from '@components/MainLayout/MainLayout.component';
import { Form, Select } from 'antd';
import { UsersQueryParams } from '@components/UsersHeader/UsersHeader.typedef';
import { useCallback, useState } from 'react';
import { PageWrapper } from '@components/PageWrapper/PageWrapper.component';
import { TabList } from '@components/TabList/TabList.component';
import dynamic from 'next/dynamic';
import SplashScreenLoader from '@components/SplashScreenLoader/SplashScreenLoader.component';
import { TherapistProfileStatus } from '../../../generated';
import { DefaultOptionType } from 'rc-select/lib/Select';
import { useRouter } from 'next/router';

const TherapistsListComponent = dynamic(() => import('@components/TherapistsList/TherapistsList.component'), {
  loading: () => <SplashScreenLoader />,
});

export enum TAB_KEY {
  ACTIVE = 'active',
  REGISTERING = 'registering',
  BLOCKED = 'blocked',
}

// Разделы (Tabs)
// Ключ (key) каждого tab'а является ключом объекта со списками статусов для query запроса
const tabListItems: { label: string; key: TAB_KEY }[] = [
  { label: 'Активные', key: TAB_KEY.ACTIVE },
  { label: 'Регистрирующиеся', key: TAB_KEY.REGISTERING },
  { label: 'Заблокированные', key: TAB_KEY.BLOCKED },
];

const getOptions = (activeTab: TAB_KEY): DefaultOptionType[] | undefined => {
  switch (activeTab) {
    case TAB_KEY.REGISTERING: {
      return [
        { label: 'Все', value: 'all' },
        { label: 'Терапевт отправил подписанный договор', value: 'contract_awaiting_review' },
        { label: 'Терапевт не отправил подписанный договор', value: 'contract_not_submitted_yet' },
        { label: 'Документы ожидают модерацию', value: 'documents_awaiting_review' },
        { label: 'Документы не отправлены терапевтом', value: 'documents_not_submitted_yet' },
        { label: 'Документы отклонены', value: 'documents_rejected' },
        { label: 'Интервью в процессе', value: 'interview_processing' },
        { label: 'Cоздан администратором', value: 'created_by_admin' },
      ];
    }
    case TAB_KEY.BLOCKED: {
      return [
        { label: 'Все', value: 'all' },
        { label: 'Интервью провалено', value: 'interview_failed' },
        { label: 'Договор отклонен', value: 'contract_rejected' },
      ];
    }
    case TAB_KEY.ACTIVE: {
      return undefined;
    }
  }
};

const TherapistsPage: NextPage = () => {
  const [form] = Form.useForm<UsersQueryParams>();
  const [profileStatus, setProfileStatus] = useState<TherapistProfileStatus | 'all'>();
  const router = useRouter();

  const handleTabListChange = useCallback(
    (key) => {
      router.push({
        query: {
          ...router.query,
          activeTab: key,
        },
      });
      setProfileStatus(undefined);
    },
    [router],
  );

  const queryActiveTab = router.query.activeTab as TAB_KEY;
  const activeTab = Object.values(TAB_KEY).includes(queryActiveTab) ? queryActiveTab : TAB_KEY.ACTIVE;

  const optionsSelectBox = getOptions(activeTab);
  return (
    <MainLayout>
      <UsersHeader
        title={'Психологи'}
        subTitle={'В этом разделе собраны профили терапевтов системы'}
        form={form}
        searchPlaceholder={'Начните вводить имя пользователя или телефон'}
        addUser
      >
        <TabList
          defaultActiveKey={'active'}
          items={tabListItems}
          activeKey={activeTab}
          onChange={handleTabListChange}
          tabBarExtraContent={
            <>
              {optionsSelectBox ? (
                <Select
                  defaultValue={'all'}
                  style={{ width: activeTab === TAB_KEY.REGISTERING ? '330px' : '240px' }}
                  size="middle"
                  onChange={setProfileStatus}
                  value={profileStatus || 'all'}
                  options={optionsSelectBox}
                />
              ) : undefined}
            </>
          }
        />
      </UsersHeader>
      <div style={{ overflow: 'auto' }}>
        <PageWrapper>
          <TherapistsListComponent profileStatus={profileStatus} activeTab={activeTab} />
        </PageWrapper>
      </div>
    </MainLayout>
  );
};

export default TherapistsPage;
