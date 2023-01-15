import React, { FC } from 'react';
import { Snils, SnilsInformation } from '../../../../generated';
import { Button, Col, Form, Input, Row, Upload, UploadFile } from 'antd';

export type SnilsFormProps = {
  snils: Snils;
  onSubmit?: (values: SnilsInformation) => void;
  disabled?: boolean;
};

export const SnilsForm: FC<SnilsFormProps> = ({ snils, onSubmit, disabled = false }) => {
  const [form] = Form.useForm<SnilsInformation>();
  const information = snils.information;

  const document: UploadFile[] = [
    {
      uid: '-1',
      name: snils.document.originalFileName,
      status: 'done',
      url: snils.document.url,
    },
  ];

  return (
    <Form form={form} layout={'vertical'} onFinish={onSubmit} initialValues={information} disabled={disabled}>
      <Row gutter={16} align={'middle'}>
        <Col xs={8}>
          <Form.Item
            label={'СНИЛС'}
            rules={[
              {
                required: true,
                type: 'string',
                len: 14,
                pattern: /^[0-9]{3}-[0-9]{3}-[0-9]{3} [0-9]{2}$/,
                message: 'Введите корректное значение (000-000-000 00)',
              },
            ]}
            name={'number'}
          >
            <Input type={'text'} />
          </Form.Item>
        </Col>
        <Col xs={4}>
          <Upload fileList={document} disabled={true} />
        </Col>
        <Col xs={12} style={{ display: 'flex', justifyContent: 'end' }}>
          <Button type={'primary'} htmlType={'submit'} disabled={disabled}>
            OK
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
