import React, { FC, useCallback, useEffect, useState } from 'react';
import { Button, Table } from 'antd';
import { ColumnsType, SortOrder } from 'antd/lib/table/interface';
import { sortOrderCuts } from '../../helpers/sortOrderCuts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AppointmentServiceWithToken } from '../../api/services';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { NAVIGATION } from '../../constants/navigation';
import {
  AppointmentGridView,
  appointmentToGridView,
} from '@components/AppointmentsList/AppointmentList.utils.tsx/appointmentToGridView';
import { AppointmentInfoModal } from '@components/AppointmentInfoModal/AppointmentInfoModal.component';
import { CancelAppointmentModal } from '@components/CancelAppointementModal/CancelAppointementModal.component';
import { getAppointmentStatusTranslations } from '../../helpers/getAppointmentStatusTranslations';
import { RescheduleAppointmentModal } from '@components/RescheduleAppointmentModal/RescheduleAppointmentModal.component';

const AppointmentsList: FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortOrder, setSortOrder] = useState<NonNullable<SortOrder>>('descend');
  const [isAppointmentInfoModalOpen, setIsAppointmentInfoModalOpen] = useState<AppointmentGridView>();
  const [isCancelAppointmentModalOpen, setIsCancelAppointmentModalOpen] = useState<AppointmentGridView>();
  const [isRescheduleAppointmentModalOpen, setIsRescheduleAppointmentModalOpen] = useState<AppointmentGridView>();

  const handleOpenCancelAppointmentModal = useCallback(() => {
    setIsAppointmentInfoModalOpen((prevState) => {
      setIsCancelAppointmentModalOpen(prevState);
      return undefined;
    });
  }, []);

  const handleOpenRescheduleAppointmentModal = useCallback(() => {
    setIsAppointmentInfoModalOpen((prevState) => {
      setIsRescheduleAppointmentModalOpen(prevState);
      return undefined;
    });
  }, []);

  const handleCloseCancelAppointmentModal = useCallback(() => {
    setIsCancelAppointmentModalOpen(undefined);
  }, []);

  const handleCloseRescheduleAppointmentModal = useCallback(() => {
    setIsRescheduleAppointmentModalOpen(undefined);
  }, []);

  const handleCloseAppointmentInfoModal = useCallback(() => setIsAppointmentInfoModalOpen(undefined), []);

  const handlePaginationChange = useCallback((page: number, pageSize: number) => {
    setPageSize(pageSize);
    setPage(page);
  }, []);

  const router = useRouter();

  const patientId = (router.query['id'] as string) || null;

  const fetchAppointmentsList = useCallback(
    (page) => {
      return AppointmentServiceWithToken.listAppointments({
        requestBody: {
          arguments: {
            filter: { patientId, therapistId: null, statuses: [] },
            pagination: {
              count: pageSize,
              offset: page * pageSize,
            },
            sorting: {
              direction: sortOrderCuts[sortOrder],
              field: 'startsAt',
            },
          },
        },
      });
    },
    [patientId, pageSize, sortOrder],
  );

  const queryClient = useQueryClient();

  const getQueryKey = useCallback(
    (page) => {
      return ['appointments-list', patientId, page, pageSize, sortOrder];
    },
    [patientId, pageSize, sortOrder],
  );

  const { isFetching, data: appointmentsList } = useQuery(
    getQueryKey(page),
    () => {
      return fetchAppointmentsList(page - 1);
    },
    {
      keepPreviousData: true,
      retryDelay: 3000,
    },
  );

  useEffect(() => {
    if (appointmentsList && appointmentsList.data.itemsAmount > page * pageSize) {
      queryClient.prefetchQuery(getQueryKey(page + 1), () => {
        return fetchAppointmentsList(page);
      });
    }
  }, [appointmentsList, fetchAppointmentsList, getQueryKey, page, pageSize, queryClient]);

  const columns: ColumnsType<AppointmentGridView> = [
    {
      title: 'Дата и время',
      dataIndex: 'date',
      defaultSortOrder: 'descend' as const,
      sorter: (a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      },
      width: 200,
    },
    {
      title: 'Длительность',
      dataIndex: 'duration',
      width: 153,
    },
    {
      title: 'Психолог',
      dataIndex: 'therapist',
      width: 313,
      render: (therapist) => (
        <Link href={`${NAVIGATION.therapists}/${therapist.id}`}>
          <a>{therapist.fullName}</a>
        </Link>
      ),
    },
    {
      title: 'Стоимость',
      dataIndex: 'price',
      width: 153,
    },
    {
      title: 'Статус записи',
      dataIndex: 'status',
      width: 200,
      render: (_, appointment) => getAppointmentStatusTranslations(appointment.status, appointment.startsAt),
    },
    {
      title: 'Действие',
      dataIndex: 'appointment',
      render: (_, appointment) => (
        <Button
          type={'link'}
          onClick={() => {
            setIsAppointmentInfoModalOpen(appointment);
          }}
        >
          Сведения
        </Button>
      ),
      width: 96,
    },
  ];

  return (
    <>
      <Table
        locale={{
          triggerDesc: 'Сортировать по убыванию',
          triggerAsc: 'Сортировать по возрастанию',
        }}
        loading={isFetching}
        sortDirections={['ascend', 'descend', 'ascend']}
        onChange={(pagination, filters, sorter) => {
          if (sorter && !Array.isArray(sorter) && sorter.order) {
            setSortOrder(sorter.order);
          }
        }}
        columns={columns}
        dataSource={appointmentsList?.data.items.map(appointmentToGridView)}
        pagination={{
          current: page,
          pageSize: pageSize,
          pageSizeOptions: [10, 20, 50],
          onChange: handlePaginationChange,
          total: appointmentsList?.data.itemsAmount,
        }}
      />
      {isAppointmentInfoModalOpen && (
        <AppointmentInfoModal
          appointmentType={isAppointmentInfoModalOpen.appointmentType}
          fullName={isAppointmentInfoModalOpen.therapist.fullName}
          cancelAppointmentButtonClick={handleOpenCancelAppointmentModal}
          rescheduleAppointmentButtonClick={handleOpenRescheduleAppointmentModal}
          appointmentId={isAppointmentInfoModalOpen.appointmentId}
          endsAt={isAppointmentInfoModalOpen.endsAt}
          startsAt={isAppointmentInfoModalOpen.startsAt}
          status={isAppointmentInfoModalOpen.status}
          therapistId={isAppointmentInfoModalOpen.therapist.id}
          open={!!isAppointmentInfoModalOpen}
          onCancel={handleCloseAppointmentInfoModal}
        />
      )}
      {isCancelAppointmentModalOpen && (
        <CancelAppointmentModal
          appointmentType={isCancelAppointmentModalOpen.appointmentType}
          open={!!isCancelAppointmentModalOpen}
          onCancel={handleCloseCancelAppointmentModal}
          fullName={isCancelAppointmentModalOpen.therapist.fullName}
          appointmentId={isCancelAppointmentModalOpen.appointmentId}
          therapistId={isCancelAppointmentModalOpen.therapist.id}
        />
      )}
      {isRescheduleAppointmentModalOpen && (
        <RescheduleAppointmentModal
          appointmentType={isRescheduleAppointmentModalOpen.appointmentType}
          open={!!isRescheduleAppointmentModalOpen}
          onCancel={handleCloseRescheduleAppointmentModal}
          fullName={isRescheduleAppointmentModalOpen.therapist.fullName}
          appointmentId={isRescheduleAppointmentModalOpen.appointmentId}
          therapistId={isRescheduleAppointmentModalOpen.therapist.id}
        />
      )}
    </>
  );
};

export default AppointmentsList;
