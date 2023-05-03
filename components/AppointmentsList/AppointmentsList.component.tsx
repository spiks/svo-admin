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
  AppointmentListingPreview,
  appointmentToGridView,
} from '@components/AppointmentsList/AppointmentList.utils.tsx/appointmentToGridView';
import { AppointmentInfoModal } from '@components/AppointmentInfoModal/AppointmentInfoModal.component';

const AppointmentsList: FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortOrder, setSortOrder] = useState<NonNullable<SortOrder>>('descend');
  const [appointmentModalOpen, setAppointmentModalOpen] = useState<AppointmentListingPreview>();

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
      title: 'Статус',
      dataIndex: 'status',
      width: 200,
    },
    {
      title: 'Действие',
      dataIndex: 'appointment',
      render: (appointment) => (
        <Button type={'link'} onClick={() => setAppointmentModalOpen(appointment)}>
          Сведения
        </Button>
      ),
      width: 96,
    },
  ];
  const handleClose = () => setAppointmentModalOpen(undefined);

  return (
    <>
      <Table
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
      {appointmentModalOpen && (
        <AppointmentInfoModal {...appointmentModalOpen} open={!!appointmentModalOpen} onCancel={handleClose} />
      )}
      {/*<Divider />*/}
      {/*<div>*/}
      {/*  <Paragraph type="secondary">1. Conveniently foster sticky technology and covalent platforms.</Paragraph>*/}
      {/*  <Paragraph type="secondary">*/}
      {/*    2. Synergistically seize client-centered methods of empowerment whereas cross functional interfaces.*/}
      {/*    Interactively conceptualize corporate technologies via future-proof growth strategies. Synergistically seize*/}
      {/*    client-centered methods of empowerment whereas cross functional interfaces. Interactively conceptualize*/}
      {/*    corporate technologies via future-proof growth strategies.*/}
      {/*  </Paragraph>*/}
      {/*</div>*/}
    </>
  );
};

export default AppointmentsList;
