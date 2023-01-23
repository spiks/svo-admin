import { Button, Form, FormProps, notification } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { updateTherapistWorkPrinciples } from 'api/therapist/updateTherapistWorkPrinciples';
import { LongDescription } from 'generated';
import { TherapistPageContext } from 'pages/users/therapists/[id]';
import { FC, useContext } from 'react';
import { useTherapistSignupQueriesRefresh } from '../../hooks/useTherapistSignupQueries';

export const UserWorkPrinciplesForm: FC = () => {
  const [form] = Form.useForm();
  const { therapist } = useContext(TherapistPageContext);
  const refetch = useTherapistSignupQueriesRefresh(therapist.id);

  const onFinish: FormProps<{ workPrinciples: LongDescription }>['onFinish'] = async (values) => {
    try {
      await updateTherapistWorkPrinciples({ ...values, therapistId: therapist.id });
      notification.success({
        type: 'success',
        message: 'Успех',
        description: 'Информация сохранена',
      });
      refetch('therapist');
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
          workPrinciples: therapist.workPrinciples,
        }}
      >
        <Form.Item
          normalize={(value) => {
            if (!value) {
              return null;
            }
            return value;
          }}
          label="Подход и принципы работы"
          name="workPrinciples"
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
