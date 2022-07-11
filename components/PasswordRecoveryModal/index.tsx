import { Button, Modal, ModalProps, Input, Form, Typography } from 'antd';
import { FC, useState } from 'react';

export const PasswordRecoveryModal: FC<ModalProps> = ({ visible, onOk, onCancel }) => {
  return (
    <Modal
      footer={[
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '44px' }} key={0}>
          <Typography.Text>Нужна дополнительная помощь?</Typography.Text>
          <Typography.Link style={{ marginLeft: '8px' }}>Подробнее</Typography.Link>
        </div>,
      ]}
      visible={visible}
      onOk={onOk}
      closable={false}
      onCancel={onCancel}
    >
      <div>
        <h2>Восстановление пароля</h2>
        <Form layout="vertical" name="basic" initialValues={{ remember: true }}>
          <Form.Item
            requiredMark={'optional'}
            label="Укажите свой адрес электронной почты, воспользовавшись подсказкой в поле ввода"
            name="Email"
            rules={[{ required: true, message: 'Please input your Email!' }]}
          >
            <Input placeholder="m********in@gmail.com" size="large" />
          </Form.Item>
          <Form.Item>
            <Typography.Text type={'secondary'}>
              Если введенный вами Email совпадет с тем, что указан в вашем профиле, на него будет выслан временный
              пароль.
            </Typography.Text>
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'space-between', flexBasis: '50%', columnGap: '8px' }}>
            <Button onClick={onCancel} size="large" style={{ width: '100%' }}>
              Отмена
            </Button>
            <Button size="large" style={{ width: '100%' }} type="primary" htmlType="submit">
              Восстановить
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};
