import { Alert, Avatar, Button, Col, Divider, Modal, ModalProps, Row, Statistic, Typography } from 'antd';
import React, { FC } from 'react';
import Link from 'next/link';
import { AppointmentListingPreview } from '@components/AppointmentsList/AppointmentList.utils.tsx/appointmentToGridView';
import { useQuery } from '@tanstack/react-query';
import { getTherapistById } from '../../api/therapist/getTherapistById';
import { UserOutlined } from '@ant-design/icons';
import { NAVIGATION } from '../../constants/navigation';
import { appointmentStatusTranslations } from '../../constants/appointmentStatusTranslations';
import { format } from 'date-fns';
import ru from 'date-fns/locale/ru/index';

const { Text } = Typography;

type Props = ModalProps & AppointmentListingPreview;

export const AppointmentInfoModal: FC<Props> = ({ open, onCancel, therapistId, startsAt, endsAt, status }) => {
  const therapistQuery = useQuery(['therapist', therapistId], getTherapistById.bind(null, therapistId));
  const therapistQueryData = therapistQuery.data?.data;
  const fullName = [therapistQueryData?.surname, therapistQueryData?.name].filter(Boolean).join(' ').trim();

  return (
    <Modal
      title={'Сведения о записи'}
      okButtonProps={{ style: { display: 'none' } }}
      cancelText={'Закрыть'}
      cancelButtonProps={{ type: 'primary' }}
      open={open}
      onCancel={onCancel}
      onOk={onCancel}
    >
      <Row justify={'space-between'} align={'middle'}>
        <Col>
          <Avatar
            style={{ marginRight: '8px' }}
            src={'https://' + therapistQueryData?.avatar?.sizes.medium.url}
            icon={<UserOutlined />}
          />
          <Link href={`${NAVIGATION.therapists}/${therapistId}`} target="_blank">
            <a>{fullName}</a>
          </Link>
        </Col>
        <Text>{'Парная терапия'}</Text>
      </Row>
      <Divider />
      <Alert
        style={{ border: 0, borderRadius: '16px', marginBottom: '24px' }}
        message={
          <Row justify={'space-between'}>
            <Text>Статус записи:</Text>
            <Text strong>{appointmentStatusTranslations[status]}</Text>
          </Row>
        }
        type="info"
      />
      <Row justify={'space-around'}>
        <Statistic
          style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
          title="Дата"
          value={new Date(startsAt).toLocaleString('ru-RU', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          })}
        />
        <Statistic
          style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
          title="Время сессии"
          value={`${format(new Date(startsAt), 'HH:mm', { locale: ru })}-${format(new Date(endsAt), 'HH:mm', {
            locale: ru,
          })}`}
        />
      </Row>
      <Divider />
      <Row justify={'space-around'}>
        <Button type="link">Перенести запись</Button>
        <Button type="link">Отменить запись</Button>
      </Row>
    </Modal>
  );
};
