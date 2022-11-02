import { Avatar, Button, Col, Divider, Form, FormProps, Input, notification, Row, Select } from 'antd';
import { FC, useContext, useMemo } from 'react';
import { PhoneOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { TherapistPageContext, USER_TAB_KEY } from 'pages/users/therapists/[id]';
import { Image } from '@components/Image/Image.component';
import { WorkExperienceYears } from 'generated';
import { updateTherapist, UpdateTherapistRequestType } from 'api/therapist/updateTherapist';
import { useTherapistSignupQueriesRefresh } from 'hooks/useTherapistSignupQueries';

export const workExperienceYearsNames: Record<WorkExperienceYears, string> = {
  from_1_to_2_years: '1-2 года',
  from_3_to_4_years: '3-4 года',
  from_5_to_7_years: ' 5-7 лет',
  from_8_to_10_years: ' 8-10 лет',
  less_than_a_year: 'Меньше года',
  more_than_10_years: 'Более 10 лет',
  student: 'Студент',
};

export const ProfessionalActivityModalGaps: { value: WorkExperienceYears; label: string }[] = [
  {
    value: 'student',
    label: 'Студент',
  },
  {
    value: 'less_than_a_year',
    label: 'Менее года',
  },
  {
    value: 'from_1_to_2_years',
    label: '1-2 года',
  },
  {
    value: 'from_3_to_4_years',
    label: '3-4 года',
  },
  {
    value: 'from_5_to_7_years',
    label: '5-7 лет',
  },
  {
    value: 'from_8_to_10_years',
    label: '8-10 лет',
  },
  {
    value: 'more_than_10_years',
    label: 'Более 10 лет',
  },
];

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

  const onFinish: FormProps<UpdateTherapistRequestType>['onFinish'] = async (values) => {
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
        avatar: therapist.avatar,
        fullName: therapist.fullName,
        email: therapist.email,
        phone: therapist.phone,
        workExperienceYears: therapist.workExperienceYears,
        biography: therapist.biography,
        specializations: selectedSpecialication,
      }}
    >
      <Divider>Персональные данные</Divider>
      <Form.Item label="Изображение профиля" name="avatar">
        <Row gutter={16}>
          <Col>
            {therapist.avatar ? (
              <Image
                width={104}
                height={104}
                layout={'fixed'}
                alt={'avatar'}
                src={`https://${therapist.avatar?.sizes.original.url}`}
              />
            ) : (
              <Avatar shape="square" size={104} icon={<UserOutlined />} />
            )}
          </Col>
        </Row>
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
      <Form.Item hasFeedback label="Email" name="email">
        <Input prefix={<MailOutlined style={{ color: '#52C41A' }} />} type={'email'} />
      </Form.Item>
      <Divider>Свеления о проф. деятельности</Divider>
      <Form.Item label="Стаж" name="workExperienceYears">
        <Select options={ProfessionalActivityModalGaps} />
      </Form.Item>
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
