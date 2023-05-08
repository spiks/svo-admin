import {
  Avatar,
  Col,
  DatePicker,
  DatePickerProps,
  Divider,
  Modal,
  ModalProps,
  notification,
  Row,
  Space,
  Spin,
  Statistic,
  Tag,
  Typography,
} from 'antd';
import React, { FC, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { UserOutlined } from '@ant-design/icons';
import { NAVIGATION } from '../../constants/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AppointmentServiceWithToken } from '../../api/services';
import { AppointmentType, TherapistProfile } from '../../generated';
import { format } from 'date-fns';
import { getTherapistAvailableAppointmentSlots } from '../../api/therapist/getTherapistAvailableAppointmentSlots';
import { groupByDate } from './RescheduleAppointmentModal.utils/groupByDate';
import { getTimeFromDate } from './RescheduleAppointmentModal.utils/getTimeFromDate';
import { getBundlesFromSlots } from '@components/RescheduleAppointmentModal/RescheduleAppointmentModal.utils/getBundlesFromSlots';
import { dateToFormattedIso8601 } from '../../helpers/dateToFormattedIso8601';
import ru from 'date-fns/locale/ru/index';

const { CheckableTag } = Tag;
const { Text } = Typography;

type Props = Omit<ModalProps, 'onCancel'> & {
  appointmentId: string;
  appointmentType: AppointmentType;
  therapistId: string;
  fullName: string;
  onCancel: () => void;
};

type TherapistQueryData = { status: 'success'; data: TherapistProfile };

export const RescheduleAppointmentModal: FC<Props> = ({
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
  const [isAppointmentRescheduled, setIsAppointmentRescheduled] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlots, setSelectedSlots] = useState<Date[]>([]);
  const [currentDatepickerPanel, setCurrentDatepickerPanel] = useState(new Date());
  const [currentDatepickerMonth, currentDatepickerYear] = useMemo(() => {
    return [currentDatepickerPanel.getMonth(), currentDatepickerPanel.getFullYear()];
  }, [currentDatepickerPanel]);
  const {
    isError: isMonthAvailableAppointmentsFetchingError,
    data: slots,
    refetch,
  } = useQuery(['monthAvailableAppointments', therapistId, currentDatepickerMonth + 1, currentDatepickerYear], () => {
    return getTherapistAvailableAppointmentSlots(therapistId, currentDatepickerMonth + 1, currentDatepickerYear);
  });

  const { mutate: handleRescheduleButtonClick, isLoading } = useMutation(
    () => {
      return AppointmentServiceWithToken.rescheduleAppointment({
        requestBody: {
          arguments: {
            appointmentId,
            therapistId,
            appointmentSlots: selectedSlots.map((date) => {
              return {
                startsAt: dateToFormattedIso8601(date),
              };
            }),
          },
        },
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['appointments-list']);
        refetch();
        setIsAppointmentRescheduled(true);
      },
      onError: () => {
        notification.error({
          type: 'error',
          message: 'Ошибка',
          description: 'Не удалось перенести запись',
        });
        onCancel();
      },
    },
  );

  const groupedByDateSlots = useMemo(
    () => groupByDate(slots?.data.flatMap((it) => it) || [], 'startsAt'),
    [slots?.data],
  );

  useEffect(() => {
    if (isMonthAvailableAppointmentsFetchingError) {
      notification.error({
        type: 'error',
        message: 'Ошибка',
        description: 'Не удалось загрузить доступные слоты!',
      });
    }
  }, [isMonthAvailableAppointmentsFetchingError, slots?.data]);

  const modalProps: ModalProps = {
    title: 'Перенос записи',
    okText: 'Перенести',
    okButtonProps: { disabled: !selectedSlots.length },
    cancelText: 'Закрыть',
    open,
    onCancel,
    onOk: () => handleRescheduleButtonClick(),
  };

  if (isAppointmentRescheduled) {
    modalProps.cancelText = 'Готово';
    modalProps.cancelButtonProps = { type: 'primary' };
    modalProps.okButtonProps = { style: { display: 'none' } };
  }

  const onChange: DatePickerProps['onChange'] = (_, dateString) => {
    setSelectedDate(dateString);
  };

  let content;
  if (isAppointmentRescheduled) {
    content = (
      <Row justify={'space-around'}>
        <Row justify={'space-around'} style={{ width: '100%' }}>
          <Statistic
            style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
            title="Новая дата"
            value={selectedSlots[0].toLocaleString('ru-RU', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
            })}
          />
          <Statistic
            style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
            title="Время проведения"
            value={`${format(selectedSlots[0], 'HH:mm', { locale: ru })}-${format(
              new Date(selectedSlots.at(-1)!.getTime() + 30 * 60000),
              'HH:mm',
              {
                locale: ru,
              },
            )}`}
          />
        </Row>
        <Divider />
        <h2>{'Запись перенесена!'}</h2>
      </Row>
    );
  } else {
    const bundleSize = appointmentType === 'individual' ? 2 : 3;

    const bundlesAvailableForAppointments = getBundlesFromSlots(groupedByDateSlots.get(selectedDate), bundleSize);
    content = isLoading ? (
      <Row justify={'space-around'}>
        <Spin />
      </Row>
    ) : (
      <>
        <DatePicker
          placeholder={'Выберите дату для переноса записи'}
          style={{ width: '100%', marginBottom: '24px' }}
          disabledDate={(date) => {
            const formattedDate = format(new Date(date as unknown as Date), 'yyyy-MM-dd');
            return !groupedByDateSlots.has(formattedDate);
          }}
          onPanelChange={(date) => setCurrentDatepickerPanel(new Date(date as unknown as Date))}
          onChange={onChange}
        />
        {bundlesAvailableForAppointments && (
          <>
            <Text style={{ display: 'block', marginBottom: '9px' }}>Выберите время:</Text>
            <Space size={[0, 8]} wrap>
              {bundlesAvailableForAppointments.map((bundle) => {
                if (!bundle) {
                  return;
                }
                const firstSlot = bundle[0]! as Date;
                const isSelected = JSON.stringify(bundle) === JSON.stringify(selectedSlots);
                const handleClick = () => {
                  setSelectedSlots(bundle);
                };

                return (
                  <CheckableTag key={JSON.stringify(bundle)} checked={isSelected} onChange={handleClick}>
                    {getTimeFromDate(firstSlot)}
                  </CheckableTag>
                );
              })}
            </Space>
          </>
        )}
      </>
    );
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
      {content}
    </Modal>
  );
};
