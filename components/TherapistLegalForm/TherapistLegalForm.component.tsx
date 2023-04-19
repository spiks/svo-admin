import { Button, Col, Collapse, Form, Input, Row, Select } from 'antd';
import { Option } from 'antd/lib/mentions';
import { TherapistPageContext } from 'pages/users/therapists/[id]';
import { FC, useContext, useEffect } from 'react';
import { useTherapistLegalForm } from './TherapistLegalFrom.hooks/useTherapistLegalForm';

export const TherapistLegalForm: FC = () => {
  const { therapist } = useContext(TherapistPageContext);
  const [form] = Form.useForm();
  const { legalForm, updateLegalForm } = useTherapistLegalForm(therapist.id);
  const LEGAL_FORM_KEY = 'legalForm';
  const { Panel } = Collapse;

  useEffect(() => {
    form.setFieldsValue(legalForm);
    // eslint-disable-next-line
  }, [legalForm]);

  return (
    <section>
      <h2 style={{ marginBottom: '24px' }}>{'Юридические данные'}</h2>
      <Collapse defaultActiveKey={['legal']} style={{ width: '100%', marginBottom: '24px' }} expandIconPosition={'end'}>
        <Panel
          collapsible="disabled"
          showArrow={false}
          header={
            <Row align="middle" gutter={17.5}>
              <Col>
                <Form.Item style={{ margin: '0' }} label="Юридический статус" required />
              </Col>
            </Row>
          }
          key="legal"
        >
          <Form onFinish={updateLegalForm.mutate} id={LEGAL_FORM_KEY} form={form} layout={'vertical'}>
            <Row gutter={[16, 0]} align={'top'}>
              <Col flex={'1'}>
                <Form.Item name="type" label="Вид деятельности" rules={[{ required: true, message: 'Не заполнено' }]}>
                  <Select
                    onChange={() => {
                      form.resetFields(['ogrnip']);
                    }}
                  >
                    <Option value="self_employed">{'Самозанятый'}</Option>
                    <Option value="individual_entrepreneur">{'Индивидуальный предприниматель'}</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col flex={'1'}>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) => {
                    return prevValues.type !== currentValues.type;
                  }}
                >
                  {({ getFieldValue }) =>
                    getFieldValue('type') === 'individual_entrepreneur' ? (
                      <Form.Item
                        name="ogrnip"
                        label="ОГРНИП"
                        rules={[
                          {
                            required: true,
                            type: 'string',
                            pattern: /^[0-9]{15}$/,
                            message: 'Введите корректное значение (15 цифр)',
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    ) : null
                  }
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Panel>
      </Collapse>
      <Row justify={'end'}>
        <Col>
          <Button form={LEGAL_FORM_KEY} size={'large'} htmlType={'submit'} type={'primary'}>
            {'Сохранить'}
          </Button>
        </Col>
      </Row>
    </section>
  );
};
