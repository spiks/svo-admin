import { Collapse, Form, Button, Input, Row, Col } from 'antd';
import { TherapistPageContext } from 'pages/users/therapists/[id]';
import { FC, useContext, useEffect } from 'react';
import {
  ServicePricingFormValues,
  useTherapistServicePricing,
} from './TherapistSettingsForm.hooks/useTherapistServicePricing';

const { Panel } = Collapse;

export const TherapistSettingsForm: FC = () => {
  const [form] = Form.useForm<ServicePricingFormValues>();
  const { therapist } = useContext(TherapistPageContext);
  const { servicePricing, updateServicePricing } = useTherapistServicePricing(therapist.id);

  useEffect(() => {
    form.setFieldsValue({ ...servicePricing });
    // eslint-disable-next-line
  }, [servicePricing]);

  return (
    <section>
      <Collapse defaultActiveKey={'pricing'} expandIconPosition={'end'}>
        <Panel key={'pricing'} header={'Стоимость оказания услуг'}>
          <Form onFinish={updateServicePricing.mutate} form={form} size="large" layout={'vertical'}>
            <Row gutter={[16, 0]} align={'bottom'}>
              <Col flex={1}>
                <Form.Item
                  rules={[
                    {
                      pattern: /^[1-9]\d*$/,
                      message: 'Неверный формат',
                    },
                  ]}
                  label="Стоимость индивидуального сеанса"
                  name="forIndividualSession"
                >
                  <Input suffix={'Руб'} />
                </Form.Item>
              </Col>
              <Col flex={1}>
                <Form.Item
                  rules={[
                    {
                      pattern: /^[1-9]\d*$/,
                      message: 'Неверный формат',
                    },
                  ]}
                  label="Стоимость сеанса для пары"
                  name="forPairSession"
                >
                  <Input suffix={'Руб'} />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    ОК
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Panel>
      </Collapse>
    </section>
  );
};
