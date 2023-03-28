import React, { FC, useCallback, useState } from 'react';
import { Button, Form, Modal, ModalProps, Typography } from 'antd';
import { useRegisterTherapist } from '@components/RegisterTherapistModal/RegisterTherapistModal.hooks/useRegisterTherapist';
import CountryPhoneInput, { CountryPhoneInputValue } from 'antd-country-phone-input';
import { CountryCode, getCountryCallingCode, isPossiblePhoneNumber } from 'libphonenumber-js';

export type RegisterTherapistForm = { phone: CountryPhoneInputValue };
export type RegisterTherapistModalProps = Omit<ModalProps, 'footer' | 'onCancel'> & {
  onCancel: () => void;
};

export const RegisterTherapistModal: FC<RegisterTherapistModalProps> = (props) => {
  const [form] = Form.useForm<RegisterTherapistForm>();

  const [registeredId, setRegisteredId] = useState<null | string>(null);

  const handleCancel = useCallback(() => {
    form.resetFields();
    setRegisteredId(null);
    props.onCancel();
  }, [form, props]);

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

  const submitForm = () => {
    form.submit();
  };

  return (
    <Modal
      {...props}
      afterClose={handleCancel}
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
          const { phone } = values;
          registerTherapist.mutate({
            phone: '+' + getCountryCallingCode(phone.short as CountryCode) + phone.phone,
          });
        }}
        initialValues={{
          phone: { short: 'RU' },
        }}
        disabled={registerTherapist.isLoading}
      >
        <Form.Item
          name={'phone'}
          label={'Номер телефона'}
          required={true}
          validateTrigger={'onSubmit'}
          rules={[
            {
              async validator(_, value) {
                if (!value.short) {
                  throw new Error('Выберите код страны');
                } else if (!value.phone) {
                  throw new Error('Введите номер телефона');
                }
                const isLengthValid = isPossiblePhoneNumber(
                  '+' + getCountryCallingCode(value.short) + value.phone,
                  value.short,
                );

                if (!isLengthValid) {
                  throw new Error('Неверная длина номера');
                }
              },
            },
          ]}
        >
          <CountryPhoneInput />
        </Form.Item>
      </Form>
    </Modal>
  );
};
