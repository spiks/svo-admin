import { useQuery } from '@tanstack/react-query';
import { List } from 'antd';
import { getListTherapistsForPayoutPeriod } from 'api/payout/getListTherapistsForPayoutPeriod';
import { PayoutPeriod } from 'generated';
import { FC, useCallback, useMemo, useState } from 'react';
import { TherapistsForPayoutListItem } from './TherapistsForPayoutListItem/TherapistsForPayoutListItem.component';
import { useTherapistsForPayoutListFilters } from '@components/TherapistsForPayoutListFilters/TherapistsForPayoutListFilters.hooks/useTherapistsForPayoutListFilters';
import { TherapistsForPayoutListFilters } from '@components/TherapistsForPayoutListFilters/TherapistsForPayoutListFilters.component';

export const ListTherapistsForPayout: FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { form, handleChangeFilters, formFilters, handleMarkPayoutPeriodAsPaid, finalAmount, payoutReport } =
    useTherapistsForPayoutListFilters();

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

  const { isFetching, data: listTherapists } = useQuery(getQueryKey(page), () => {
    return fetchTherapistsForPayout(page - 1);
  });

  const handlePaginationChange = useCallback((page: number, pageSize: number) => {
    setPageSize(pageSize);
    setPage(page);
  }, []);

  return (
    <div style={{ padding: '40px' }}>
      <TherapistsForPayoutListFilters
        form={form}
        onChangeFilters={handleChangeFilters}
        markPayoutPeriodAsPaid={handleMarkPayoutPeriodAsPaid}
        finalAmount={finalAmount}
        filters={formFilters}
        payoutReport={payoutReport}
      />
      <List
        locale={{ emptyText: 'Список пуст' }}
        loading={isFetching}
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
