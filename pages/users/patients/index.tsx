import { NextPage } from 'next';
import { UsersHeader } from '../../../components/UsersHeader/UsersHeader.component';
import { useUsersQueryParams } from '../../../components/UsersHeader/UsersHeader.hooks/useUsersQueryParams';
import { MainLayout } from '../../../components/MainLayout/MainLayout.component';
import { TabList } from '../../../components/TabList/TabList.component';
import { Badge, Form, Switch, Table } from 'antd';
import { useState } from 'react';
import { PageWrapper } from '../../../components/PageWrapper/PageWrapper.component';
import { PatientListingPreview } from '../../../generated';
import { ColumnsType, TableRowSelection } from 'antd/lib/table/interface';

function toGridView(it: PatientListingPreview) {
  return { ...it, profiles: it.profiles.join(' ') };
}

type GridView = ReturnType<typeof toGridView>;

const columns: ColumnsType<GridView> = [
  {
    title: 'Имя пользователей',
    dataIndex: 'fullName',
  },
  {
    title: 'Номер телефона',
    dataIndex: 'phone',
    width: 153,
  },
  {
    title: 'Профили',
    dataIndex: 'profiles',
    width: 200,
  },
  {
    title: 'Дата регистрации',
    dataIndex: 'registrationDate',
    defaultSortOrder: 'descend' as const,
    sorter: (a, b) => new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime(),
    width: 181,
  },
  {
    title: 'Последняя активность',
    dataIndex: 'lastActivityDate',
    defaultSortOrder: 'descend' as const,
    sorter: (a, b) => new Date(a.lastActivityDate).getTime() - new Date(b.lastActivityDate).getTime(),
    width: 220,
  },
];

const data: PatientListingPreview[] = [];

for (let i = 0; i < 100; i++) {
  data.push({
    id: i.toString(),
    fullName: 'Дейнерис Таргариен',
    phone: '+7 921 386 39 97',
    profiles: ['Клиент', 'психолог'],
    registrationDate: '2022-01-15',
    lastActivityDate: '2022-01-15',
  });
}

const rowSelection: TableRowSelection<GridView> = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  },
};

const ClientsPage: NextPage = () => {
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);

  useUsersQueryParams();

  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <MainLayout>
      <UsersHeader title={'Клиенты'}>
        <TabList
          items={[
            { label: 'Активные', key: 'active' },
            { label: 'Неактивные', key: 'not active' },
          ]}
          defaultActiveKey={'active'}
          onChange={onChange}
        />
      </UsersHeader>
      <div style={{ overflow: 'auto' }}>
        <PageWrapper>
          <Table
            title={() => (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Badge count={0} offset={[23, 7]} showZero={false}>
                  Найдено пользователей:
                </Badge>
                <Form.Item
                  style={{ margin: 0 }}
                  name="a"
                  label="Множественный выбор"
                  tooltip="Для совершения манипуляций над несколькими пользователями"
                >
                  <Switch
                    style={{
                      marginLeft: 16,
                    }}
                    checked={isMultipleChoice}
                    onChange={setIsMultipleChoice}
                  />
                </Form.Item>
              </div>
            )}
            rowSelection={isMultipleChoice ? { ...rowSelection } : undefined}
            columns={columns}
            dataSource={data.map(toGridView)}
            pagination={{
              showSizeChanger: false,
              pageSize: 50,
            }}
          />
        </PageWrapper>
      </div>
    </MainLayout>
  );
};

export default ClientsPage;
