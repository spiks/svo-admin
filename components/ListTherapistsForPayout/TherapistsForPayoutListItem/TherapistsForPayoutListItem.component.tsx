import { useQuery } from '@tanstack/react-query';
import { Avatar, Collapse, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { getListPayoutsForTherapists } from 'api/payout/getListPayoutsForTherapist';
import { MediaImage, PayoutPeriod } from 'generated';
import { FC, useCallback, useEffect, useState } from 'react';
import { PayoutGridView, payoutToGridView } from '../TherapistsForPayoutList.utils/payoutToGridView';
import styles from './TherapistsForPayoutListItem.module.css';
import { CheckOutlined, MinusOutlined, UserOutlined } from '@ant-design/icons';

const { Panel } = Collapse;

type TherapistsForPayoutListItemProps = {
  avatar: MediaImage | null;
  name: string;
  surname: string;
  id: string;
  payoutPeriod: PayoutPeriod;
};

const columns: ColumnsType<PayoutGridView> = [
  {
    title: 'Дата сеанса',
    dataIndex: 'date',
  },
  {
    title: 'Клиент',
    dataIndex: 'patient',
    render: (patient) => (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', columnGap: '8px' }}>
        {patient.avatar ? (
          <Avatar src={'https://' + patient.avatar.sizes.original.url} size={22} />
        ) : (
          <Avatar style={{ flexShrink: 0 }} icon={<UserOutlined />} size={22} />
        )}
        <Typography.Text>{patient.fullName || 'Аноним'}</Typography.Text>
      </div>
    ),
  },
  {
    title: 'Тип сеанса',
    dataIndex: 'appointmentType',
  },
  {
    title: 'Общая стоимость сеанса',
    dataIndex: 'amount',
  },
  {
    title: 'Выплачено',
    dataIndex: 'isPaid',
    render: (isPaid) => (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {isPaid ? <CheckOutlined /> : <MinusOutlined />}
      </div>
    ),
  },
  {
    title: 'Сумма к выплате психологу',
    dataIndex: 'therapistProfit',
  },
];

export const TherapistsForPayoutListItem: FC<TherapistsForPayoutListItemProps> = ({
  avatar,
  name,
  surname,
  id,
  payoutPeriod,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchPayouts = useCallback(
    (page) => {
      return getListPayoutsForTherapists({
        therapistId: id,
        searchQuery: null,
        pagination: {
          count: pageSize,
          offset: page * pageSize,
        },
        payoutPeriod: payoutPeriod,
      });
    },
    [pageSize, id, payoutPeriod],
  );

  const getQueryKey = useCallback(
    (page) => {
      return ['payouts', page, pageSize, id, payoutPeriod];
    },
    [pageSize, id, payoutPeriod],
  );

  const { isFetching, data: listPayouts } = useQuery(
    getQueryKey(page),
    () => {
      return fetchPayouts(page - 1);
    },
    { enabled: isActive },
  );

  const handleChangeStatus = () => {
    setIsActive((prev) => !prev);
  };

  const handlePaginationChange = useCallback((page: number, pageSize: number) => {
    setPageSize(pageSize);
    setPage(page);
  }, []);

  return (
    <Collapse expandIconPosition={'end'} onChange={handleChangeStatus}>
      <Panel
        key={id}
        header={
          <div className={styles['header']}>
            {avatar ? (
              <Avatar src={'https://' + avatar.sizes.original.url} size={'large'} />
            ) : (
              <Avatar icon={<UserOutlined />} size={'large'} />
            )}
            <Typography.Text style={{ fontSize: '16px' }}>{`${name} ${surname}`}</Typography.Text>
          </div>
        }
      >
        <div>
          <div className={styles['table-header']}>
            <div className={styles['left']}>
              <Typography.Text type="secondary">{'Сумма выплат за период'}</Typography.Text>
              <Typography.Text style={{ fontSize: '24px', lineHeight: '32px' }}>
                {`${Intl.NumberFormat('ru-RU').format(listPayouts?.data.totalAmount.amount ?? 0)} \u20bd`}
              </Typography.Text>
            </div>
          </div>
          <Table
            columns={columns}
            locale={{ emptyText: 'Нет выплат' }}
            loading={isFetching}
            dataSource={listPayouts?.data.items.map(payoutToGridView)}
            pagination={{
              hideOnSinglePage: true,
              onChange: handlePaginationChange,
              current: page,
              pageSize: pageSize,
              total: listPayouts?.data.items.length,
            }}
          />
        </div>
      </Panel>
    </Collapse>
  );
};
