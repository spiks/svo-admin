import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Badge, Table } from 'antd';
import { GridView, toGridView } from '../../helpers/toGridView';
import { ColumnsType, SortOrder } from 'antd/lib/table/interface';
import { useRouter } from 'next/router';
import { useUsersQueryParams } from '@components/UsersHeader/UsersHeader.hooks/useUsersQueryParams';
import { getTherapistList } from '../../api/therapist/getTherapistList';
import { sortOrderCuts } from '../../helpers/sortOrderCuts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TAB_KEY } from '../../pages/users/therapists';
import { TherapistProfileStatus } from '../../generated';

const columns: ColumnsType<GridView> = [
  {
    title: 'Имя пользователя',
    dataIndex: 'fullName',
  },
  {
    title: 'Профили',
    dataIndex: 'profiles',
    width: 200,
  },
  {
    title: 'Номер телефона',
    dataIndex: 'phone',
    width: 153,
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

// Ключи применяемые для фильтрации пользователей для отдельных разделов
const queryStatusLists: Record<TAB_KEY, TherapistProfileStatus[]> = {
  // Только активные пользователи
  [TAB_KEY.ACTIVE]: ['active'],
  [TAB_KEY.REGISTERING]: [
    'contract_awaiting_review',
    'contract_not_submitted_yet',
    'documents_awaiting_review',
    'documents_not_submitted_yet',
    'documents_rejected',
    'interview_processing',
    'created_by_admin',
  ],
  [TAB_KEY.BLOCKED]: ['interview_failed', 'contract_rejected', 'blocked', 'pre_blocked'],
};

type Props = { activeTab: TAB_KEY; profileStatus?: TherapistProfileStatus | 'all' };

const TherapistsList: FC<Props> = ({ activeTab, profileStatus }) => {
  const { push } = useRouter();

  const isMounted = useRef(true);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortOrder, setSortOrder] = useState<NonNullable<SortOrder>>('descend');

  const { search } = useUsersQueryParams();

  useEffect(() => {
    if (isMounted.current) {
      isMounted.current = false;
      return;
    }

    if (search) {
      setPage(1);
    }
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, profileStatus]);

  const fetchTherapists = useCallback(
    (page) => {
      const fixedProfileStatus = profileStatus === 'all' ? null : profileStatus;
      return getTherapistList({
        searchQuery: search,
        pagination: {
          count: pageSize,
          offset: page * pageSize,
        },
        mainSpecialization: null,
        orderBy: {
          field: 'createdAt',
          orderDirection: sortOrderCuts[sortOrder],
        },
        statuses: fixedProfileStatus ? [fixedProfileStatus] : queryStatusLists[activeTab],
      });
    },
    [activeTab, pageSize, profileStatus, search, sortOrder],
  );

  const queryClient = useQueryClient();

  const getQueryKey = useCallback(
    (page) => {
      return ['therapists', page, activeTab, search, pageSize, sortOrder, profileStatus];
    },
    [activeTab, pageSize, search, sortOrder, profileStatus],
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
    if (therapistsList && therapistsList.data.itemsAmount > page * pageSize) {
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
      locale={{
        emptyText: 'Нет терапевтов',
        triggerDesc: 'Сортировать по убыванию',
        triggerAsc: 'Сортировать по возрастанию',
      }}
      sortDirections={['ascend', 'descend', 'ascend']}
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
            <Badge count={therapistsList?.data.itemsAmount} offset={[23, 7]} showZero={false}>
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
        pageSizeOptions: [10, 20, 50],
        onChange: handlePaginationChange,
        total: therapistsList?.data.itemsAmount,
      }}
    />
  );
};

export default TherapistsList;
