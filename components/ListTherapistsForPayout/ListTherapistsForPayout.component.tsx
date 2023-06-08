import { useQuery } from '@tanstack/react-query';
import { List, notification } from 'antd';
import { getListTherapistsForPayoutPeriod } from 'api/payout/getListTherapistsForPayoutPeriod';
import { PayoutPeriod } from 'generated';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { TherapistsForPayoutListItem } from './TherapistsForPayoutListItem/TherapistsForPayoutListItem.component';
import { useTherapistsForPayoutListFilters } from '@components/TherapistsForPayoutListFilters/TherapistsForPayoutListFilters.hooks/useTherapistsForPayoutListFilters';
import { TherapistsForPayoutListFilters } from '@components/TherapistsForPayoutListFilters/TherapistsForPayoutListFilters.component';
import { markPayoutPeriodAsPaid } from 'api/payout/markPayoutPeriodAsPaid';
import { getListPayoutsForTherapists } from 'api/payout/getListPayoutsForTherapist';

export const ListTherapistsForPayout: FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [periodIsPaid, setPeriodIsPaid] = useState<boolean>(false);

  const {
    form,
    handleChangeFilters,
    formFilters,
    finalAmount,
    payoutReport,
    isFetchingPayoutReport,
    isFetchingFinalAmount,
  } = useTherapistsForPayoutListFilters();

  const { search, period, date } = formFilters;

  const payoutPeriod: PayoutPeriod = useMemo(() => {
    return {
      month: date.month() + 1,
      periodNumber: +period,
      year: date.year(),
    };
  }, [date, period]);

  const fetchTherapistsForPayout = useCallback(
    (page) => {
      return getListTherapistsForPayoutPeriod({
        searchQuery: search || null,
        pagination: {
          count: pageSize,
          offset: page * pageSize,
        },
        payoutPeriod,
      });
    },
    [pageSize, search, payoutPeriod],
  );

  const getQueryKey = useCallback(
    (page) => {
      return ['therapists', page, pageSize, search, payoutPeriod];
    },
    [pageSize, search, payoutPeriod],
  );

  const {
    isFetching: isFetchingTherapists,
    data: listTherapists,
    refetch,
  } = useQuery(
    getQueryKey(page),
    () => {
      return fetchTherapistsForPayout(page - 1);
    },
    {
      onSuccess: async ({ data }) => {
        if (!data.items.length) {
          setPeriodIsPaid(false);
        }
        const resp = await getListPayoutsForTherapists({
          therapistId: data.items[0]?.id,
          searchQuery: null,
          pagination: {
            count: 1,
            offset: 0,
          },
          payoutPeriod: payoutPeriod,
        });
        setPeriodIsPaid(resp.data.items[0].isPaid);
      },
    },
  );

  const handlePaginationChange = useCallback((page: number, pageSize: number) => {
    setPageSize(pageSize);
    setPage(page);
  }, []);

  const handleMarkPayoutPeriodAsPaid = useCallback(async () => {
    try {
      await markPayoutPeriodAsPaid(payoutPeriod);
      refetch();
      notification.success({
        type: 'success',
        message: 'Успех',
        description: 'Выплаты одобрены',
      });
    } catch (e) {
      notification.error({
        type: 'error',
        message: 'Ошибка',
        description: 'Не удалось одобрить выплаты за данный период',
      });
    }
  }, [payoutPeriod, refetch]);

  return (
    <div style={{ padding: '40px' }}>
      <TherapistsForPayoutListFilters
        isDisabled={!listTherapists?.data.items.length}
        form={form}
        onChangeFilters={handleChangeFilters}
        markPayoutPeriodAsPaid={handleMarkPayoutPeriodAsPaid}
        finalAmount={finalAmount}
        payoutReport={payoutReport}
        periodIsPaid={periodIsPaid}
        isFetchingPayoutReport={isFetchingPayoutReport}
        isFetchingFinalAmount={isFetchingFinalAmount}
        isFetchingTherapists={isFetchingTherapists}
      />
      <List
        locale={{ emptyText: 'Список пуст' }}
        loading={isFetchingTherapists}
        itemLayout="vertical"
        size="large"
        renderItem={(it) => {
          return (
            <List.Item key={it.id} style={{ padding: '0', marginBottom: '24px' }}>
              <TherapistsForPayoutListItem
                payoutPeriod={payoutPeriod}
                avatar={it.avatar}
                name={it.name}
                surname={it.surname}
                id={it.id}
              />
            </List.Item>
          );
        }}
        dataSource={listTherapists?.data.items}
        pagination={{
          hideOnSinglePage: true,
          onChange: handlePaginationChange,
          current: page,
          pageSize: pageSize,
          total: listTherapists?.data.itemsAmount,
        }}
      />
    </div>
  );
};
