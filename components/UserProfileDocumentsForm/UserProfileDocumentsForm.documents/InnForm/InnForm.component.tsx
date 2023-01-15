import React, { FC } from 'react';
import { Inn, InnInformation } from '../../../../generated';
import { Button, Col, Form, Input, Row, Upload, UploadFile } from 'antd';

export type InnFormProps = {
  inn: Inn;
  onSubmit?: (values: InnInformation) => void;
  disabled?: boolean;
};

export const InnForm: FC<InnFormProps> = ({ inn, onSubmit, disabled = false }) => {
  const [form] = Form.useForm<InnInformation>();
  const information = inn.information;

  const document: UploadFile[] = [
    {
      uid: '-1',
      name: inn.document.originalFileName,
      status: 'done',
      url: inn.document.url,
    },
  ];

  return (
    <Form form={form} layout={'vertical'} onFinish={onSubmit} initialValues={information} disabled={disabled}>
      <Row gutter={16} align={'middle'}>
        <Col xs={8}>
          <Form.Item
            label={'ИНН'}
            rules={[
              {
                required: true,
                type: 'string',
                min: 10,
                max: 12,
                pattern: /^(?:[0-9]{10}|[0-9]{12})$/,
                message: 'Введите корректное значение (000000000000)',
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
