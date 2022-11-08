import React, { FC, useContext } from 'react';
import { Button, Col, Collapse, DatePicker, Form, FormProps, Input, notification, Row, Select, Upload } from 'antd';
import { CheckCircleFilled, CloseCircleFilled, DeleteFilled } from '@ant-design/icons';

import { TherapistPageContext } from 'pages/users/therapists/[id]';
import moment from 'moment';
import {
  InnInformation,
  RussianDiplomaOfHigherEducation,
  RussianPassportInformation,
  SnilsInformation,
} from 'generated';
import { updateTherapistPassport } from 'api/therapist/updateTherapistPassport';
import { updateTherapistSnils } from 'api/therapist/updateTherapistSnils';
import { updateTherapistInn } from 'api/therapist/updateTherapistInn';
import { updateTherapistDiplomaOfHigherEducation } from 'api/therapist/updateTherapistDiplomaOfHigherEducation';
import { useTherapistSignupQueriesRefresh } from 'hooks/useTherapistSignupQueries';

const { Panel } = Collapse;
const { TextArea } = Input;

const genderOptions: { value: 'male' | 'female'; label: string }[] = [
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
];

const statusOptions: { value: string; label: string }[] = [
  {
    value: 'accepted',
    label: 'Подтверждён',
  },
  {
    value: 'rejected',
    label: 'Отклонён',
  },
];

export const countryOptions = [
  {
    value: 'russia',
    label: 'Россия',
  },
];

