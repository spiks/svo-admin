import { Button, Col, Divider, Form, FormInstance, Input, Row, Tooltip, Typography } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import { FC, useCallback } from 'react';
import { CopyOutlined, MailOutlined, PlusOutlined } from '@ant-design/icons';
import { UserProfileFormValues } from 'pages/users/therapists/[id]';
import CountryPhoneInput from 'antd-country-phone-input';

import { Email, MediaImage, Name, Phone, ProfileGender, Surname, TherapistAmoCrmContactId, Uuid } from 'generated';
import { getCountryCallingCode, isPossiblePhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
import { UploadWithCrop } from '@components/UploadCrop/UploadCrop.component';
import { validateUploadImage } from '../../helpers/validateUploadImage';

export type UserProfileFormProps = {
  id?: Uuid;
  surname?: Surname | null;
  name?: Name | null;
  avatar?: MediaImage | null;
  gender?: ProfileGender | null;
  email?: Email | null;
  phone?: Phone | null;
  amoCrmContactId?: TherapistAmoCrmContactId | null;
  form: FormInstance<UserProfileFormValues>;
  onFinish: (values: UserProfileFormValues) => void;
};

export const UserProfileForm: FC<UserProfileFormProps> = ({ form, onFinish, ...props }) => {
  const getAvatar = () => {
    const uploadedAvatar: UploadFile[] = [];
    const userAvatar = props.avatar?.sizes.small;
    if (userAvatar) {
      uploadedAvatar.push({
        uid: '0',
        name: 'avatar.webp',
        url: 'https://' + userAvatar.url,
      });
    }
    return uploadedAvatar;
  };

  const phoneNumber = props.phone && parsePhoneNumber(props.phone);

  const copyAmoCrmId = useCallback(() => {
    navigator.clipboard.writeText(form.getFieldValue('amoCrmContactId'));
  }, [form]);

  return (
    <Form
      onFinish={onFinish}
      form={form}
      style={{ width: '100%' }}
      name="basic"
      size="large"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{
        avatar: getAvatar(),
        name: props.name,
        surname: props.surname,
        id: props.id,
        amoCrmContactId: props.amoCrmContactId,
        email: props.email,
        phone: phoneNumber
          ? {
              short: phoneNumber.country ?? phoneNumber.getPossibleCountries()[0] ?? 'RU',
              phone: phoneNumber.nationalNumber,
            }
          : { short: 'RU' },
      }}
    >
      <Divider>Персональные данные</Divider>
      <Form.Item label="Изображение профиля">
        <Form.Item
          name={'avatar'}
          valuePropName={'fileList'}
          getValueFromEvent={(e: UploadChangeParam<UploadFile<unknown>>) => {
            return e.fileList;
          }}
        >
          <UploadWithCrop
            beforeUpload={(file) => {
              return validateUploadImage(file);
            }}
            maxCount={1}
            listType="picture-card"
            showUploadList={true}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: '8px' }}>Загрузить</div>
            </div>
          </UploadWithCrop>
        </Form.Item>
        <Typography.Text type={'secondary'} style={{ display: 'inline-block', maxWidth: '400px', width: '100%' }}>
          Изображение формата .jpg, .jpeg или .png не более 15.7 Мб с ограничением по высоте и ширине от 10 до 5400
          пикселей
        </Typography.Text>
      </Form.Item>
      <Form.Item
        normalize={(value) => {
          if (!value) {
            return null;
          }
          return value;
        }}
        label="Фамилия"
        name="surname"
        rules={[{ required: true, message: 'Пожалуйста, введите фамилию' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        normalize={(value) => {
          if (!value) {
            return null;
          }
          return value;
        }}
        label="Имя"
        name="name"
        rules={[{ required: true, message: 'Пожалуйста, введите имя' }]}
      >
        <Input />
      </Form.Item>
      {props.amoCrmContactId !== undefined && (
        <Form.Item label="Системный ID">
          <Row>
            <Col flex={1}>
              <Form.Item
                rules={[{ pattern: /^[0-9]+$/, message: 'ID должен состоять только из цифр' }]}
                name="amoCrmContactId"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col>
              <Tooltip placement="left" title="Копировать amoCrm id">
                <Button onClick={copyAmoCrmId} icon={<CopyOutlined />} />
              </Tooltip>
            </Col>
          </Row>
        </Form.Item>
      )}
      <Divider>Контактные данные</Divider>
      <Form.Item
        rules={[
          {
            required: true,
            async validator(_, value) {
              if (!value.short) {
                throw new Error('Выберите код страны');
              } else if (!value.phone) {
                throw new Error('Введите номер телефона');
              }
              const isLengthValid = isPossiblePhoneNumber(
                '+' + getCountryCallingCode(value.short) + value.phone,
                value.short,
              );
              if (!isLengthValid) {
                throw new Error('Неверная длина номера');
              }
            },
          },
        ]}
        label="Номер телефона"
        name="phone"
      >
        <CountryPhoneInput />
      </Form.Item>
      <Form.Item
        normalize={(value) => {
          if (!value) {
            return null;
          }
          return value;
        }}
        hasFeedback
        label="Email"
        name="email"
        required={false}
      >
        <Input prefix={<MailOutlined style={{ color: '#52C41A' }} />} type={'email'} />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: '8' }}>
        <Button type="primary" htmlType="submit">
          Сохранить
        </Button>
      </Form.Item>
    </Form>
  );
};
