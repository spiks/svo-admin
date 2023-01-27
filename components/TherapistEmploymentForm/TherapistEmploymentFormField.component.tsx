import { Button, Col, Form, Input, Row } from 'antd';
import React, { FC } from 'react';
import { DeleteTwoTone } from '@ant-design/icons';

type Props = {
  name: string;
  onDeleteButtonClick: () => void;
};

export const TherapistEmploymentFormField: FC<Props> = ({ name, onDeleteButtonClick }) => {
  return (
    <Row gutter={[16, 0]} align={'top'}>
      <Col flex={'1'}>
        <Form.Item
          style={{ margin: 0 }}
          label="Практический опыт (лет)"
          rules={[
            {
              message: 'Обязательно укажите опыт',
              required: true,
            },
            {
              async validator(_, v) {
                if (Number(v) && (v < 1 || v > 30)) {
                  throw new Error('Значение от 1 до 30 лет');
                }
              },
            },
          ]}
          name={[name, 'years']}
        >
          <Input type={'number'} />
        </Form.Item>
      </Col>
      <Col flex={'1'}>
        <Form.Item
          style={{ margin: 0 }}
          label="Место работы"
          name={[name, 'companyName']}
          rules={[
            {
              required: true,
              message: 'Укажите название места работы',
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col>
        <Button type={'text'} icon={<DeleteTwoTone />} onClick={onDeleteButtonClick} />
      </Col>
    </Row>
  );
};
