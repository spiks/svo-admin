import { Button, Form, FormProps, Input, notification, Typography } from 'antd';
import { updateTherapistVideoPresentation } from 'api/therapist/updateTherapistVideoPresentation';
import { REGEXP_YOUTUBE } from 'constants/regexp';
import { VideoPresentation } from 'generated';
import { useVideoPresentationQuery } from 'hooks/useVideoPresentationQuery';
import { TherapistPageContext } from 'pages/users/therapists/[id]';
import { FC, useContext, useEffect } from 'react';

export const UserPresentationForm: FC = () => {
  const { therapist } = useContext(TherapistPageContext);
  const { videoPresentation, refetch } = useVideoPresentationQuery(therapist.id);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ url: videoPresentation?.url });
  }, [form, videoPresentation?.url]);

  const onFinish: FormProps<VideoPresentation>['onFinish'] = async (values) => {
    try {
      await updateTherapistVideoPresentation(therapist.id, values);
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
    } finally {
      refetch();
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
          url: videoPresentation?.url,
        }}
      >
        <Form.Item
          style={{ margin: '0px' }}
          label="Ссылка на ролик"
          name="url"
          rules={[
            {
              required: true,
              message: 'Пожалуйста, введите ссылку',
              pattern: REGEXP_YOUTUBE,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8 }}>
          <Typography.Text type={'secondary'}>
            Необходимо указать URL на видео-презентацию с видеохостинга
          </Typography.Text>
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
