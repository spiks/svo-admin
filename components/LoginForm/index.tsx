import { FC, useState } from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { Image } from '../Image';
import LogotypeSvg from '../../resources/svg/logotype.svg';
import styles from './LoginForm.module.css';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { PasswordRecoveryModal } from '../PasswordRecoveryModal';

export type ILoginFormProps = {
  username: string;
  password: string;
};

export const LoginForm: FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = () => {};

  const onFinishFailed = () => {};

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.logo}>
          <Image src={LogotypeSvg} alt={'MOST'} />
          <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>Система администрирования платформы</span>
        </div>

        <Form<ILoginFormProps>
          name="login"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          style={{ width: '100%' }}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Необходимо указать имя пользователя',
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
            <Button size="large" type="primary" block htmlType="submit">
              Войти
            </Button>
          </Form.Item>
        </Form>
      </div>
      <PasswordRecoveryModal visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} />
    </>
  );
};
