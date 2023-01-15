import React, { FC, useEffect, useState } from 'react';
import { Button, Form, Input, Modal, ModalProps, Typography } from 'antd';
import { useRegisterTherapist } from '@components/RegisterTherapistModal/RegisterTherapistModal.hooks/useRegisterTherapist';

const normalizePhone = (phone: unknown): string => {
  if (typeof phone !== 'string') {
    throw new Error(`Номер телефона представляет из себя строку: ${phone}`);
  }

  const norm = '+' + phone.match(/\d+/g)?.join('');
  const regexp = /^\+7[0-9]{10}$/;

  if (!regexp.test(norm)) {
    throw new Error(`Переданное значение невозможно нормализовать: ${phone}`);
  }

  return norm;
};

export type RegisterTherapistForm = { phone: string };
export type RegisterTherapistModalProps = Omit<ModalProps, 'footer' | 'onCancel'> & {
  onCancel: () => void;
};

export const RegisterTherapistModal: FC<RegisterTherapistModalProps> = (props) => {
  const [form] = Form.useForm<RegisterTherapistForm>();

  const [registeredId, setRegisteredId] = useState<null | string>(null);
  const registerTherapist = useRegisterTherapist({
    onDone: (therapistId) => {
      setRegisteredId(therapistId);
    },
    onFail: (_, message) => {
      form.setFields([
        {
          name: 'phone',
          value: form.getFieldValue('phone'),
          errors: [message],
        },
      ]);
    },
  });

  const [cachedPhone, setCachedPhone] = useState<null | string>(null);
  const phone = Form.useWatch('phone', form);
  useEffect(() => {
    const attemptToRegisterAnotherPhone = !registeredId || !cachedPhone || cachedPhone === phone;
    if (!attemptToRegisterAnotherPhone) {
      return;
    }

    setCachedPhone(null);
    setRegisteredId(null);
    registerTherapist.reset();
  }, [cachedPhone, phone, registerTherapist, registeredId]);

  const handleCancel = () => {
    props.onCancel && props.onCancel();
  };

  const submitForm = () => {
    form.submit();
  };

  return (
    <Modal
      {...props}
      footer={[
        <Button key={'back'} htmlType={'button'} onClick={handleCancel} hidden={!!registeredId}>
          Отмена
        </Button>,
        <Button
          key={'submit'}
          type={'primary'}
          htmlType={'button'}
          loading={registerTherapist.isLoading}
          {...(registeredId ? { href: `/users/therapists/${registeredId}` } : { onClick: submitForm })}
        >
          {registeredId ? 'Перейти в профиль созданного терапевта' : 'Зарегистрировать'}
        </Button>,
      ]}
    >
      <Typography.Title level={3}>Регистрация терапевта</Typography.Title>
      <Form
        form={form}
        layout={'vertical'}
        onFinish={(values) => {
          setCachedPhone(values.phone);
          registerTherapist.mutate({ phone: normalizePhone(values.phone) });
        }}
        disabled={registerTherapist.isLoading}
      >
        <Form.Item
          name={'phone'}
          label={'Номер телефона'}
          rules={[
            {
              async validator(_, value) {
                try {
                  normalizePhone(value);
                } catch (err) {
                  throw new Error('Введите корректное значение (+7 000 000 00 00)');
                }
              },
            },
          ]}
          required={true}
          validateTrigger={'onSubmit'}
        >
          <Input type={'tel'} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
