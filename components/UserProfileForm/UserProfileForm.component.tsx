import { Button, Divider, Form, FormProps, Input, notification, Typography, Upload } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import { FC, useContext } from 'react';
import { MailOutlined, PlusOutlined } from '@ant-design/icons';
import { TherapistPageContext } from 'pages/users/therapists/[id]';
import { UpdateTherapistRequestType } from 'api/therapist/updateTherapist';
import { useTherapistSignupQueriesRefresh } from 'hooks/useTherapistSignupQueries';
import { requestFileUploadUrl } from 'api/upload/requestFileUploadUrl';
import { updateTherapistAvatar } from 'api/therapist/updateTherapistAvatar';
import { removeTherapistAvatar } from 'api/therapist/removeTherapistAvatar';
import { uploadFile } from 'api/upload/uploadFile';
import { TherapistServiceWithToken } from '../../api/services';
import { ApiRegularError } from '../../api/errorClasses';
import CountryPhoneInput, { CountryPhoneInputValue, defaultAreas } from 'antd-country-phone-input';

type UserProfileFormValues = Omit<UpdateTherapistRequestType, 'phone'> & {
  avatar: UploadFile[];
  phone: CountryPhoneInputValue;
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
    } else if (!isAvatarChanged && therapist?.avatar?.sizes) {
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
            email: values.email!,
            surname: values.surname!,
            name: values.name!,
            amoCrmContactId: therapist.amoCrmContactId,
            phone: `+${values.phone.code}${values.phone.phone}`,
            id: therapist.id,
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

  const numbers = therapist.phone?.substring(therapist.phone.length - 10);
  const code = therapist.phone?.replace(numbers as string, '');
  const area = defaultAreas.find((area) => {
    return Number(area.phoneCode) === Number(code?.substring(1));
  });
  const therapistNumber = therapist.phone && {
    country: area?.short,
    phone: numbers,
    code,
  };

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
        phone: therapistNumber
          ? {
              ...therapistNumber,
              ...(therapistNumber && { short: therapistNumber.country, phone: therapistNumber.phone }),
            }
          : { short: 'RU' },
      }}
    >
      <Divider>Персональные данные</Divider>
      <Form.Item
        label="Изображение профиля"
        name={'avatar'}
        valuePropName={'fileList'}
        getValueFromEvent={(e: UploadChangeParam<UploadFile<unknown>>) => {
          return e.fileList;
        }}
      >
        <Upload
          style={{ position: 'relative' }}
          beforeUpload={(file) => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            const isMaxSize = file.size < 15728640;

            if (!isJpgOrPng) {
              form.setFields([
                {
                  name: 'avatar',
                  errors: ['Допустимые форматы .jpeg, .jpg, .png!'],
                },
              ]);
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

            const result = (isJpgOrPng && isMaxSize) || Upload.LIST_IGNORE;
            if (result) {
              form.setFields([
                {
                  name: 'avatar',
                  errors: [],
                },
              ]);
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
      <Form.Item
        normalize={(value) => {
          if (!value) {
            return null;
          }
          return value;
        }}
        label="Системный ID"
        name="amoCrmContactId"
      >
        <Input disabled style={{ width: 'calc(100% - 40px)' }} />
      </Form.Item>
      {/*<Tooltip placement="left" title="Копировать amoCrm id">*/}
      {/*  <Button icon={<CopyOutlined />} />*/}
      {/*</Tooltip>*/}
      <Divider>Контактные данные</Divider>
      <Form.Item
        rules={[
          {
            required: true,
            async validator(_, value) {
              if (!value.code) {
                throw new Error('Выберите код страны');
              } else if (!value.phone) {
                throw new Error('Введите номер телефона');
              } else if (value.phone.length !== 10) {
                throw new Error('Длина номера должна быть 10 символов');
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
