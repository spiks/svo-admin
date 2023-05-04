import { Alert, Avatar, Button, Col, Divider, Modal, ModalProps, Row, Statistic, Typography } from 'antd';
import React, { FC } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getTherapistById } from '../../api/therapist/getTherapistById';
import { UserOutlined } from '@ant-design/icons';
import { NAVIGATION } from '../../constants/navigation';
import { format } from 'date-fns';
import ru from 'date-fns/locale/ru/index';
import { AppointmentStatus } from '../../generated';
import { getAppointmentStatusTranslations } from '../../helpers/getAppointmentStatusTranslations';

const { Text } = Typography;

type Props = ModalProps & {
  fullName: string;
  appointmentId: string;
  endsAt: string;
  startsAt: string;
  status: AppointmentStatus;
  therapistId: string;
  cancelAppointmentButtonClick: () => void;
};

export const AppointmentInfoModal: FC<Props> = ({
  open,
  fullName,
  onCancel,
  therapistId,
  startsAt,
  cancelAppointmentButtonClick,
  endsAt,
  status,
}) => {
  const therapistQuery = useQuery(['therapist', therapistId], getTherapistById.bind(null, therapistId));
  const therapistQueryData = therapistQuery.data?.data;
  const avatarSrc = 'https://' + therapistQueryData?.avatar?.sizes.medium.url;

  return (
    <>
      <Modal
        title={'Сведения о записи'}
        okButtonProps={{ style: { display: 'none' } }}
        cancelText={'Закрыть'}
        cancelButtonProps={{ type: 'primary' }}
        open={open}
        onCancel={onCancel}
      >
        <Row justify={'space-between'} align={'middle'}>
          <Col>
            <Avatar style={{ marginRight: '8px' }} src={avatarSrc} icon={<UserOutlined />} />
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
              <Text strong>{getAppointmentStatusTranslations(status, startsAt)}</Text>
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
        {(status === 'booked' || status === 'paid') && new Date(startsAt) > new Date() && (
          <>
            <Divider />
            <Row justify={'space-around'}>
              {status === 'paid' && <Button type="link">Перенести запись</Button>}
              <Button type="link" onClick={cancelAppointmentButtonClick}>
                Отменить запись
              </Button>
            </Row>
          </>
        )}
      </Modal>
    </>
  );
};
