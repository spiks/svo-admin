import { Button, Col, Form, Input, Row } from 'antd';
import React, { FC } from 'react';
import { DeleteTwoTone } from '@ant-design/icons';

type Props = {
  name: string;
  onDeleteButtonClick: () => void;
};

export const TherapistEmploymentFormField: FC<Props> = ({ name, onDeleteButtonClick }) => {
  return (
    <Row gutter={[16, 0]} align={'bottom'}>
      <Col flex={'1'}>
        <Form.Item style={{ margin: 0 }} label="Практический опыт (лет)" name={[name, 'years']}>
          <Input type={'number'} max={100} />
        </Form.Item>
      </Col>
      <Col flex={'1'}>
        <Form.Item style={{ margin: 0 }} label="Место работы" name={[name, 'companyName']}>
          <Input required />
        </Form.Item>
      </Col>
      <Col>
        <Button type={'text'} icon={<DeleteTwoTone />} onClick={onDeleteButtonClick} />
      </Col>
    </Row>
  );
};
