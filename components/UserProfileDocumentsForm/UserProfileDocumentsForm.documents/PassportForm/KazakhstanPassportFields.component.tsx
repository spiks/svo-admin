import React, { FC } from 'react';
import { Col, Form, Input, Row } from 'antd';
import { required } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.documents/PassportForm/PassportForm.rules/required.rule';
import { type } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.documents/PassportForm/PassportForm.rules/type.rule';
import { kzNumber } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.documents/PassportForm/PassportForm.rules/kzNumber.rule';

export const KazakhstanPassportFields: FC = () => {
  return (
    <Row gutter={32}>
      <Col xs={12}>
        <Form.Item label={'Тип паспорта'} name={'type'} rules={[required, type]}>
          <Input type={'text'} />
        </Form.Item>
      </Col>
      <Col xs={12}>
        <Form.Item label={'Номер паспорта'} name={'number'} rules={[required, kzNumber]}>
          <Input type={'text'} />
        </Form.Item>
      </Col>
    </Row>
  );
};
