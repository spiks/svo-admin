import { Avatar, Col, Divider, Modal, ModalProps, notification, Row, Spin, Typography } from 'antd';
import React, { FC, useState } from 'react';
import Link from 'next/link';
import { UserOutlined } from '@ant-design/icons';
import { NAVIGATION } from '../../constants/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AppointmentServiceWithToken } from '../../api/services';
import { AppointmentType, TherapistProfile } from '../../generated';

const { Text } = Typography;

type Props = Omit<ModalProps, 'onCancel'> & {
  fullName: string;
  appointmentId: string;
  therapistId: string;
  onCancel: () => void;
  appointmentType: AppointmentType;
};

type TherapistQueryData = { status: 'success'; data: TherapistProfile };

export const CancelAppointmentModal: FC<Props> = ({
  open,
  onCancel,
  therapistId,
  appointmentId,
  fullName,
  appointmentType,
}) => {
  const queryClient = useQueryClient();
  const therapistQuery = queryClient.getQueryState<TherapistQueryData>(['therapist', therapistId]);
  const therapistQueryData = therapistQuery?.data?.data;
  const avatarSrc = 'https://' + therapistQueryData?.avatar?.sizes.medium.url;

  const [isAppointmentCancelled, setIsAppointmentCancelled] = useState(false);

  const { mutate: handleOkButtonClick, isLoading } = useMutation(
    () => {
      return AppointmentServiceWithToken.cancelAppointment({
        requestBody: {
          arguments: {
            appointmentId,
          },
        },
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['appointments-list']);
        setIsAppointmentCancelled(true);
      },
      onError: () => {
        notification.error({
          type: 'error',
          message: 'Ошибка',
          description: 'Не удалось отменить запись',
        });
        onCancel();
      },
    },
  );

  const modalProps: ModalProps = {
    title: 'Отмена записи',
    okText: 'Отменить',
    cancelText: 'Закрыть',
    open,
    onCancel,
    onOk: () => handleOkButtonClick(),
  };

  if (isAppointmentCancelled) {
    modalProps.cancelText = 'Готово';
    modalProps.cancelButtonProps = { type: 'primary' };
    modalProps.okButtonProps = { style: { display: 'none' } };
  }

  let content;
  if (isAppointmentCancelled) {
    content = <h2>Запись отменена</h2>;
  } else {
    content = isLoading ? <Spin /> : <h2>Уверены, что хотите отменить запись?</h2>;
  }

  return (
    <Modal {...modalProps}>
      <Row justify={'space-between'} align={'middle'}>
        <Col>
          <Avatar style={{ marginRight: '8px' }} src={avatarSrc} icon={<UserOutlined />} />
          <Link href={`${NAVIGATION.therapists}/${therapistId}`} target="_blank">
            <a>{fullName}</a>
          </Link>
        </Col>
        <Text>{appointmentType === 'individual' ? 'Индивидуальная' : 'Парная'}</Text>
      </Row>
      <Divider />
      <Row justify={'space-around'}>{content}</Row>
    </Modal>
  );
};
