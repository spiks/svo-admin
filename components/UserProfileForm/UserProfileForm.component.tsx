import { Button, Divider, Form, FormProps, Input, notification, Select, Upload } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import { FC, useContext, useMemo } from 'react';
import { PhoneOutlined, MailOutlined, PlusOutlined } from '@ant-design/icons';
import { TherapistPageContext } from 'pages/users/therapists/[id]';
import { updateTherapist, UpdateTherapistRequestType } from 'api/therapist/updateTherapist';
import { useTherapistSignupQueriesRefresh } from 'hooks/useTherapistSignupQueries';
import { requestFileUploadUrl } from 'api/upload/requestFileUploadUrl';
import { updateTherapistAvatar } from 'api/therapist/updateTherapistAvatar';
import { removeTherapistAvatar } from 'api/therapist/removeTherapistAvatar';
import { uploadFile } from 'api/upload/uploadFile';

export const UserProfileForm: FC = () => {
  const { TextArea } = Input;

  const [form] = Form.useForm();

  const { therapist } = useContext(TherapistPageContext);

  const refetch = useTherapistSignupQueriesRefresh(therapist.id);

  const selectedSpecialication = useMemo(() => {
    return therapist.specializations
      .map((it) => {
        return it.items
          .filter((it) => {
            return it.isSelected;
          })
          .map((it) => {
            return it.id;
          });
      })
      .flat();
  }, [therapist.specializations]);

  const tagsOptions: { label: string; value: string }[] = useMemo(() => {
    return therapist.specializations
      .map((it) => {
        return it.items.map((it) => {
          return {
            label: it.name,
            value: it.id,
          };
        });
      })
      .flat();
  }, [therapist.specializations]);

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
      // TODO: убрать workPrinciples из запроса, когда удалят его из метода updateTherapist и getTherapist
      await updateTherapist({
        ...values,
        id: therapist.id,
        workPrinciples: null,
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
    const therapisAvatar = therapist.avatar?.sizes.small;
    if (therapisAvatar) {
      avatar.push({
        uid: '0',
        name: 'avatar.webp',
        url: 'https://' + therapisAvatar.url,
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
        biography: therapist.biography,
        specializations: selectedSpecialication,
        employments: therapist.employments,
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
      <Form.Item
        normalize={(value) => {
          if (!value) {
            return null;
          }
          return value;
        }}
        label="ФИО"
        name="fullName"
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
      >
        <Input prefix={<MailOutlined style={{ color: '#52C41A' }} />} type={'email'} />
      </Form.Item>
      <Divider>Сведения о проф. деятельности</Divider>
      <Form.List name="employments">
        {(fieldsEmployment) => {
          return (
            <Form.Item label="Стаж" name="workExperienceYears">
              <Input type="number" />
            </Form.Item>
          );
        }}
      </Form.List>
      <Form.Item
        normalize={(value) => {
          return value;
        }}
        label="Специализация"
        name="specializations"
      >
        <Select mode="multiple" style={{ width: '100%' }} options={tagsOptions} />
      </Form.Item>
      {/* <Form.Item required label="Исследуемые темы" name="topics">
        <Select
          mode="multiple"
          tagRender={({ label, value, closable, onClose, ...props }) => {
            return <TagRender label={label} value={value} closable={closable} onClose={onClose} {...props} />;
          }}
          style={{ width: '100%' }}
          options={tags}
        />
      </Form.Item> */}
      <Divider>Сведения о пользователе</Divider>
      <Form.Item
        normalize={(value) => {
          if (!value) {
            return null;
          }
          return value;
        }}
        label="О психологе"
        name="biography"
      >
        <TextArea showCount maxLength={1000} />
      </Form.Item>
      {/* Было решено отказаться от этого блока
      <Form.Item label="Принципы ведения приёма" name="workPrinciples">
        <TextArea showCount maxLength={200} />
      </Form.Item> */}
      <Form.Item wrapperCol={{ offset: '8' }}>
        <Button type="primary" htmlType="submit">
          Сохранить
        </Button>
      </Form.Item>
    </Form>
  );
};
