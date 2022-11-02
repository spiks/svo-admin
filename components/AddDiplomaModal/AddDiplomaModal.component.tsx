import { Button, Col, DatePicker, Form, FormProps, Input, Modal, notification, Row, Select, Upload } from 'antd';
import { FC, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { RcFile, UploadChangeParam, UploadFile } from 'antd/lib/upload';
import { requestFileUploadUrl } from 'api/upload/requestFileUploadUrl';
import { uploadFile } from 'api/upload/uploadFile';
import { RussianDiplomaOfHigherEducation, UploadedFileToken, Uuid } from 'generated';
import { submitTherapistDiplomaOfHigherEducation } from 'api/blog/submitTherapistDiplomaOfHigherEducation';
import { countryOptions } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.component';
import moment from 'moment';
import { useTherapistSignupQueriesRefresh } from 'hooks/useTherapistSignupQueries';

export type AddDiplomaModalProps = {
  therapistId: Uuid;
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
};

export const AddDiplomaModal: FC<AddDiplomaModalProps> = ({ therapistId, visible, onOk, onCancel }) => {
  const [form] = Form.useForm<RussianDiplomaOfHigherEducation>();
  const [diplomaToken, setDiplomaToken] = useState<UploadedFileToken | null>(null);

  const refetch = useTherapistSignupQueriesRefresh(therapistId);

  const setDiplomaUploadedToken = async (info: UploadChangeParam<UploadFile>) => {
    const { data: credentials } = await requestFileUploadUrl('personal_document');
    try {
      const { data: uploaded } = await uploadFile(credentials, info.fileList[0].originFileObj as RcFile);
      setDiplomaToken(uploaded.token);
    } catch (err) {
      if (err instanceof Error) {
        notification.error({
          type: 'error',
          message: 'Ошибка',
          description: err.message,
        });
        return;
      } else {
        throw err;
      }
    }
  };

  const onFinish: FormProps<RussianDiplomaOfHigherEducation>['onFinish'] = async (values) => {
    if (!diplomaToken) {
      return;
    }
    try {
      await submitTherapistDiplomaOfHigherEducation({
        information: { ...values, graduationYear: +moment(values.graduationYear).format('YYYY') },
        therapistId: therapistId,
        document: diplomaToken,
      });
      setDiplomaToken(null);
      onOk();
      form.resetFields();
      notification.success({
        type: 'success',
        message: 'Успех',
        description: 'Диплом успешно добавлен!',
      });
    } catch (error) {
      notification.error({
        type: 'error',
        message: 'Ошибка',
        description: 'Не удалось добавить диплом',
      });
    } finally {
      refetch('documents');
    }
  };

  return (
    <Modal
      visible={visible}
      onOk={() => {
        form.submit();
      }}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      okText="Добавить"
      cancelText="Отменить"
      title={'Добавить документ об образовании'}
    >
      <Form
        initialValues={{
          country: 'russia',
        }}
        onFinish={onFinish}
        form={form}
      >
        <Form.Item name={'country'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} label={'Страна'}>
          <Select options={countryOptions} />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: 'Пожалуйста, введите название учебного заведения',
            },
          ]}
          name={'educationalInstitution'}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          label={'Наименование высшего учебного заведения'}
        >
          <Input.TextArea maxLength={255} />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: 'Пожалуйста, введите название специальности',
            },
          ]}
          name={'speciality'}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          label={'Специальность'}
        >
          <Input.TextArea maxLength={255} />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: 'Пожалуйста, введите серию / номер диплома',
                },
              ]}
              name={'serialAndNumber'}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
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
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label={'Год выпуска'}
            >
              <DatePicker placeholder="Выберите год" picker={'year'} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="space-between">
          <Col span={12}>
            <Form.Item>
              <Upload onChange={setDiplomaUploadedToken} maxCount={1} listType={'text'}>
                <Button icon={<UploadOutlined />}>Загрузить файл</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
