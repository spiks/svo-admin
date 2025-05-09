import { Button, Col, Divider, Form, FormInstance, Input, Row, Tooltip, Typography } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import React, { FC, useCallback, useState } from 'react';
import { CopyOutlined, MailOutlined, PlusOutlined } from '@ant-design/icons';
import { UserProfileFormValues } from 'pages/users/therapists/[id]';
import CountryPhoneInput from 'antd-country-phone-input-upgraded';

import { Email, MediaImage, Name, Phone, ProfileGender, Surname, TherapistAmoCrmContactId, Uuid } from 'generated';
import { getCountryCallingCode, isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
import { UploadWithCrop } from '@components/UploadCrop/UploadCrop.component';
import { validateUploadImage } from '../../helpers/validateUploadImage';
import { validateEmailRule } from '../../helpers/validateEmailRule';
import { MAX_USER_NAME_LENGTH, MAX_USER_SURNAME_LENGTH } from '../../constants/inputMaxLength';
import { MAX_INTEGER } from 'constants/amoCrmContactId';
import DeleteUserModal from '@components/DeleteUserModal/DeleteUserModal.component';

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
  deleteUser: () => void;
};

export const UserProfileForm: FC<UserProfileFormProps> = ({ form, deleteUser, onFinish, ...props }) => {
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

  const [isDeleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
  const handleToggleModal = useCallback(() => {
    setDeleteUserModalOpen((prev) => !prev);
  }, []);

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
      noValidate
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
            locale={{
              uploading: 'Загрузка',
              removeFile: 'Удалить',
              uploadError: 'Ошибка загрузки',
              previewFile: 'Предпросмотр',
              downloadFile: 'Загрузить изображение',
            }}
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
        rules={[
          { required: true, message: 'Пожалуйста, введите фамилию' },
          {
            max: MAX_USER_NAME_LENGTH,
            message: `Фамилия не может содержать более ${MAX_USER_SURNAME_LENGTH} символов`,
          },
        ]}
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
        rules={[
          { required: true, message: 'Пожалуйста, введите имя' },
          { max: MAX_USER_SURNAME_LENGTH, message: `Имя не может содержать более ${MAX_USER_NAME_LENGTH} символов` },
        ]}
      >
        <Input />
      </Form.Item>
      {props.amoCrmContactId !== undefined && (
        <Form.Item label="Системный ID">
          <Row>
            <Col flex={1}>
              <Form.Item
                rules={[
                  { pattern: /^[0-9]+$/, message: 'ID должен состоять только из цифр' },
                  {
                    async validator(_, value) {
                      if (!value) {
                        return;
                      }
                      if (value == 0) {
                        throw new Error('ID должен быть больше, чем 0');
                      }
                      if (value > 2147483647) {
                        throw new Error(`ID должен быть не больше, чем ${MAX_INTEGER}`);
                      }
                    },
                  },
                ]}
                name="amoCrmContactId"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col>
              <Tooltip placement="left" title="Копировать системны ID">
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
              const isPhoneValid = isValidPhoneNumber(
                '+' + getCountryCallingCode(value.short) + value.phone,
                value.short,
              );
              if (!isPhoneValid) {
                throw new Error('Неверный номер!');
              }
            },
          },
        ]}
        label="Номер телефона"
        name="phone"
      >
        <CountryPhoneInput inline />
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
        rules={[validateEmailRule(true)]}
        validateTrigger="onSubmit"
      >
        <Input prefix={<MailOutlined style={{ color: '#52C41A' }} />} type={'email'} />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: '8' }}>
        <Button type="primary" htmlType="submit">
          Сохранить
        </Button>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: '8' }}>
        <Button onClick={handleToggleModal} type="text" danger>
          Удалить пользователя
        </Button>
      </Form.Item>
      <DeleteUserModal isOpen={isDeleteUserModalOpen} deleteUser={deleteUser} onCancel={handleToggleModal} />
    </Form>
  );
};
