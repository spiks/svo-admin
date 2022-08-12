import { NextPage } from 'next';
import { UsersHeader } from '../../../components/UsersHeader/UsersHeader.component';
import { useUsersQueryParams } from '../../../components/UsersHeader/UsersHeader.hooks/useUsersQueryParams';
import { MainLayout } from '../../../components/MainLayout/MainLayout.component';
import { TabList } from '../../../components/TabList/TabList.component';
import { Badge, Form, Switch, Table } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { PageWrapper } from '../../../components/PageWrapper/PageWrapper.component';
import { PatientListingPreview } from '../../../generated';
import { ColumnsType, TableRowSelection } from 'antd/lib/table/interface';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPatientList } from '../../../api/patient/getPatientList';
import { UsersQueryParams } from '../../../components/UsersHeader/UsersHeader.typedef';

const tabListItems = [
  { label: 'Активные', key: 'active' },
  { label: 'Неактивные', key: 'not active' },
];

//TODO: когда будет типизация от бэка сделать перевод
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

const PAGE_SIZE = 50;

const ClientsPage: NextPage = () => {
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);
  const [page, setPage] = useState(1);
  const [form] = Form.useForm<UsersQueryParams>();
  const { search, phone } = form.getFieldsValue();

  const fetchPatients = useCallback(
    (nextPageCursor = 0) => {
      return getPatientList(search, phone, nextPageCursor);
    },
    [phone, search],
  );

  useUsersQueryParams();
  const queryClient = useQueryClient();

  const { status, data: patientList } = useQuery(
    ['patients', page - 1, search, phone],
    () => fetchPatients(PAGE_SIZE * (page - 1)),
    {
      keepPreviousData: true,
    },
  );

  useEffect(() => {
    if (patientList?.data.nextPageCursor) {
      queryClient.prefetchQuery(['patients', page], () => fetchPatients(page * PAGE_SIZE));
    }
  }, [patientList, page, queryClient, fetchPatients]);

  const [active, setActive] = useState(true);
  console.log(active);

  const handleTabListChange = useCallback((key) => setActive(key === 'active'), []);

  return (
    <MainLayout>
      <UsersHeader form={form} searchPlaceholder={'Начните вводить имя пользователя'} title={'Клиенты'}>
        <TabList items={tabListItems} defaultActiveKey={'active'} onChange={handleTabListChange} />
      </UsersHeader>
      <div style={{ overflow: 'auto' }}>
        <PageWrapper>
          {status === 'loading' ? (
            <div>Loading...</div>
          ) : status === 'error' ? (
            <div>Сообщение об ошибке</div>
          ) : (
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
              dataSource={patientList?.data.items.map(toGridView)}
              pagination={{
                current: page,
                pageSize: PAGE_SIZE,
                onChange: setPage,
                total: patientList?.data.total,
                showSizeChanger: false,
              }}
            />
          )}
        </PageWrapper>
      </div>
    </MainLayout>
  );
};

export default ClientsPage;
