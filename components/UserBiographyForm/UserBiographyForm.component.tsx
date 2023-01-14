import { Button, Form, FormProps, notification } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { updateTherapistBiographyAndCreed } from 'api/therapist/updateTherapistBiographyAndCreed';
import { CreedLongDescription, LongDescription } from 'generated';
import { TherapistPageContext } from 'pages/users/therapists/[id]';
import { FC, useContext } from 'react';

type BiographyForm = {
  biography: LongDescription;
  creed: CreedLongDescription;
};

export const UserBiographyForm: FC = () => {
  const [form] = Form.useForm();
  const { therapist } = useContext(TherapistPageContext);

  const onFinish: FormProps<BiographyForm>['onFinish'] = async (values) => {
    try {
      await updateTherapistBiographyAndCreed({ ...values, therapistId: therapist.id });
      notification.success({
        type: 'success',
        message: 'Успех',
        description: 'Информация сохранена',
      });
    } catch (e) {
      notification.error({
        type: 'error',
        message: 'Ошибка',
        description: 'Не удалось сохранить информацию',
      });
    }
  };

  return (
    <div style={{ padding: '80px 160px' }}>
      <Form
        onFinish={onFinish}
        form={form}
        size="large"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{
          biography: therapist.biography,
          creed: therapist.creed,
        }}
      >
        <Form.Item
          normalize={(value) => {
            if (!value) {
              return null;
            }
            return value;
          }}
          label="Биография психолога"
          name="biography"
        >
          <TextArea rows={6} showCount maxLength={2048} />
        </Form.Item>
        <Form.Item
          normalize={(value) => {
            if (!value) {
              return null;
            }
            return value;
          }}
          label="Профессиональное кредо"
          name="creed"
        >
          <TextArea rows={6} showCount maxLength={2048} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: '8' }}>
          <Button type="primary" htmlType="submit">
            Сохранить
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