export const UserProfileDocumentsForm: FC = () => {
  // const [isModalVisible, setIsModalVisible] = useState(false);

  const { documents, therapist } = useContext(TherapistPageContext);

  const { passport, inn, snils, diploma } = documents;

  const refetch = useTherapistSignupQueriesRefresh(therapist.id);

  // Изменение паспорта

  const submitPassportForm: FormProps<RussianPassportInformation>['onFinish'] = async (values) => {
    try {
      await updateTherapistPassport({
        passportInformation: {
          ...values,
          issuedAt: moment(values.issuedAt).format('YYYY-MM-DD'),
          birthday: moment(values.birthday).format('YYYY-MM-DD'),
        },
        therapistId: therapist.id,
      });
      notification.success({
        type: 'success',
        message: 'Успех',
        description: 'Паспорт сохранён',
      });
    } catch (e) {
      notification.error({
        type: 'error',
        message: 'Ошибка',
        description: 'Не удалось сохранить паспорт.',
      });
    }
  };

  // Изменение СНИЛС

  const submitSnilsForm: FormProps<SnilsInformation>['onFinish'] = async (values) => {
    try {
      await updateTherapistSnils({
        snilsInformation: { ...values },
        therapistId: therapist.id,
      });
      notification.success({
        type: 'success',
        message: 'Успех',
        description: 'СНИЛС сохранён',
      });
    } catch (e) {
      notification.error({
        type: 'error',
        message: 'Ошибка',
        description: 'Не удалось сохранить СНИЛС.',
      });
    }
  };

  // Изменение ИНН

  const submitInnForm: FormProps<InnInformation>['onFinish'] = async (values) => {
    try {
      await updateTherapistInn({
        innInformation: { ...values },
        therapistId: therapist.id,
      });
      notification.success({
        type: 'success',
        message: 'Успех',
        description: 'ИНН сохранён',
      });
    } catch (e) {
      notification.error({
        type: 'error',
        message: 'Ошибка',
        description: 'Не удалось сохранить ИНН.',
      });
    }
  };

  // const handleOk = () => {
  //   setIsModalVisible(false);
  // };

  // const handleCancel = () => {
  //   setIsModalVisible(false);
  // };

  return (
    <>
      <h2 style={{ marginBottom: '24px' }}>Документы, подтверждающие персональные данные</h2>
      <Collapse style={{ width: '100%', marginBottom: '24px' }} expandIconPosition={'end'}>
        {/* Паспорт */}
        <Panel
          extra={
            <Form.Item style={{ margin: '0' }} label={'Статус'}>
              <Select
                defaultValue={passport?.isApprovedByModerator ? 'accepted' : 'rejected'}
                options={statusOptions}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                style={{ width: '133px' }}
              />
            </Form.Item>
          }
          header={
            <Row align="middle" gutter={17.5}>
              <Col>
                {passport?.isApprovedByModerator ? (
                  <CheckCircleFilled style={{ color: '#A0D911', fontSize: '21px' }} />
                ) : (
                  <CloseCircleFilled style={{ color: '#F5222D', fontSize: '21px' }} />
                )}
              </Col>
              <Col>
                <Form.Item style={{ margin: '0' }} label="Паспорт" required tooltip />
              </Col>
            </Row>
          }
          key="1"
        >
          <Form
            onFinish={submitPassportForm}
            initialValues={{
              country: passport?.information.country,
              fullName: passport?.information.fullName,
              gender: passport?.information.gender,
              birthday: moment(passport?.information.birthday),
              placeOfBirth: passport?.information.placeOfBirth,
              serial: passport?.information.serial,
              number: passport?.information.number,
              issuedAt: moment(passport?.information.issuedAt),
              issuerId: passport?.information.issuerId,
              issuerName: passport?.information.issuerName,
            }}
            size="large"
            layout="vertical"
          >
            <Col span={12}>
              <Form.Item
                rules={[{ required: true, message: 'Пожалуйста, введите ФИО' }]}
                name={'fullName'}
                label={'ФИО'}
              >
                <Input maxLength={255} />
              </Form.Item>
            </Col>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name={'gender'} label={'Пол'}>
                  <Select options={genderOptions} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  rules={[{ required: true, message: 'Пожалуйста, выберите дату рождения' }]}
                  name={'birthday'}
                  label={'Дата рождения'}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name={'country'} label={'Гражданство'}>
                  <Select options={countryOptions} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  rules={[{ required: true, message: 'Пожалуйста, введите город' }]}
                  name={'placeOfBirth'}
                  label={'Место рождения'}
                >
                  <Input maxLength={255} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  rules={[{ required: true, message: 'Пожалуйста, введите серию паспорта', pattern: /^[0-9]{4}$/ }]}
                  name={'serial'}
                  label={'Серия'}
                >
                  <Input maxLength={4} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  rules={[{ required: true, message: 'Пожалуйста, введите серию паспорта', pattern: /^[0-9]{6}$/ }]}
                  name={'number'}
                  label={'Номер'}
                >
                  <Input maxLength={6} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  rules={[{ required: true, message: 'Пожалуйста, выберите дату выдачи' }]}
                  name={'issuedAt'}
                  label={'Дата выдачи'}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: 'Пожалуйста, введите код подразделения в формате 000-000',
                      pattern: /^[0-9]{3}-[0-9]{3}$/,
                    },
                  ]}
                  name={'issuerId'}
                  label={'Код подразделения'}
                >
                  <Input maxLength={7} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: 'Поле обязательное для заполения',
                },
              ]}
              name={'issuerName'}
              label={'Кем выдан'}
            >
              <TextArea maxLength={255} />
            </Form.Item>
            <Row align="middle" justify="space-between">
              <Col>
                <Form.Item>
                  {passport && (
                    <Upload
                      showUploadList={{
                        showRemoveIcon: false,
                      }}
                      defaultFileList={[
                        {
                          uid: passport.document.originalFileName,
                          name: passport?.document.originalFileName,
                          url: passport?.document.url,
                        },
                      ]}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button htmlType={'submit'} type="primary">
                    ОК
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Panel>
        {/* СНИЛС */}
        <Panel
          extra={
            <Form.Item style={{ margin: '0' }} label={'Статус'}>
              <Select
                defaultValue={snils?.isApprovedByModerator ? 'accepted' : 'rejected'}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                style={{ width: '133px' }}
                options={statusOptions}
              />
            </Form.Item>
          }
          header={
            <Row align="middle" gutter={17.5}>
              <Col>
                {snils?.isApprovedByModerator ? (
                  <CheckCircleFilled style={{ color: '#A0D911', fontSize: '21px' }} />
                ) : (
                  <CloseCircleFilled style={{ color: '#F5222D', fontSize: '21px' }} />
                )}
              </Col>
              <Col>
                <Form.Item style={{ margin: '0' }} label="СНИЛС" required tooltip />
              </Col>
            </Row>
          }
          key="2"
        >
          <Form
            initialValues={{
              number: snils?.information.number,
            }}
            size="large"
            layout="vertical"
            onFinish={submitSnilsForm}
          >
            <Row align="bottom" justify="space-between">
              <Col>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: 'Пожалуйста, введите номер СНИЛС в формате 000-000-000 00',
                      pattern: /^[0-9]{3}-[0-9]{3}-[0-9]{3} [0-9]{2}$/,
                    },
                  ]}
                  name={'number'}
                  label="СНИЛС"
                >
                  <Input maxLength={14} />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  {snils && (
                    <Upload
                      showUploadList={{
                        showRemoveIcon: false,
                      }}
                      defaultFileList={[
                        {
                          uid: snils.document.originalFileName,
                          name: snils?.document.originalFileName,
                          url: snils?.document.url,
                        },
                      ]}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button htmlType="submit" type="primary">
                    ОК
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Panel>
        {/* ИНН */}
        <Panel
          extra={
            <Form.Item style={{ margin: '0' }} label={'Статус'}>
              <Select
                defaultValue={inn?.isApprovedByModerator ? 'accepted' : 'rejected'}
                options={statusOptions}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                style={{ width: '133px' }}
              />
            </Form.Item>
          }
          header={
            <Row align="middle" gutter={17.5}>
              <Col>
                {inn?.isApprovedByModerator ? (
                  <CheckCircleFilled style={{ color: '#A0D911', fontSize: '21px' }} />
                ) : (
                  <CloseCircleFilled style={{ color: '#F5222D', fontSize: '21px' }} />
                )}
              </Col>
              <Col>
                <Form.Item style={{ margin: '0' }} label="ИНН" required tooltip />
              </Col>
            </Row>
          }
          key="3"
        >
          <Form
            onFinish={submitInnForm}
            initialValues={{
              number: inn?.information.number,
            }}
            size="large"
            layout="vertical"
          >
            <Row align="bottom" justify="space-between">
              <Col>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: 'Пожалуйста, введите номер ИНН',
                      pattern: /^(?:[0-9]{10}|[0-9]{12})$/,
                    },
                  ]}
                  name={'number'}
                  label="ИНН"
                >
                  <Input maxLength={12} />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  {inn && (
                    <Upload
                      showUploadList={{
                        showRemoveIcon: false,
                      }}
                      defaultFileList={[
                        {
                          uid: inn.document.originalFileName,
                          name: inn?.document.originalFileName,
                          url: inn?.document.url,
                        },
                      ]}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button htmlType="submit" type="primary">
                    ОК
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Panel>
      </Collapse>
      <h2 style={{ marginBottom: '24px' }}>Документы об образовании</h2>
      <Collapse style={{ width: '100%' }} expandIconPosition={'end'} defaultActiveKey={['1']}>
        {/* Диплом */}
        {diploma.map((it) => {
          return (
            <Panel
              key={it.id}
              extra={
                <Form.Item style={{ margin: '0' }} label={'Статус'}>
                  <Select
                    defaultValue={it.isApprovedByModerator ? 'accepted' : 'rejected'}
                    options={statusOptions}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    style={{ width: '133px' }}
                  />
                </Form.Item>
              }
              header={
                <Row align="middle" gutter={17.5}>
                  <Col>
                    {it?.isApprovedByModerator ? (
                      <CheckCircleFilled style={{ color: '#A0D911', fontSize: '21px' }} />
                    ) : (
                      <CloseCircleFilled style={{ color: '#F5222D', fontSize: '21px' }} />
                    )}
                  </Col>
                  <Col>
                    <Form.Item style={{ margin: '0' }} label="Диплом о высшем образовании" required tooltip />
                  </Col>
                </Row>
              }
            >
              <Form
                onFinish={async (values: RussianDiplomaOfHigherEducation) => {
                  try {
                    await updateTherapistDiplomaOfHigherEducation({
                      diplomaInformation: { ...values, graduationYear: +values.graduationYear },
                      diplomaId: it.id,
                    });
                    notification.success({
                      type: 'success',
                      message: 'Успех',
                      description: 'Диплом сохранён',
                    });
                  } catch (e) {
                    notification.error({
                      type: 'error',
                      message: 'Ошибка',
                      description: 'Не удалось сохранить диплом.',
                    });
                  }
                }}
                initialValues={{
                  country: it.information.country,
                  educationalInstitution: it.information.educationalInstitution,
                  speciality: it.information.speciality,
                  serialAndNumber: it.information.serialAndNumber,
                  graduationYear: it.information.graduationYear,
                }}
                size="large"
                layout="vertical"
              >
                <Form.Item name={'country'} label={'Страна'}>
                  <Select options={countryOptions} />
                </Form.Item>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: 'Пожалуйста, введите название учебного заведения ',
                    },
                  ]}
                  name={'educationalInstitution'}
                  label={'Наименование высшего учебного заведения'}
                >
                  <TextArea maxLength={255} />
                </Form.Item>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: 'Пожалуйста, введите специальность ',
                    },
                  ]}
                  name={'speciality'}
                  label={'Специальность'}
                >
                  <TextArea maxLength={255} />
                </Form.Item>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      rules={[
                        {
                          required: true,
                          message: 'Пожалуйста, введите серию / номер диплома ',
                        },
                      ]}
                      name={'serialAndNumber'}
                      label={'Серия / номер'}
                    >
                      <Input maxLength={255} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      rules={[
                        {
                          required: true,
                          message: 'Пожалуйста, выберите год выпуска',
                        },
                      ]}
                      name={'graduationYear'}
                      label={'Год выпуска'}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item>
                  <Upload
                    showUploadList={{
                      showRemoveIcon: false,
                    }}
                    defaultFileList={[
                      {
                        uid: it.document.originalFileName,
                        name: it?.document.originalFileName,
                        url: it?.document.url,
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item>
                  <Button htmlType={'submit'} type={'primary'}>
                    Сохранить
                  </Button>
                </Form.Item>
              </Form>
            </Panel>
          );
        })}
        {/* Курсы повышения квалификации */}
        {/* <Panel
          extra={
            <Form.Item style={{ margin: '0' }} label={'Статус'}>
              <Select
                options={statusOptions}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                style={{ width: '133px' }}
              />
            </Form.Item>
          }
          header={
            <Row align="middle" gutter={17.5}>
              <Col>
                <CheckCircleFilled style={{ color: '#A0D911', fontSize: '21px' }} />
              </Col>
              <Col>
                <Form.Item style={{ margin: '0' }} label="Курсы повышения квалификации" required tooltip />
              </Col>
            </Row>
          }
          key="5"
        >
          <Form size="large" layout="vertical">
            <Form.Item label={'Наименование высшего учебного заведения'}>
              <TextArea />
            </Form.Item>
            <Form.Item label={'Специальность'}>
              <TextArea />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label={'Серия / номер'}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={'Год выпуска'}>
                  <Select />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Upload />
            </Form.Item>
            <Form.Item>
              <Button
                onClick={() => {
                  setIsModalVisible(true);
                }}
                icon={<FileAddOutlined />}
                type={'default'}
              >
                Добавить документ об образовании
              </Button>
            </Form.Item>
            <Form.Item>
              <Button htmlType={'submit'} type={'primary'}>
                Сохранить
              </Button>
            </Form.Item>
          </Form>
        </Panel> */}
      </Collapse>
    </>
  );
};
