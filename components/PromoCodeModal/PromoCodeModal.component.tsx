import { PromoCodeModalSelect } from '@components/PromoCodeModal/PromoCodeModalSelect/PromoCodeModalSelect.component';
import { Alert, Button, Checkbox, Col, Form, FormProps, Input, Modal, Row, Select } from 'antd';
import { getPatientList } from 'api/patient/getPatientList';
import { getTherapistList } from 'api/therapist/getTherapistList';
import { GetPromoCodeResponseSchema, SubmitPromoCodeAuto, SubmitPromoCodeB2b, SubmitPromoCodeInput } from 'generated';
import { FC, useEffect } from 'react';
import { extractFullName } from '../../utility/extractFullName';

export type SelectedUsersType = {
  forTherapists: string[];
  forPatients: string[];
};

export type PromoCodeFormAutoViewModel = Omit<SubmitPromoCodeAuto, 'forTherapists' | 'forPatients'> & SelectedUsersType;

export type PromoCodeFormInputViewModel = Omit<SubmitPromoCodeInput, 'forTherapists' | 'forPatients'> &
  SelectedUsersType;

export type PromoCodeFormB2bViewModel = Omit<SubmitPromoCodeB2b, 'forTherapists' | 'forPatients'> & SelectedUsersType;

export type PromoCodeFormViewModel =
  | PromoCodeFormInputViewModel
  | PromoCodeFormAutoViewModel
  | PromoCodeFormB2bViewModel;

type PromoCodeModalProps = {
  isOpen: boolean;
  onSubmit: (values: PromoCodeFormViewModel) => void;
  onCancel: () => void;
  title: string;
  isEdit?: boolean;
  promoCode?: GetPromoCodeResponseSchema;
};

