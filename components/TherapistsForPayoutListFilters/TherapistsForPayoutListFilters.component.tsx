import { Button, DatePicker, Form, FormInstance, Input, Select, Spin, Typography } from 'antd';
import { FC, useEffect, useRef } from 'react';
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
  periodIsPaid: boolean;
  isFetchingPayoutReport: boolean;
  isFetchingFinalAmount: boolean;
  isFetchingTherapists: boolean;
  isDisabled: boolean;
  finalAmount?: number;
  payoutReport?: StaticFile;
};

export const TherapistsForPayoutListFilters: FC<TherapistsForPayoutListFiltersProps> = ({
  form,
  onChangeFilters,
  markPayoutPeriodAsPaid,
  finalAmount,
  payoutReport,
  periodIsPaid,
  isFetchingFinalAmount,
  isFetchingPayoutReport,
  isDisabled,
  isFetchingTherapists,
}) => {
  const todayDate = useRef(new Date());
  useEffect(() => {
    form.setFieldsValue({
      search: undefined,
      date: moment(),
      period: getPayoutPeriod(todayDate.current).period,
    });
  }, [form]);

  const selectedDate = new Date(form.getFieldValue('date'));
  const periodField = form.getFieldValue('period');
  const payoutPeriod = getPayoutPeriod(todayDate.current);

  const isFuturePayoutPeriodSelected =
    periodField >= payoutPeriod.period &&
    new Date(selectedDate).getFullYear() >= payoutPeriod.year &&
    new Date(selectedDate).getMonth() >= payoutPeriod.month;

  const { firstPeriod, secondPeriod, thirdPeriod } = getPeriods(moment(selectedDate));

  const renderButton = () => {
    if (!periodIsPaid) {
      return (
        <Button
          style={{ width: '100%' }}
          disabled={isFuturePayoutPeriodSelected || isDisabled}
          onClick={markPayoutPeriodAsPaid}
          type={'primary'}
          icon={<CheckCircleOutlined />}
        >
          {'Одобрить выплаты'}
        </Button>
      );
    }
    return (
      <div className={styles['paid']}>
        <CheckCircleOutlined />
        <Typography.Text style={{ color: '#ffffff' }}>{'Одобрено'}</Typography.Text>
      </div>
    );
  };

  return (
    <div className={styles['container']}>
      <div className={styles['left']}>
        <Typography.Text type={'secondary'}>{'Общая сумма  за период'}</Typography.Text>
        {isFetchingFinalAmount ? (
          <Spin />
        ) : (
          <Typography.Text style={{ fontSize: '24px', lineHeight: '32px' }}>{`${Intl.NumberFormat('ru-RU').format(
            finalAmount ?? 0,
          )} \u20bd`}</Typography.Text>
        )}
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
            <div style={{ minWidth: '182px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isFetchingTherapists ? <Spin /> : renderButton()}
            </div>
            <Button
              loading={isFetchingPayoutReport}
              href={payoutReport?.url}
              disabled={!payoutReport}
              icon={<DownloadOutlined />}
            >
              {'Выгрузить данные'}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};
