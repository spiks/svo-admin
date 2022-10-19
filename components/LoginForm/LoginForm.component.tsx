import { FC, useState } from 'react';
import { Button, Checkbox, Form, FormProps, Input, Row } from 'antd';
import { Image } from '../Image/Image.component';
import LogotypeSvg from '../../resources/svg/logotype.svg';
import styles from './LoginForm.module.css';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { PasswordRecoveryModal } from '../PasswordRecoveryModal/PasswordRecoveryModal.component';
import { IssueTokenByEmailAndPasswordRequest } from '../../generated';
import { useLogin } from '../../api/hooks/useLogin';

export type ILoginFormProps = {
  email: string;
  password: string;
};

export const LoginForm: FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const login = useLogin();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish: FormProps<IssueTokenByEmailAndPasswordRequest>['onFinish'] = async ({ email, password }) => {
    if (loading) {
      return;
    }
    setLoading(true);

    const result = await login(email, password);
    if (result.error) {
      setError('Неизвестная ошибка');
    }
    setLoading(false);
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.logo}>
          <Image src={LogotypeSvg} alt={'MOST'} />
          <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>Система администрирования платформы</span>
        </div>

        <Form<ILoginFormProps> name="login" onFinish={onFinish} style={{ width: '100%' }}>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: 'Необходимо указать email',
              },
            ]}
          >
            <Input size="large" prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Необходимо указать пароль',
              },
            ]}
          >
            <Input.Password size="large" prefix={<LockOutlined />} type="password" placeholder="Пароль" />
          </Form.Item>
          {error && (
            <Row justify="center">
              <span style={{ color: 'red' }}>Неизвестная ошибка</span>
            </Row>
          )}
          <div className={styles.actions}>
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox style={{ fontWeight: '600' }}>Запомнить меня</Checkbox>
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Button onClick={showModal} style={{ padding: '0', fontSize: '16px' }} type="link">
                Забыли пароль?
              </Button>
            </Form.Item>
          </div>
          <Form.Item>
            <Button loading={loading} size="large" type="primary" block htmlType="submit">
              Войти
            </Button>
          </Form.Item>
        </Form>
      </div>
      <PasswordRecoveryModal open={isModalVisible} onOk={handleOk} onCancel={handleCancel} />
    </>
  );
};

export default LoginForm;
