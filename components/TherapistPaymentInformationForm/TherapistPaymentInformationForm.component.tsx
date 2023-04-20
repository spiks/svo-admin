import { Button, Col, Collapse, Form, Input, Row, Select } from 'antd';
import { Option } from 'antd/lib/mentions';
import { PaymentInformation } from 'generated';
import { TherapistPageContext } from 'pages/users/therapists/[id]';
import { FC, useContext, useEffect } from 'react';
import { useTherapistPaymentInformation } from './TherapistPaymentInformation.hooks/useTherapistPaymentInformation';

export const TherapistPaymentInformationForm: FC = () => {
  const { therapist } = useContext(TherapistPageContext);
  const [form] = Form.useForm();
  const { paymentInformation, updatePaymentInformation } = useTherapistPaymentInformation(therapist.id);

  const PAYMENT_INFORMATION_FORM_KEY = 'paymentInformationForm';
  const { Panel } = Collapse;

  useEffect(() => {
    form.setFieldsValue(paymentInformation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentInformation]);

  return (
    <section>
      <h2 style={{ marginBottom: '24px' }}>{'Банковские реквизиты'}</h2>
      <Collapse
        defaultActiveKey={['payment']}
        style={{ width: '100%', marginBottom: '24px' }}
        expandIconPosition={'end'}
      >
        <Panel
          collapsible="disabled"
          showArrow={false}
          header={
            <Row align="middle" gutter={17.5}>
              <Col>
                <Form.Item style={{ margin: '0' }} label="Реквизиты" required />
              </Col>
            </Row>
          }
          key="payment"
        >
          <Form
            onFinish={updatePaymentInformation.mutate}
            id={PAYMENT_INFORMATION_FORM_KEY}
            form={form}
            layout={'vertical'}
          >
            <Row gutter={[16, 0]} align={'top'}>
              <Col span={12}>
                <Form.Item
                  name="bankAccountNumber"
                  label="Банковские реквизиты"
                  rules={[{ required: true, pattern: /^[0-9]{20}$/, message: 'Введите корректное значение (20 цифр)' }]}
                >
                  <Input maxLength={20} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  rules={[{ required: true, pattern: /^[0-9]{20}$/, message: 'Введите корректное значение (20 цифр)' }]}
                  name={'bankCorrespondentAccount'}
                  label={'Коррсчет'}
                >
                  <Input maxLength={20} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  rules={[{ required: true, pattern: /^[0-9]{9}$/, message: 'Введите корректное значение (9 цифр)' }]}
                  name={'bankBik'}
                  label={'БИК'}
                >
                  <Input maxLength={9} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  rules={[{ required: true, message: 'Не заполнено' }]}
                  name={'bankName'}
                  label={'Название банка'}
                >
                  <Input maxLength={255} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Panel>
      </Collapse>
      <Row justify={'end'}>
        <Col>
          <Button form={PAYMENT_INFORMATION_FORM_KEY} size={'large'} htmlType={'submit'} type={'primary'}>
            {'Сохранить'}
          </Button>
        </Col>
      </Row>
    </section>
  );
};
