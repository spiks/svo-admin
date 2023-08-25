import { Button, Col, notification, Row, Table, Typography } from 'antd';
import {
  ListPromoCodesPreviewAuto,
  ListPromoCodesPreviewB2b,
  ListPromoCodesPreviewInput,
  SubmitPromoCodeRequestSchema,
  UpdatePromoCodeRequestSchema,
} from 'generated';
import { FC, useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { getListPromoCodes } from 'api/promoCodes/getListPromoCodes';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ColumnsType } from 'antd/lib/table';
import { submitPromoCode } from 'api/promoCodes/submitPromoCode';
import { promoCodeType } from 'constants/promoCodeType';
import { updatePromoCode } from 'api/promoCodes/updatePromoCode';
import { usePromoCodeModal } from '@components/PromoCodeModal/PromoCodeModal.hooks/usePromoCodeModal';
import {
  PromoCodeFormAutoViewModel,
  PromoCodeFormB2bViewModel,
  PromoCodeFormInputViewModel,
  PromoCodeFormViewModel,
  PromoCodeModal,
} from '@components/PromoCodeModal/PromoCodeModal.component';
import { ApiRegularError } from 'api/errorClasses';
import { getPromoCode } from 'api/promoCodes/getPromoCode';

export const PromoCodesTable: FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { editablePromoCodeId, promoCodeModalType, changeEditablePromoCodeId, changePromoCodeModalType } =
    usePromoCodeModal();

  const handleEditPromoCode = (id: string | undefined) => {
    changeEditablePromoCodeId(id);

    changePromoCodeModalType('edit');
  };

  const handleShowPromoCodeModal = () => {
    changePromoCodeModalType('add');
  };

  const handleHidePromoCodeModal = () => {
    changePromoCodeModalType(undefined);
  };

  const fetchPromoCodesList = (page: number) => {
    return getListPromoCodes({
      pagination: {
        count: pageSize,
        offset: page * pageSize,
      },
    });
  };

  const getQueryKey = (page: number) => {
    return ['promoCodesList', page];
  };

  const { data: promoCodesList, refetch } = useQuery(getQueryKey(page), () => {
    return fetchPromoCodesList(page - 1);
  });

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPageSize(pageSize);
    setPage(page);
  };

  const promoCodeFormViewModelToRequestDataMapper = (
    formValues: PromoCodeFormAutoViewModel | PromoCodeFormInputViewModel | PromoCodeFormB2bViewModel,
  ): SubmitPromoCodeRequestSchema | UpdatePromoCodeRequestSchema => {
    switch (formValues.type) {
      case 'b2b':
        return {
          ...formValues,
        };
      default:
        return {
          ...formValues,
          forTherapists: !formValues.forTherapists?.length
            ? { type: 'all' }
            : { type: 'selected', therapistIds: formValues.forTherapists },
          forPatients: !formValues.forPatients?.length
            ? { type: 'all' }
            : { type: 'selected', patientIds: formValues.forPatients },
        };
    }
  };

  const { data: promoCode, refetch: refetchPromoCode } = useQuery(
    ['promoCode', editablePromoCodeId],
    () => {
      return getPromoCode({ id: editablePromoCodeId || '' });
    },
    {
      enabled: !!editablePromoCodeId,
    },
  );

  const handleSubmitPromoCode = useMutation(
    (values: PromoCodeFormViewModel) => {
      return submitPromoCode(promoCodeFormViewModelToRequestDataMapper(values));
    },
    {
      onSuccess() {
        notification.success({
          message: 'Промокод',
          description: 'Промокод добавлен',
        });
        handleHidePromoCodeModal();
        refetch();
      },
      onError(error) {
        if (error instanceof ApiRegularError) {
          switch (error.error.type) {
            case 'promo_code_with_title_already_exists':
              return notification.error({
                message: 'Промокод',
                description: 'Промокод с таким названием уже существует',
              });
            case 'promo_code_discount_equals_zero':
              return notification.error({
                message: 'Промокод',
                description: 'Скидка промокода не может быть равна 0',
              });
            default:
              return notification.error({
                message: 'Промокод',
                description: 'Не удалось обновить промокод',
              });
          }
        }
      },
    },
  );

  const handleUpdatePromocode = useMutation(
    (values: PromoCodeFormViewModel) => {
      const mappedValues = promoCodeFormViewModelToRequestDataMapper(values);
      return updatePromoCode({ ...mappedValues, id: editablePromoCodeId || '' });
    },
    {
      onSuccess() {
        notification.success({
          message: 'Промокод',
          description: 'Промокод обновлен',
        });
        handleHidePromoCodeModal();
        refetchPromoCode();
        refetch();
      },
      onError(error) {
        if (error instanceof ApiRegularError) {
          switch (error.error.type) {
            case 'first_promo_code_can_not_be_updated':
              return notification.error({
                message: 'Промокод',
                description: 'Данный промокод нельзя обновить',
              });
            case 'promo_code_with_title_already_exists':
              return notification.error({
                message: 'Промокод',
                description: 'Промокод с таким названием уже существует',
              });
            case 'promo_code_discount_equals_zero':
              return notification.error({
                message: 'Промокод',
                description: 'Скидка промокода не может быть равна 0',
              });
            default:
              return notification.error({
                message: 'Промокод',
                description: 'Не удалось обновить промокод',
              });
          }
        }
      },
    },
  );

  const columns: ColumnsType<ListPromoCodesPreviewAuto | ListPromoCodesPreviewB2b | ListPromoCodesPreviewInput> = [
    {
      title: 'Текст промокода',
      dataIndex: 'title',
      width: '20%',
    },
    {
      title: 'Размер скидки',
      dataIndex: 'totalDiscount',
      width: '20%',
      render: (_, { serviceDiscount, therapistDiscount }) => {
        return (serviceDiscount + therapistDiscount).toString();
      },
    },
    {
      title: 'Скидка сервиса',
      dataIndex: 'serviceDiscount',
      width: '20%',
    },
    {
      title: 'Скидка психолога',
      dataIndex: 'therapistDiscount',
      width: '20%',
    },
    {
      title: 'Тип',
      dataIndex: 'type',
      width: '25%',
      render: (_, { type }) => {
        return promoCodeType[type];
      },
    },
    {
      title: 'Психологи',
      dataIndex: 'forTherapists',
      width: '20%',
      render: (_, { forTherapists }) => {
        return forTherapists.type === 'all' ? 'Все' : forTherapists.amount;
      },
    },
    {
      title: 'Пользователи',
      dataIndex: 'forPatients',
      width: '20%',
      render: (_, { forPatients }) => {
        return forPatients.type === 'all' ? 'Все' : forPatients.amount;
      },
    },
    {
      title: 'Статус',
      dataIndex: 'isActive',
      width: '40%',
      render: (_, { isActive }) => {
        return isActive ? 'Активен' : 'Отключен';
      },
    },
    {
      title: 'Тип промокода',
      dataIndex: 'isDisposable',
      width: '40%',
      render: (_, { isDisposable }) => {
        return isDisposable ? 'Одноразовый' : 'Многоразовый';
      },
    },
    {
      dataIndex: 'operation',
      render: (_, { id }) => {
        return (
          <Typography.Link
            onClick={() => {
              handleEditPromoCode(id);
            }}
          >
            <EditOutlined />
          </Typography.Link>
        );
      },
    },
  ];

  return (
    <div style={{ padding: '16px', backgroundColor: 'white' }}>
      <Row style={{ padding: '16px 8px' }} justify={'space-between'}>
        <Col>
          <h3>{'Список промокодов'}</h3>
        </Col>
        <Col>
          <Button onClick={handleShowPromoCodeModal} type={'primary'}>
            {'Добавить промокод'}
          </Button>
        </Col>
      </Row>

      <Table
        dataSource={promoCodesList?.data.items}
        columns={columns}
        pagination={{
          onChange: handlePaginationChange,
          current: page,
          pageSize: pageSize,
          total: promoCodesList?.data.itemsAmount,
        }}
      />
      <PromoCodeModal
        title={'Создание промокода'}
        isOpen={promoCodeModalType === 'add'}
        onSubmit={handleSubmitPromoCode.mutate}
        onCancel={handleHidePromoCodeModal}
      />
      <PromoCodeModal
        isEdit={true}
        promoCode={promoCode?.data}
        title={'Редактирование промокода'}
        isOpen={promoCodeModalType === 'edit'}
        onSubmit={handleUpdatePromocode.mutate}
        onCancel={handleHidePromoCodeModal}
      />
    </div>
  );
};
