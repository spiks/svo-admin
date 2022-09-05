import { NextPage } from 'next';
import { UsersHeader } from '../../../components/UsersHeader/UsersHeader.component';
import { useUsersQueryParams } from '../../../components/UsersHeader/UsersHeader.hooks/useUsersQueryParams';
import { MainLayout } from '../../../components/MainLayout/MainLayout.component';
import { TabList } from '../../../components/TabList/TabList.component';
import { Badge, Form, Switch, Table } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { PageWrapper } from '../../../components/PageWrapper/PageWrapper.component';
import { ColumnsType, SortOrder, TableRowSelection } from 'antd/lib/table/interface';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPatientList } from '../../../api/patient/getPatientList';
import { UsersQueryParams } from '../../../components/UsersHeader/UsersHeader.typedef';
import { GridView, toGridView } from '../../../helpers/toGridView';
import { sortOrderCuts } from '../../../helpers/sortOrderCuts';

const tabListItems = [
  { label: 'Активные', key: 'active' },
  { label: 'Неактивные', key: 'not active' },
];

const columns: ColumnsType<GridView> = [
  {
    title: 'Имя пользователя',
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
    sorter: (a, b) => {
      return new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime();
    },
    width: 181,
  },
  // {
  //   title: 'Последняя активность',
  //   dataIndex: 'lastActivityDate',
  //   defaultSortOrder: 'descend' as const,
  //   sorter: (a, b) => new Date(a.lastActivityDate).getTime() - new Date(b.lastActivityDate).getTime(),
  //   width: 220,
  // },
];

const rowSelection: TableRowSelection<GridView> = {
  onChange: (selectedRowKeys, selectedRows) => {
    // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  onSelect: (record, selected, selectedRows) => {
    // console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    // console.log(selected, selectedRows, changeRows);
  },
};

const ClientsPage: NextPage = () => {
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortOrder, setSortOrder] = useState<NonNullable<SortOrder>>('descend');
  const [form] = Form.useForm<UsersQueryParams>();
  const { search, phone } = form.getFieldsValue();

  const fetchPatients = useCallback(
    (page) => {
      return getPatientList({
        search: {
          fullName: search,
          phone: phone,
        },
        pagination: {
          count: pageSize,
          offset: page * pageSize,
        },
        orderBy: {
          field: 'createdAt',
          orderDirection: sortOrderCuts[sortOrder],
        },
      });
    },
    [pageSize, phone, search, sortOrder],
  );

  useUsersQueryParams();
  const queryClient = useQueryClient();

  const getQueryKey = useCallback(
    (page) => {
      return ['patients', page, search, phone, pageSize, sortOrder];
    },
    [pageSize, phone, search, sortOrder],
  );

  const { status, data: patientList } = useQuery(
    getQueryKey(page),
    () => {
      return fetchPatients(page - 1);
    },
    {
      keepPreviousData: true,
    },
  );

  useEffect(() => {
    if (patientList && patientList.data.itemsAmount > (page + 1) * pageSize) {
      queryClient.prefetchQuery(getQueryKey(page + 1), () => {
        return fetchPatients(page);
      });
    }
  }, [fetchPatients, getQueryKey, page, pageSize, patientList, queryClient]);

  const [active, setActive] = useState(true);

  const handleTabListChange = useCallback((key) => {
    setActive(key === 'active');
  }, []);

  const handlePaginationChange = useCallback((page: number, pageSize: number) => {
    setPageSize(pageSize);
    setPage(page);
  }, []);

  return (
    <MainLayout>
      <UsersHeader
        subTitle={'В этом разделе собраны профили клиентов системы'}
        form={form}
        searchPlaceholder={'Начните вводить имя пользователя'}
        title={'Клиенты'}
      >
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
              onChange={(pagination, filters, sorter) => {
                if (sorter && !Array.isArray(sorter) && sorter.order) {
                  setSortOrder(sorter.order);
                }
              }}
              title={() => {
                return (
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
                );
              }}
              rowSelection={isMultipleChoice ? { ...rowSelection } : undefined}
              columns={columns}
              dataSource={patientList?.data.items.map(toGridView)}
              pagination={{
                current: page,
                pageSize: pageSize,
                onChange: handlePaginationChange,
                total: patientList?.data.itemsAmount,
              }}
            />
          )}
        </PageWrapper>
      </div>
    </MainLayout>
  );
};

export default ClientsPage;
