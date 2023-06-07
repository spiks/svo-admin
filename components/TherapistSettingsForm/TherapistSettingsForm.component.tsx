import { Collapse, Form, Button, Input, Row, Col } from 'antd';
import { TherapistPageContext } from 'pages/users/therapists/[id]';
import { FC, useContext, useEffect } from 'react';
import {
  ServicePricingFormValues,
  useTherapistServicePricing,
} from './TherapistSettingsForm.hooks/useTherapistServicePricing';
import {
  MAX_SESSION_PRICE,
  MIN_PRICE_FOR_INDIVIDUAL_SESSION,
  MIN_PRICE_FOR_PAIR_SESSION,
} from '../../constants/sessionPrices';
import { useTherapistBan } from '../../hooks/useTherapistBan';
import { useTherapistSignupQueriesRefresh } from '../../hooks/useTherapistSignupQueries';

const { Panel } = Collapse;

export const TherapistSettingsForm: FC = () => {
  const [form] = Form.useForm<ServicePricingFormValues>();
  const { therapist } = useContext(TherapistPageContext);
  const { servicePricing, updateServicePricing } = useTherapistServicePricing(therapist.id);
  const refetch = useTherapistSignupQueriesRefresh(therapist.id);

  useEffect(() => {
    form.setFieldsValue({ ...servicePricing });
    // eslint-disable-next-line
  }, [servicePricing]);

  const { banTherapist, unbanTherapist, isMutating } = useTherapistBan({
    onSuccess() {
      refetch('therapist');
    },
  });

  const bannedStatuses = ['blocked', 'pre_blocked'];
  const banMethod = bannedStatuses.includes(therapist.status)
    ? unbanTherapist.mutate.bind(null, therapist.id)
    : banTherapist.mutate.bind(null, therapist.id);
  const banWord = bannedStatuses.includes(therapist.status)
    ? 'Разблокировать пользователя'
    : 'Заблокировать пользователя';

  return (
    <section>
      <Collapse defaultActiveKey={'pricing'} expandIconPosition={'end'}>
        <Panel key={'pricing'} header={'Стоимость оказания услуг'}>
          <Form onFinish={updateServicePricing.mutate} form={form} size="large" layout={'vertical'}>
            <Row gutter={[16, 0]} align={'bottom'}>
              <Col flex={'1 1'}>
                <Form.Item
                  rules={[
                    {
                      pattern: /^[0-9]\d*$/,
                      message: 'Неверный формат',
                    },
                    {
                      async validator(_, value) {
                        if (!value) {
                          return;
                        }
                        // Временно минимальная стоимость сеанса 10 рублей, потом вернуть MIN_PRICE_FOR_INDIVIDUAL_SESSION
                        if (value && value < 10) {
                          throw new Error(
                            `Минимальная стоимость сеанса ${Intl.NumberFormat('ru-RU').format(10)}\u20bd`,
                          );
                        }
                        if (value > MAX_SESSION_PRICE) {
                          throw new Error(
                            `Макисмальная стоимость сеанса ${Intl.NumberFormat('ru-RU').format(
                              MAX_SESSION_PRICE,
                            )}\u20bd`,
                          );
                        }
                      },
                    },
                  ]}
                  label="Стоимость индивидуального сеанса"
                  name="forIndividualSession"
                >
                  <Input suffix={'Руб'} />
                </Form.Item>
              </Col>
              <Col flex={'1 1'}>
                <Form.Item
                  rules={[
                    {
                      pattern: /^[0-9]\d*$/,
                      message: 'Неверный формат',
                    },
                    {
                      async validator(_, value) {
                        if (!value) {
                          return;
                        }
                        // Временно минимальная стоимость сеанса 10 рублей, потом вернуть MIN_PRICE_FOR_PAIR_SESSION,
                        if (value < 10) {
                          throw new Error(
                            `Минимальная стоимость сеанса ${Intl.NumberFormat('ru-RU').format(10)}\u20bd`,
                          );
                        }
                        if (value > MAX_SESSION_PRICE) {
                          throw new Error(
                            `Макисмальная стоимость сеанса ${Intl.NumberFormat('ru-RU').format(
                              MAX_SESSION_PRICE,
                            )}\u20bd`,
                          );
                        }
                      },
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Button
          loading={isMutating}
          size="large"
          onClick={() => {
            banMethod();
          }}
          style={{
            marginTop: '24px',
          }}
          danger={true}
        >
          {banWord}
        </Button>
      </div>
    </section>
  );
};
