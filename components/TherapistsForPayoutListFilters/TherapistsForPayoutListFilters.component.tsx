import { Button, DatePicker, Form, FormInstance, Input, Select, Typography } from 'antd';
import { FC, useEffect, useMemo } from 'react';
import styles from './TherapistsForPayoutListFilters.module.css';
import { CheckCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { StaticFile } from 'generated';
import { TherapistsForPayoutListFiltersForm } from './TherapistsForPayoutListFilters.hooks/useTherapistsForPayoutListFilters';
import { getPeriods } from './TherapistsForPayoutListFilters.utils/getPeriods';
import { getPayoutPeriod } from '../../helpers/getPayoutPeriod';

const { Search } = Input;

type TherapistsForPayoutListFiltersProps = {
  form: FormInstance<TherapistsForPayoutListFiltersForm>;
  onChangeFilters: () => void;
  markPayoutPeriodAsPaid: () => Promise<void>;
  filters: TherapistsForPayoutListFiltersForm;
  finalAmount?: number;
  payoutReport?: StaticFile;
};

export const TherapistsForPayoutListFilters: FC<TherapistsForPayoutListFiltersProps> = ({
  form,
  onChangeFilters,
  markPayoutPeriodAsPaid,
  finalAmount,
  filters,
  payoutReport,
}) => {
  useEffect(() => {
    form.setFieldsValue({
      search: undefined,
      date: moment(),
      period: '1',
    });
  }, [form]);

  const { firstPeriod, secondPeriod, thirdPeriod } = getPeriods(filters.date);
  const dateField = form.getFieldValue('date');
  const periodField = form.getFieldValue('period');

  const isFuturePayoutPeriodSelected = useMemo(() => {
    const todayDate = new Date();
    const payoutPeriod = getPayoutPeriod(todayDate);
    const selectedDate = new Date(dateField);

    return (
      periodField >= payoutPeriod.period &&
      new Date(selectedDate).getFullYear() >= payoutPeriod.year &&
      new Date(selectedDate).getMonth() + 1 >= payoutPeriod.month
    );
  }, [periodField, dateField]);

  return (
    <div className={styles['container']}>
      <div className={styles['left']}>
        <Typography.Text type={'secondary'}>{'Общая сумма  за период'}</Typography.Text>
        <Typography.Text style={{ fontSize: '24px', lineHeight: '32px' }}>{`${Intl.NumberFormat('ru-RU').format(
          finalAmount ?? 0,
        )} \u20bd`}</Typography.Text>
      </div>
      <Form form={form} onValuesChange={onChangeFilters}>
        <div className={styles['right']}>
          <Form.Item name={'search'} style={{ marginBottom: '0' }}>
            <Search allowClear placeholder="Поиск психологов" style={{ maxWidth: '264px' }} />
          </Form.Item>
          <div className={styles['buttons']}>
            <Form.Item name={'date'} style={{ marginBottom: '0' }}>
              <DatePicker allowClear={false} picker={'month'} format={'MMMM YYYY'} />
            </Form.Item>
            <Form.Item style={{ marginBottom: '0' }} name={'period'}>
              <Select
                placeholder="Выберите период"
                options={[
                  {
                    value: '1',
                    label: firstPeriod,
                  },
                  {
                    value: '2',
                    label: secondPeriod,
                  },
                  {
                    value: '3',
                    label: thirdPeriod,
                  },
                ]}
              />
            </Form.Item>
            <Button
              disabled={isFuturePayoutPeriodSelected}
              onClick={markPayoutPeriodAsPaid}
              type={'primary'}
              icon={<CheckCircleOutlined />}
            >
              {'Одобрить все выплаты'}
            </Button>
            <Button href={payoutReport?.url} disabled={!payoutReport} icon={<DownloadOutlined />}>
              {'Выгрузить данные'}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};