export const PromoCodeModal: FC<PromoCodeModalProps> = ({
  isOpen,
  onSubmit,
  onCancel,
  title,
  isEdit = false,
  promoCode,
}) => {
  const [promoCodeForm] = Form.useForm<
    PromoCodeFormAutoViewModel | PromoCodeFormInputViewModel | PromoCodeFormB2bViewModel
  >();

  const handleSubmit: FormProps<PromoCodeFormViewModel>['onFinish'] = (formValues) => {
    onSubmit(formValues);
  };

  const fetchTherapistsList = (offset: number, search: string) => {
    return getTherapistList({
      search: {
        fullName: search || null,
        phone: null,
      },
      pagination: {
        count: 10,
        offset,
      },
      mainSpecialization: null,
      orderBy: {
        field: 'createdAt',
        orderDirection: 'asc',
      },
      statuses: ['active'],
    });
  };

  const fetchPatientsList = (offset: number, search: string) => {
    return getPatientList({
      search: {
        fullName: search || null,
        phone: null,
      },
      pagination: {
        count: 10,
        offset,
      },
      orderBy: {
        field: 'createdAt',
        orderDirection: 'asc',
      },
    });
  };

  useEffect(() => {
    promoCodeForm.setFieldsValue(
      promoCode?.type === 'b2b'
        ? {
            ...promoCode,
            forPatients: promoCode.forPatients.patientProfiles,
            forTherapists: promoCode.forTherapists.therapistProfiles,
          }
        : {
            ...promoCode,
            forTherapists:
              promoCode?.forTherapists.type === 'all'
                ? []
                : promoCode?.forTherapists.therapistProfiles.map((it) => {
                    return it.id;
                  }),
            forPatients:
              promoCode?.forPatients.type === 'all'
                ? []
                : promoCode?.forPatients.patientProfiles.map((it) => {
                    return it.id;
                  }),
          },
    );
  }, [promoCode, promoCodeForm, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      promoCodeForm.resetFields();
    }
  }, [isOpen, promoCodeForm]);

  return (
    <Modal title={title} open={isOpen} onCancel={onCancel} footer={null}>
      <Form
        initialValues={{
          forTherapists: ['all'],
          forPatients: ['all'],
          type: 'auto',
          isActive: false,
          isDisposable: false,
          serviceDiscount: undefined,
          title: '',
          therapistDiscount: undefined,
        }}
        layout="vertical"
        form={promoCodeForm}
        onFinish={handleSubmit}
      >
        <Form.Item
          rules={[{ required: true, message: 'Заполните недостающие поля' }]}
          normalize={(value: string) => {
            return value.toUpperCase();
          }}
          name={'title'}
          label={'Текст промокода'}
        >
          <Input showCount type="text" placeholder="Введите текст промокода" maxLength={20} />
        </Form.Item>
        <Form.Item name={'type'} label={'Тип'}>
          <Select defaultValue={'auto'}>
            <Select.Option value="input">Для ввода</Select.Option>
            <Select.Option value="auto">Автоматический</Select.Option>
            <Select.Option value="b2b">B2B</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => {
            return prevValues.type !== currentValues.type;
          }}
        >
          {({ getFieldValue }) =>
            getFieldValue('type') !== 'b2b' ? (
              <>
                <Form.Item
                  normalize={(value) => {
                    return +value;
                  }}
                  name={'serviceDiscount'}
                  label={'Скидка за счет площадки в процентах'}
                  rules={[{ required: true, message: 'Заполните недостающие поля' }]}
                >
                  <Input type={'number'} min={0} max={30} />
                </Form.Item>
                <Form.Item
                  normalize={(value) => {
                    return +value;
                  }}
                  name={'therapistDiscount'}
                  label={'Скидка за счет терапевта в процентах'}
                  rules={[{ required: true, message: 'Заполните недостающие поля' }]}
                >
                  <Input type={'number'} min={0} max={70} />
                </Form.Item>
                <Form.Item name={'isDisposable'} valuePropName="checked" label={'Одноразовый промокод'}>
                  <Checkbox />
                </Form.Item>
              </>
            ) : null
          }
        </Form.Item>
        <Form.Item name={'isActive'} label={'Активный промокод'} valuePropName="checked">
          <Checkbox />
        </Form.Item>
        <Form.Item name={'forTherapists'} label={'Психологи'}>
          <PromoCodeModalSelect
            placeholder={'Выберите психологов, к которым будет применяться промокод'}
            queryKey={['therapistList']}
            fetchData={fetchTherapistsList}
            renderOptions={(data) => {
              return data?.pages.flatMap(({ data }) => {
                return data.items.map((it) => {
                  const fullName = extractFullName({ name: it.name, surname: it.surname });
                  return { value: it.id, label: fullName };
                });
              });
            }}
            queryOptions={{
              getNextPageParam: (lastPage, allPages) => {
                const offset = allPages.reduce((accum, page) => {
                  return accum + page.data.items.length;
                }, 0);
                return lastPage.data.itemsAmount === offset ? undefined : offset;
              },
              staleTime: Infinity,
            }}
          />
        </Form.Item>
        <Form.Item name={'forPatients'} label={'Пациенты'}>
          <PromoCodeModalSelect
            placeholder={'Выберите пациентов, к которым будет применяться промокод'}
            queryKey={['patientList']}
            fetchData={fetchPatientsList}
            renderOptions={(data) => {
              return data?.pages.flatMap(({ data }) => {
                return data.items.map((it) => {
                  const fullName = extractFullName({ name: it.name, surname: it.surname });
                  return { value: it.id, label: fullName };
                });
              });
            }}
            queryOptions={{
              getNextPageParam: (lastPage, allPages) => {
                const offset = allPages.reduce((accum, page) => {
                  return accum + page.data.items.length;
                }, 0);
                return lastPage.data.itemsAmount === offset ? undefined : offset;
              },
              staleTime: Infinity,
            }}
          />
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => {
            return prevValues.type !== currentValues.type;
          }}
        >
          {({ getFieldValue }) =>
            getFieldValue('type') !== 'b2b' ? (
              <>
                <Alert
                  style={{ marginBottom: '24px' }}
                  message={'Обратите внимание!'}
                  description={' Пустой список психологов/пациентов будет означать, что промокод применяется ко всем.'}
                  type="warning"
                  showIcon
                />
              </>
            ) : null
          }
        </Form.Item>
        <Row justify={'space-between'}>
          <Col>
            <Button onClick={onCancel}>{'Отменить'}</Button>
          </Col>
          <Col>
            <Button type={'primary'} htmlType={'submit'}>
              {isEdit ? 'Сохранить' : 'Добавить'}
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
