import { PageWrapper } from '@components/PageWrapper/PageWrapper.component';
import { useUsersQueryParams } from '@components/UsersHeader/UsersHeader.hooks/useUsersQueryParams';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Badge, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { getPatientList } from 'api/patient/getPatientList';
import { GridView, toGridView } from 'helpers/toGridView';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useRef, useState } from 'react';

const columns: ColumnsType<GridView> = [
  {
    title: 'Имя пользователя',
    dataIndex: 'fullName',
    render: (fullName) => <a>{fullName}</a>,
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
  // Пока backend не присылает данные поля
  // {
  //   title: 'Дата регистрации',
  //   dataIndex: 'registrationDate',
  //   defaultSortOrder: 'descend' as const,
  //   sorter: (a, b) => {
  //     return new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime();
  //   },
  //   width: 181,
  // },
  // {
  //   title: 'Последняя активность',
  //   dataIndex: 'lastActivityDate',
  //   defaultSortOrder: 'descend' as const,
  //   sorter: (a, b) => new Date(a.lastActivityDate).getTime() - new Date(b.lastActivityDate).getTime(),
  //   width: 220,
  // },
];

const PatientsList: FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const isMounted = useRef(true);

  const { search, phone } = useUsersQueryParams();

  const router = useRouter();

  useEffect(() => {
    if (isMounted.current) {
      isMounted.current = false;
      return;
    }

    if (phone || search) {
      setPage(1);
    }
  }, [phone, search]);

  const fetchPatients = useCallback(
    (page) => {
      return getPatientList({
        search: {
          fullName: search,
          phone,
        },
        pagination: {
          count: pageSize,
          offset: page * pageSize,
        },
        orderBy: {
          field: 'createdAt',
          orderDirection: 'desc',
        },
      });
    },
    [pageSize, phone, search],
  );

  const queryClient = useQueryClient();

  const getQueryKey = useCallback(
    (page) => {
      return ['patients', page, search, phone, pageSize];
    },
    [pageSize, phone, search],
  );

  const { isFetching, data: patientList } = useQuery(
    getQueryKey(page),
    () => {
      return fetchPatients(page - 1);
    },
    {
      keepPreviousData: true,
    },
  );

  useEffect(() => {
    if (patientList && patientList.data.itemsAmount > page * pageSize) {
      queryClient.prefetchQuery(getQueryKey(page + 1), () => {
        return fetchPatients(page);
      });
    }
  }, [fetchPatients, getQueryKey, page, pageSize, patientList, queryClient]);

  const handlePaginationChange = useCallback((page: number, pageSize: number) => {
    setPageSize(pageSize);
    setPage(page);
  }, []);

  return (
    <Table
      loading={isFetching}
      title={() => {
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Badge count={patientList?.data.itemsAmount} offset={[23, 7]} showZero={false}>
              Найдено пользователей:
            </Badge>
          </div>
        );
      }}
      columns={columns}
      dataSource={patientList?.data.items.map(toGridView)}
      onRow={(data) => {
        return {
          onClick: async () => {
            await router.push('/users/patients/' + data.id);
          },
        };
      }}
      pagination={{
        current: page,
        pageSize: pageSize,
        pageSizeOptions: [10, 20, 50],
        onChange: handlePaginationChange,
        total: patientList?.data.itemsAmount,
      }}
    />
  );
};

export default PatientsList;
