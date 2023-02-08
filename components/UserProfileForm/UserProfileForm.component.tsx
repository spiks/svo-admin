import { Button, Divider, Form, FormProps, Input, notification, Upload } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import { FC, useContext } from 'react';
import { MailOutlined, PhoneOutlined, PlusOutlined } from '@ant-design/icons';
import { TherapistPageContext } from 'pages/users/therapists/[id]';
import { UpdateTherapistRequestType } from 'api/therapist/updateTherapist';
import { useTherapistSignupQueriesRefresh } from 'hooks/useTherapistSignupQueries';
import { requestFileUploadUrl } from 'api/upload/requestFileUploadUrl';
import { updateTherapistAvatar } from 'api/therapist/updateTherapistAvatar';
import { removeTherapistAvatar } from 'api/therapist/removeTherapistAvatar';
import { uploadFile } from 'api/upload/uploadFile';
import { TherapistServiceWithToken } from '../../api/services';

export const UserProfileForm: FC = () => {
  const [form] = Form.useForm();
  const { therapist } = useContext(TherapistPageContext);
  const refetch = useTherapistSignupQueriesRefresh(therapist.id);

  const onFinish: FormProps<UpdateTherapistRequestType & { avatar: UploadFile[] }>['onFinish'] = async (values) => {
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
            fullName: values.fullName!,
            phone: values.phone,
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
      notification.error({
        type: 'error',
        message: 'Ошибка',
        description: 'Не удалось сохранить информацию',
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
        fullName: therapist.fullName,
        email: therapist.email,
        phone: therapist.phone,
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
      </Form.Item>
      <Form.Item
        normalize={(value) => {
          if (!value) {
            return null;
          }
          return value;
        }}
        label="Имя на платформе"
        name="fullName"
        rules={[{ required: true, message: 'Пожалуйста, введите имя' }]}
      >
        <Input />
      </Form.Item>
      <Divider>Контактные данные</Divider>
      <Form.Item
        rules={[{ required: true, message: 'Пожалуйста, введите телефон', pattern: /^\+7[0-9]{10}$/ }]}
        validateStatus="success"
        label="Номер телефона"
        name="phone"
      >
        <Input prefix={<PhoneOutlined style={{ color: '#52C41A' }} />} />
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
        rules={[{ required: true, type: 'email', message: 'Пожалуйста, введите электронную почту' }]}
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
