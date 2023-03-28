import { Button, Col, Divider, Form, FormProps, Input, notification, Row, Tooltip, Typography, Upload } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import { FC, useCallback, useContext } from 'react';
import { CopyOutlined, MailOutlined, PlusOutlined } from '@ant-design/icons';
import { TherapistPageContext } from 'pages/users/therapists/[id]';
import { useTherapistSignupQueriesRefresh } from 'hooks/useTherapistSignupQueries';
import { requestFileUploadUrl } from 'api/upload/requestFileUploadUrl';
import { updateTherapistAvatar } from 'api/therapist/updateTherapistAvatar';
import { uploadFile } from 'api/upload/uploadFile';
import { TherapistServiceWithToken } from '../../api/services';
import { ApiRegularError } from '../../api/errorClasses';
import CountryPhoneInput, { CountryPhoneInputValue } from 'antd-country-phone-input';
import { removeTherapistAvatar } from '../../api/therapist/removeTherapistAvatar';
import { Email, Name, Surname, TherapistAmoCrmContactId, Uuid } from 'generated';
import { CountryCode, getCountryCallingCode, isPossiblePhoneNumber, parsePhoneNumber } from 'libphonenumber-js';

type UserProfileFormValues = {
  avatar: UploadFile[];
  phone: CountryPhoneInputValue;
  id: Uuid;
  surname: Surname;
  name: Name;
  email: Email | null;
  amoCrmContactId: TherapistAmoCrmContactId | null;
};

export const UserProfileForm: FC = () => {
  const [form] = Form.useForm();
  const { therapist } = useContext(TherapistPageContext);
  const refetch = useTherapistSignupQueriesRefresh(therapist.id);

  const onFinish: FormProps<UserProfileFormValues>['onFinish'] = async (values) => {
    const isAvatarChanged = Boolean(values?.avatar?.[0]?.originFileObj);
    if (isAvatarChanged) {
      const file = values.avatar[0].originFileObj!;
      try {
        const { data: cred } = await requestFileUploadUrl('avatar');
        const avatarToken = (await uploadFile(cred, file)).data.token;
        await updateTherapistAvatar({
          therapistId: therapist.id,
          avatar: avatarToken,
        });
      } catch (err) {
        if (!(err instanceof Error)) {
          notification.error({
            type: 'error',
            message: 'Ошибка',
            description: `Неизвестная ошибка`,
          });
        }
      }
    } else if (!isAvatarChanged && !values.avatar.length && therapist?.avatar?.sizes) {
      try {
        await removeTherapistAvatar(therapist.id);
      } catch (err) {
        notification.error({
          type: 'error',
          message: 'Ошибка',
          description: 'Не удалось удалить изображение',
        });
      }
    }
    try {
      await TherapistServiceWithToken.updateTherapistPersonalInformation({
        requestBody: {
          arguments: {
            id: therapist.id,
            surname: values.surname,
            name: values.name,
            phone: '+' + getCountryCallingCode(values.phone.short as CountryCode) + values.phone.phone,
            email: values.email,
            amoCrmContactId: values.amoCrmContactId ? +values.amoCrmContactId : null,
          },
        },
      });
      notification.success({
        type: 'success',
        message: 'Успех',
        description: 'Информация сохранена!',
      });
    } catch (error) {
      let message = 'неизвестная ошибка';
      if (error instanceof ApiRegularError) {
        switch (error.error.type) {
          case 'user_with_this_email_already_exists':
            message = 'Пользователь с такой почтой уже существует';
            form.setFields([
              {
                name: 'email',
                errors: [message],
              },
            ]);
            break;
          case 'user_with_this_phone_already_exists':
            message = 'Пользователь с таким номером уже сщуествует';
            form.setFields([
              {
                name: 'phone',
                errors: [message],
              },
            ]);
            break;
        }
      }
      notification.error({
        type: 'error',
        message: 'Ошибка',
        description: 'Не удалось сохранить: ' + message,
      });
    } finally {
      refetch('therapist');
    }
  };

  const getAvatar = () => {
    const avatar: UploadFile[] = [];
    const therapistAvatar = therapist.avatar?.sizes.small;
    if (therapistAvatar) {
      avatar.push({
        uid: '0',
        name: 'avatar.webp',
        url: 'https://' + therapistAvatar.url,
      });
    }
    return avatar;
  };

  const phoneNumber = therapist.phone && parsePhoneNumber(therapist.phone);

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
        name: therapist.name,
        surname: therapist.surname,
        id: therapist.id,
        amoCrmContactId: therapist.amoCrmContactId,
        email: therapist.email,
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
          <Upload
            beforeUpload={(file) => {
              const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
              const isMaxSize = file.size < 15728640;

              if (!isJpgOrPng) {
                notification.error({
                  type: 'error',
                  message: 'Ошибка',
                  description: `${file.name} имееет неверный формат!`,
                });
              }
              if (!isMaxSize) {
                notification.error({
                  type: 'error',
                  message: 'Ошибка',
                  description: `Превышен максимальный размер файла!`,
                });
              }
              return (isJpgOrPng && isMaxSize) || Upload.LIST_IGNORE;
            }}
            maxCount={1}
            listType="picture-card"
            showUploadList={true}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: '8px' }}>Загрузить</div>
            </div>
          </Upload>
        </Form.Item>
        <Typography.Text type={'secondary'} style={{ display: 'inline-block', maxWidth: '400px', width: '100%' }}>
          Изображение формата .jpg, .jpeg или .png не более 15 Мб с ограничением по высоте и ширине от 10 до 5400
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
