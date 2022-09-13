import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Badge, Table } from 'antd';
import { GridView, toGridView } from '../../helpers/toGridView';
import { ColumnsType, SortOrder, TableRowSelection } from 'antd/lib/table/interface';
import { useRouter } from 'next/router';
import { useUsersQueryParams } from '@components/UsersHeader/UsersHeader.hooks/useUsersQueryParams';
import { getTherapistList } from '../../api/therapist/getTherapistList';
import { sortOrderCuts } from '../../helpers/sortOrderCuts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TAB_KEY } from '../../pages/users/therapists';
import { TherapistProfileStatus } from '../../generated';

// Колонки списка
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

// Ключи применяемые для фильтрации пользователей для отдельных разделов
const queryStatusLists: Record<TAB_KEY, TherapistProfileStatus[]> = {
  // Только активные пользователи
  [TAB_KEY.ACTIVE]: ['active'],
  [TAB_KEY.AWAITING]: [
    'contract_awaiting_review',
    'contract_not_submitted_yet',
    'contract_rejected',
    'documents_awaiting_review',
    'documents_not_submitted_yet',
    'documents_rejected',
    'interview_failed',
    'interview_processing',
  ],
};

const TherapistsList: FC<{ activeTab: TAB_KEY }> = ({ activeTab }) => {
  const { push } = useRouter();
  const [isMultipleChoice] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortOrder, setSortOrder] = useState<NonNullable<SortOrder>>('descend');

  const { search, phone } = useUsersQueryParams();

  const fetchTherapists = useCallback(
    (page) => {
      return getTherapistList({
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
          orderDirection: sortOrderCuts[sortOrder],
        },
        statuses: queryStatusLists[activeTab],
      });
    },
    [activeTab, pageSize, phone, search, sortOrder],
  );

  const queryClient = useQueryClient();

  const getQueryKey = useCallback(
    (page) => {
      return ['therapists', page, activeTab, search, phone, pageSize, sortOrder];
    },
    [activeTab, pageSize, phone, search, sortOrder],
  );

  const { isFetching, data: therapistsList } = useQuery(
    getQueryKey(page),
    () => {
      return fetchTherapists(page - 1);
    },
    {
      keepPreviousData: true,
      retryDelay: 3000,
    },
  );

  useEffect(() => {
    if (therapistsList && therapistsList.data.itemsAmount > (page + 1) * pageSize) {
      queryClient.prefetchQuery(getQueryKey(page + 1), () => {
        return fetchTherapists(page);
      });
    }
  }, [fetchTherapists, getQueryKey, page, pageSize, therapistsList, queryClient]);

  const handlePaginationChange = useCallback((page: number, pageSize: number) => {
    setPageSize(pageSize);
    setPage(page);
  }, []);

  return (
    <Table
      loading={isFetching}
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
            {/*<Form.Item*/}
            {/*  style={{ margin: 0 }}*/}
            {/*  name="a"*/}
            {/*  label="Множественный выбор"*/}
            {/*  tooltip="Для совершения манипуляций над несколькими пользователями"*/}
            {/*>*/}
            {/*  <Switch*/}
            {/*    style={{*/}
            {/*      marginLeft: 16,*/}
            {/*    }}*/}
            {/*    checked={isMultipleChoice}*/}
            {/*    onChange={setIsMultipleChoice}*/}
            {/*  />*/}
            {/*</Form.Item>*/}
          </div>
        );
      }}
      rowSelection={isMultipleChoice ? { ...rowSelection } : undefined}
      columns={columns}
      onRow={(data) => {
        return {
          onClick: async () => {
            await push('/users/therapists/' + data.id);
          },
        };
      }}
      dataSource={therapistsList?.data.items.map(toGridView)}
      pagination={{
        current: page,
        pageSize: pageSize,
        onChange: handlePaginationChange,
        total: therapistsList?.data.itemsAmount,
      }}
    />
  );
};

export default TherapistsList;
